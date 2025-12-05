/**
 * Custom error classes for the Animation Export System
 */

/**
 * Error thrown when a frame format is not supported
 */
export class UnsupportedFrameFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedFrameFormatError';
  }
}

/**
 * Error thrown when frame dimensions don't match expected values
 */
export class FrameDimensionMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FrameDimensionMismatchError';
  }
}

/**
 * Error thrown when frame encoding fails
 */
export class FrameEncodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FrameEncodingError';
  }
}

/**
 * Error thrown when HTML template rendering fails
 */
export class TemplateRenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TemplateRenderError';
  }
}

/**
 * Error thrown when export configuration is invalid
 */
export class InvalidConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidConfigError';
  }
}

/**
 * Error thrown when blob creation fails
 */
export class BlobCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlobCreationError';
  }
}

/**
 * Error thrown when browser blocks download
 */
export class DownloadBlockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DownloadBlockedError';
  }
}
