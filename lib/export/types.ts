/**
 * Type definitions for the Animation Export System
 */

/**
 * Supported frame formats
 */
export enum FrameFormat {
  DATA_URL = 'data_url',
  CANVAS = 'canvas',
  IMAGE_ELEMENT = 'image_element',
  IMAGE_DATA = 'image_data',
  UNKNOWN = 'unknown'
}

/**
 * Input frame data structure
 */
export interface Frame {
  data: string | HTMLCanvasElement | HTMLImageElement | ImageData;
  width: number;
  height: number;
  index: number;
}

/**
 * Processed frame with normalized format
 */
export interface ProcessedFrame {
  dataUrl: string;  // base64 encoded image
  width: number;
  height: number;
  index: number;
}

/**
 * Export configuration options
 */
export interface ExportConfig {
  frameRate: number;           // FPS (default: 30)
  loop: boolean;               // Loop animation (default: true)
  autoplay: boolean;           // Start automatically (default: true)
  width?: number;              // Canvas width (default: frame width)
  height?: number;             // Canvas height (default: frame height)
  backgroundColor?: string;    // Canvas background (default: transparent)
  showControls: boolean;       // Display playback controls (default: true)
  playbackSpeed: number;       // Speed multiplier (default: 1.0)
}

/**
 * Export progress information
 */
export interface ExportProgress {
  stage: 'processing' | 'generating' | 'downloading' | 'complete' | 'error';
  percentage: number;
  message: string;
  fileSize?: number;
}

/**
 * Export operation result
 */
export interface ExportResult {
  success: boolean;
  fileName: string;
  fileSize: number;
  error?: string;
}
