/**
 * Frame Processor Tests
 * Property-based and unit tests for frame processing functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { FrameProcessor } from '../frame-processor';
import { Frame, FrameFormat } from '../types';
import { UnsupportedFrameFormatError, FrameEncodingError } from '../errors';

describe('FrameProcessor', () => {
  let processor: FrameProcessor;

  beforeEach(() => {
    processor = new FrameProcessor();
  });

  // Helper function to create a mock canvas
  function createMockCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw a simple pattern
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, width, height);
    }
    return canvas;
  }

  // Helper function to create a mock image element
  function createMockImage(width: number, height: number): HTMLImageElement {
    const img = new Image();
    img.width = width;
    img.height = height;
    // Create a data URL for the image
    const canvas = createMockCanvas(width, height);
    img.src = canvas.toDataURL('image/png');
    return img;
  }

  // Helper function to create mock ImageData
  function createMockImageData(width: number, height: number): ImageData {
    const canvas = createMockCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    return ctx.getImageData(0, 0, width, height);
  }

  // Arbitrary for generating valid dimensions
  const validDimensionArb = fc.integer({ min: 1, max: 1000 });

  // Arbitrary for generating valid frame indices
  const validIndexArb = fc.integer({ min: 0, max: 10000 });

  // Arbitrary for generating data URLs
  const dataUrlArb = fc.oneof(
    fc.constant('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='),
    fc.constant('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k='),
    fc.constant('data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=')
  );

  // Arbitrary for generating frames with supported formats
  const supportedFrameArb = fc.tuple(validDimensionArb, validDimensionArb, validIndexArb, dataUrlArb).map(
    ([width, height, index, dataUrl]) => ({
      data: dataUrl,
      width,
      height,
      index
    })
  );

  // Arbitrary for generating unsupported frame data
  const unsupportedDataArb = fc.oneof(
    fc.constant(null),
    fc.constant(undefined),
    fc.constant(123),
    fc.constant(true),
    fc.constant({}),
    fc.constant([]),
    fc.string().filter(s => !s.startsWith('data:')),
    fc.constant({ notImageData: true })
  );

  // Feature: animation-export, Property 4: Frame format acceptance
  describe('Property 4: Frame format acceptance', () => {
    it('should accept and process PNG data URLs', async () => {
      await fc.assert(
        fc.asyncProperty(validDimensionArb, validDimensionArb, validIndexArb, async (width, height, index) => {
          const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
          const frame: Frame = { data: dataUrl, width, height, index };

          const result = await processor.processFrame(frame);

          expect(result.dataUrl).toBeDefined();
          expect(typeof result.dataUrl).toBe('string');
          expect(result.dataUrl.startsWith('data:')).toBe(true);
          expect(result.width).toBe(width);
          expect(result.height).toBe(height);
          expect(result.index).toBe(index);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept and process JPEG data URLs', async () => {
      await fc.assert(
        fc.asyncProperty(validDimensionArb, validDimensionArb, validIndexArb, async (width, height, index) => {
          const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';
          const frame: Frame = { data: dataUrl, width, height, index };

          const result = await processor.processFrame(frame);

          expect(result.dataUrl).toBeDefined();
          expect(typeof result.dataUrl).toBe('string');
          expect(result.dataUrl.startsWith('data:')).toBe(true);
          expect(result.width).toBe(width);
          expect(result.height).toBe(height);
          expect(result.index).toBe(index);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept and process WebP data URLs', async () => {
      await fc.assert(
        fc.asyncProperty(validDimensionArb, validDimensionArb, validIndexArb, async (width, height, index) => {
          const dataUrl = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
          const frame: Frame = { data: dataUrl, width, height, index };

          const result = await processor.processFrame(frame);

          expect(result.dataUrl).toBeDefined();
          expect(typeof result.dataUrl).toBe('string');
          expect(result.dataUrl.startsWith('data:')).toBe(true);
          expect(result.width).toBe(width);
          expect(result.height).toBe(height);
          expect(result.index).toBe(index);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept and process Canvas elements', async () => {
      await fc.assert(
        fc.asyncProperty(validDimensionArb, validDimensionArb, validIndexArb, async (width, height, index) => {
          const canvas = createMockCanvas(width, height);
          const frame: Frame = { data: canvas, width, height, index };

          const result = await processor.processFrame(frame);

          expect(result.dataUrl).toBeDefined();
          expect(typeof result.dataUrl).toBe('string');
          expect(result.dataUrl.startsWith('data:')).toBe(true);
          expect(result.width).toBe(width);
          expect(result.height).toBe(height);
          expect(result.index).toBe(index);
        }),
        { numRuns: 100 }
      );
    });

    it('should accept and process ImageData', async () => {
      await fc.assert(
        fc.asyncProperty(validDimensionArb, validDimensionArb, validIndexArb, async (width, height, index) => {
          const imageData = createMockImageData(width, height);
          const frame: Frame = { data: imageData, width, height, index };

          const result = await processor.processFrame(frame);

          expect(result.dataUrl).toBeDefined();
          expect(typeof result.dataUrl).toBe('string');
          expect(result.dataUrl.startsWith('data:')).toBe(true);
          expect(result.width).toBe(width);
          expect(result.height).toBe(height);
          expect(result.index).toBe(index);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: animation-export, Property 5: Unsupported format rejection
  describe('Property 5: Unsupported format rejection', () => {
    it('should reject frames with unsupported formats', async () => {
      await fc.assert(
        fc.asyncProperty(validDimensionArb, validDimensionArb, validIndexArb, unsupportedDataArb, async (width, height, index, unsupportedData) => {
          const frame: Frame = { data: unsupportedData as any, width, height, index };

          await expect(processor.processFrame(frame)).rejects.toThrow(UnsupportedFrameFormatError);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject frames with invalid dimensions', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(fc.integer({ max: 0 }), fc.constant(NaN), fc.constant(-1)),
          validIndexArb,
          dataUrlArb,
          async (invalidDimension, index, dataUrl) => {
            const frame: Frame = { data: dataUrl, width: invalidDimension, height: 100, index };

            await expect(processor.processFrame(frame)).rejects.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject frames with invalid index', async () => {
      await fc.assert(
        fc.asyncProperty(
          validDimensionArb,
          validDimensionArb,
          fc.oneof(fc.integer({ max: -1 }), fc.constant(NaN)),
          dataUrlArb,
          async (width, height, invalidIndex, dataUrl) => {
            const frame: Frame = { data: dataUrl, width, height, index: invalidIndex };

            await expect(processor.processFrame(frame)).rejects.toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Unit tests for format detection
  describe('Format Detection', () => {
    it('should detect DATA_URL format', () => {
      const dataUrl = 'data:image/png;base64,abc123';
      expect(processor.detectFormat(dataUrl)).toBe(FrameFormat.DATA_URL);
    });

    it('should detect CANVAS format', () => {
      const canvas = createMockCanvas(10, 10);
      expect(processor.detectFormat(canvas)).toBe(FrameFormat.CANVAS);
    });

    it('should detect IMAGE_DATA format', () => {
      const imageData = createMockImageData(10, 10);
      expect(processor.detectFormat(imageData)).toBe(FrameFormat.IMAGE_DATA);
    });

    it('should detect UNKNOWN format for unsupported data', () => {
      expect(processor.detectFormat(null)).toBe(FrameFormat.UNKNOWN);
      expect(processor.detectFormat(123)).toBe(FrameFormat.UNKNOWN);
      expect(processor.detectFormat({})).toBe(FrameFormat.UNKNOWN);
    });
  });

  // Unit tests for frame validation
  describe('Frame Validation', () => {
    it('should validate correct frames', () => {
      const frame: Frame = {
        data: 'data:image/png;base64,abc',
        width: 100,
        height: 100,
        index: 0
      };
      expect(processor.validateFrame(frame)).toBe(true);
    });

    it('should reject frames with invalid width', () => {
      const frame: Frame = {
        data: 'data:image/png;base64,abc',
        width: 0,
        height: 100,
        index: 0
      };
      expect(processor.validateFrame(frame)).toBe(false);
    });

    it('should reject frames with invalid height', () => {
      const frame: Frame = {
        data: 'data:image/png;base64,abc',
        width: 100,
        height: -1,
        index: 0
      };
      expect(processor.validateFrame(frame)).toBe(false);
    });

    it('should reject frames with invalid index', () => {
      const frame: Frame = {
        data: 'data:image/png;base64,abc',
        width: 100,
        height: 100,
        index: -1
      };
      expect(processor.validateFrame(frame)).toBe(false);
    });
  });

  // Unit tests for processFrames
  describe('Process Multiple Frames', () => {
    it('should process multiple frames in order', async () => {
      const frames: Frame[] = [
        { data: 'data:image/png;base64,abc1', width: 100, height: 100, index: 0 },
        { data: 'data:image/png;base64,abc2', width: 100, height: 100, index: 1 },
        { data: 'data:image/png;base64,abc3', width: 100, height: 100, index: 2 }
      ];

      const results = await processor.processFrames(frames);

      expect(results).toHaveLength(3);
      expect(results[0].index).toBe(0);
      expect(results[1].index).toBe(1);
      expect(results[2].index).toBe(2);
    });

    it('should process empty frame array', async () => {
      const results = await processor.processFrames([]);
      expect(results).toHaveLength(0);
    });
  });
});
