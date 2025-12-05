/**
 * Frame Processor
 * Handles frame format detection, conversion, and encoding
 */

import { Frame, ProcessedFrame, FrameFormat } from './types';
import { UnsupportedFrameFormatError, FrameEncodingError } from './errors';

/**
 * Frame Processor interface
 */
export interface IFrameProcessor {
  processFrame(frame: Frame): Promise<ProcessedFrame>;
  processFrames(frames: Frame[]): Promise<ProcessedFrame[]>;
  detectFormat(data: any): FrameFormat;
  validateFrame(frame: Frame): boolean;
}

/**
 * Frame Processor implementation
 */
export class FrameProcessor implements IFrameProcessor {
  /**
   * Detect the format of frame data
   */
  detectFormat(data: any): FrameFormat {
    // Check for data URL (string starting with "data:")
    if (typeof data === 'string' && data.startsWith('data:')) {
      return FrameFormat.DATA_URL;
    }

    // Check for HTMLCanvasElement
    if (typeof HTMLCanvasElement !== 'undefined' && data instanceof HTMLCanvasElement) {
      return FrameFormat.CANVAS;
    }

    // Check for HTMLImageElement
    if (typeof HTMLImageElement !== 'undefined' && data instanceof HTMLImageElement) {
      return FrameFormat.IMAGE_ELEMENT;
    }

    // Check for ImageData - must check constructor name or use duck typing
    if (data && typeof data === 'object' && 'data' in data && 'width' in data && 'height' in data) {
      // ImageData has a Uint8ClampedArray data property
      if (data.data && (data.data instanceof Uint8ClampedArray || data.data.constructor?.name === 'Uint8ClampedArray')) {
        return FrameFormat.IMAGE_DATA;
      }
    }

    return FrameFormat.UNKNOWN;
  }

  /**
   * Validate a frame
   */
  validateFrame(frame: Frame): boolean {
    // Check frame has required properties
    if (!frame || typeof frame !== 'object') {
      return false;
    }

    // Check width and height are positive numbers (and not NaN)
    if (typeof frame.width !== 'number' || frame.width <= 0 || isNaN(frame.width)) {
      return false;
    }

    if (typeof frame.height !== 'number' || frame.height <= 0 || isNaN(frame.height)) {
      return false;
    }

    // Check index is a non-negative number (and not NaN)
    if (typeof frame.index !== 'number' || frame.index < 0 || isNaN(frame.index)) {
      return false;
    }

    // Check data exists
    if (!frame.data) {
      return false;
    }

    // Check format is supported
    const format = this.detectFormat(frame.data);
    if (format === FrameFormat.UNKNOWN) {
      return false;
    }

    return true;
  }

  /**
   * Convert frame data to data URL
   */
  private async convertToDataUrl(data: any, format: FrameFormat, width: number, height: number): Promise<string> {
    switch (format) {
      case FrameFormat.DATA_URL:
        // Already a data URL, return as-is
        return data as string;

      case FrameFormat.CANVAS:
        // Convert canvas to data URL
        try {
          const canvas = data as HTMLCanvasElement;
          return canvas.toDataURL('image/png');
        } catch (error) {
          throw new FrameEncodingError(`Failed to encode canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

      case FrameFormat.IMAGE_ELEMENT:
        // Convert image element to data URL via temporary canvas
        try {
          const img = data as HTMLImageElement;
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new FrameEncodingError('Failed to get 2D context from canvas');
          }
          ctx.drawImage(img, 0, 0, width, height);
          return canvas.toDataURL('image/png');
        } catch (error) {
          throw new FrameEncodingError(`Failed to encode image element: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

      case FrameFormat.IMAGE_DATA:
        // Convert ImageData to data URL via temporary canvas
        try {
          const imageData = data as ImageData;
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new FrameEncodingError('Failed to get 2D context from canvas');
          }
          ctx.putImageData(imageData, 0, 0);
          return canvas.toDataURL('image/png');
        } catch (error) {
          throw new FrameEncodingError(`Failed to encode ImageData: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

      default:
        throw new UnsupportedFrameFormatError(`Unsupported frame format: ${format}`);
    }
  }

  /**
   * Process a single frame
   */
  async processFrame(frame: Frame): Promise<ProcessedFrame> {
    // Validate frame
    if (!this.validateFrame(frame)) {
      const format = this.detectFormat(frame.data);
      if (format === FrameFormat.UNKNOWN) {
        throw new UnsupportedFrameFormatError(
          `Frame at index ${frame.index} has unsupported format. Supported formats: PNG, JPEG, WebP data URLs, Canvas elements, ImageData`
        );
      }
      throw new FrameEncodingError(`Frame at index ${frame.index} failed validation`);
    }

    // Detect format
    const format = this.detectFormat(frame.data);

    // Convert to data URL
    const dataUrl = await this.convertToDataUrl(frame.data, format, frame.width, frame.height);

    return {
      dataUrl,
      width: frame.width,
      height: frame.height,
      index: frame.index
    };
  }

  /**
   * Process multiple frames
   */
  async processFrames(frames: Frame[]): Promise<ProcessedFrame[]> {
    const processedFrames: ProcessedFrame[] = [];

    for (const frame of frames) {
      const processed = await this.processFrame(frame);
      processedFrames.push(processed);
    }

    return processedFrames;
  }
}
