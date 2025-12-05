/**
 * Export Orchestrator
 * Coordinates the export process and manages state
 */

import { Frame, ProcessedFrame, ExportConfig, ExportProgress, ExportResult } from './types';
import { FrameProcessor } from './frame-processor';
import { HTMLGenerator, DEFAULT_EXPORT_CONFIG } from './html-generator';
import { FileDownloadService } from './file-download-service';

/**
 * Progress callback function type
 */
export type ProgressCallback = (progress: ExportProgress) => void;

/**
 * Frame size threshold for optimization (in bytes)
 * If total frame data exceeds this, apply optimization
 */
const OPTIMIZATION_THRESHOLD = 5 * 1024 * 1024; // 5MB

/**
 * JPEG quality for optimization (0-1)
 */
const OPTIMIZATION_QUALITY = 0.85;

/**
 * Export Orchestrator class
 * Coordinates frame processing, HTML generation, and file download
 */
export class ExportOrchestrator {
  private frameProcessor: FrameProcessor;
  private htmlGenerator: HTMLGenerator;
  private fileDownloadService: FileDownloadService;
  private progressCallback?: ProgressCallback;
  private isCancelled: boolean = false;

  constructor() {
    this.frameProcessor = new FrameProcessor();
    this.htmlGenerator = new HTMLGenerator();
    this.fileDownloadService = new FileDownloadService();
  }

  /**
   * Register a progress callback
   * @param callback - Function to call with progress updates
   */
  onProgress(callback: ProgressCallback): void {
    this.progressCallback = callback;
  }

  /**
   * Cancel the current export operation
   */
  cancel(): void {
    this.isCancelled = true;
  }

  /**
   * Report progress to the registered callback
   */
  private reportProgress(progress: ExportProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  /**
   * Main export workflow
   * @param frames - Array of frames to export
   * @param config - Export configuration (optional, uses defaults if not provided)
   * @returns Promise resolving to ExportResult
   */
  async export(frames: Frame[], config?: Partial<ExportConfig>): Promise<ExportResult> {
    // Reset cancellation flag
    this.isCancelled = false;

    // Merge config with defaults
    const fullConfig: ExportConfig = {
      ...DEFAULT_EXPORT_CONFIG,
      ...config
    };

    try {
      // Validate input frames
      if (!frames || frames.length === 0) {
        throw new Error('No frames provided for export');
      }

      // Process frames with progress updates (0-50%)
      this.reportProgress({
        stage: 'processing',
        percentage: 0,
        message: 'Processing frames...'
      });

      if (this.isCancelled) {
        throw new Error('Export cancelled by user');
      }

      const processedFrames = await this.processFramesWithProgress(frames);

      if (this.isCancelled) {
        throw new Error('Export cancelled by user');
      }

      // Generate HTML with progress updates (50-80%)
      this.reportProgress({
        stage: 'generating',
        percentage: 50,
        message: 'Generating HTML...'
      });

      const html = this.htmlGenerator.generate(processedFrames, fullConfig);

      if (this.isCancelled) {
        throw new Error('Export cancelled by user');
      }

      // Calculate file size with progress update (80-90%)
      this.reportProgress({
        stage: 'generating',
        percentage: 80,
        message: 'Calculating file size...'
      });

      const fileSize = this.fileDownloadService.calculateSize(html);

      if (this.isCancelled) {
        throw new Error('Export cancelled by user');
      }

      // Trigger download with progress update (90-100%)
      this.reportProgress({
        stage: 'downloading',
        percentage: 90,
        message: 'Preparing download...',
        fileSize
      });

      const fileName = this.generateFileName();
      this.fileDownloadService.download(html, fileName);

      // Report completion
      this.reportProgress({
        stage: 'complete',
        percentage: 100,
        message: 'Export complete!',
        fileSize
      });

      // Return success result
      return {
        success: true,
        fileName,
        fileSize
      };

    } catch (error) {
      // Report error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      this.reportProgress({
        stage: 'error',
        percentage: 0,
        message: errorMessage
      });

      // Return error result
      return {
        success: false,
        fileName: '',
        fileSize: 0,
        error: errorMessage
      };
    }
  }

  /**
   * Process frames with progress updates
   */
  private async processFramesWithProgress(frames: Frame[]): Promise<ProcessedFrame[]> {
    const processedFrames: ProcessedFrame[] = [];
    const totalFrames = frames.length;

    for (let i = 0; i < totalFrames; i++) {
      if (this.isCancelled) {
        throw new Error('Export cancelled by user');
      }

      try {
        const processed = await this.frameProcessor.processFrame(frames[i]);
        processedFrames.push(processed);

        // Update progress (0-50% range)
        const percentage = Math.floor((i + 1) / totalFrames * 50);
        this.reportProgress({
          stage: 'processing',
          percentage,
          message: `Processing frame ${i + 1} of ${totalFrames}...`
        });

        // Yield to the event loop every frame to keep UI responsive
        await this.yieldToEventLoop();
      } catch (error) {
        // Wrap frame processor errors with context
        throw new Error(
          `Frame processing failed at frame ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Apply optimization if needed
    const optimizedFrames = await this.optimizeFramesIfNeeded(processedFrames);

    return optimizedFrames;
  }

  /**
   * Yield control back to the event loop to keep UI responsive
   */
  private yieldToEventLoop(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  /**
   * Calculate total size of frame data
   */
  private calculateFrameDataSize(frames: ProcessedFrame[]): number {
    let totalSize = 0;
    for (const frame of frames) {
      // Estimate size based on data URL length
      totalSize += frame.dataUrl.length;
    }
    return totalSize;
  }

  /**
   * Optimize frames if total size exceeds threshold
   */
  private async optimizeFramesIfNeeded(frames: ProcessedFrame[]): Promise<ProcessedFrame[]> {
    const totalSize = this.calculateFrameDataSize(frames);

    // Check if optimization is needed
    if (totalSize <= OPTIMIZATION_THRESHOLD) {
      return frames;
    }

    // Apply optimization
    this.reportProgress({
      stage: 'processing',
      percentage: 45,
      message: `Optimizing frames (${Math.round(totalSize / 1024 / 1024)}MB detected)...`
    });

    const optimizedFrames: ProcessedFrame[] = [];

    for (let i = 0; i < frames.length; i++) {
      if (this.isCancelled) {
        throw new Error('Export cancelled by user');
      }

      const frame = frames[i];
      
      // Convert to JPEG with quality reduction if it's a PNG
      if (frame.dataUrl.startsWith('data:image/png')) {
        const optimized = await this.convertToJPEG(frame, OPTIMIZATION_QUALITY);
        optimizedFrames.push(optimized);
      } else {
        optimizedFrames.push(frame);
      }

      // Yield to event loop to keep UI responsive
      await this.yieldToEventLoop();
    }

    const optimizedSize = this.calculateFrameDataSize(optimizedFrames);
    const savings = totalSize - optimizedSize;
    const savingsPercent = Math.round((savings / totalSize) * 100);

    this.reportProgress({
      stage: 'processing',
      percentage: 50,
      message: `Optimization complete (saved ${savingsPercent}%)`
    });

    return optimizedFrames;
  }

  /**
   * Convert a frame to JPEG format with specified quality
   */
  private async convertToJPEG(frame: ProcessedFrame, quality: number): Promise<ProcessedFrame> {
    return new Promise((resolve, reject) => {
      try {
        // Create an image from the data URL
        const img = new Image();
        
        img.onload = () => {
          try {
            // Create a canvas to re-encode the image
            const canvas = document.createElement('canvas');
            canvas.width = frame.width;
            canvas.height = frame.height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to get 2D context'));
              return;
            }

            // Draw the image
            ctx.drawImage(img, 0, 0);

            // Convert to JPEG with quality setting
            const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);

            resolve({
              ...frame,
              dataUrl: jpegDataUrl
            });
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image for optimization'));
        };

        img.src = frame.dataUrl;
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate a filename with timestamp
   */
  private generateFileName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `animation-export-${year}${month}${day}-${hours}${minutes}${seconds}.html`;
  }
}
