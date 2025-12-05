/**
 * Export Orchestrator Tests
 * Property-based tests for the export orchestration logic
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { ExportOrchestrator } from '../export-orchestrator';
import { Frame, ExportProgress, ExportConfig } from '../types';

// Mock DOM APIs for testing
beforeEach(() => {
  // Mock document.createElement for canvas
  global.document = {
    createElement: (tag: string) => {
      if (tag === 'canvas') {
        const canvas = {
          width: 0,
          height: 0,
          getContext: () => ({
            drawImage: vi.fn(),
            putImageData: vi.fn(),
            clearRect: vi.fn(),
            fillRect: vi.fn()
          }),
          toDataURL: (type?: string, quality?: number) => {
            if (type === 'image/jpeg') {
              return `data:image/jpeg;base64,mockJPEGdata${quality || 1.0}`;
            }
            return 'data:image/png;base64,mockPNGdata';
          }
        };
        return canvas;
      }
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          style: {},
          click: vi.fn()
        };
      }
      return {};
    },
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn()
    }
  } as any;

  // Mock Image constructor
  global.Image = class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src: string = '';
    complete: boolean = false;
    width: number = 0;
    height: number = 0;

    constructor() {
      // Simulate immediate load
      setTimeout(() => {
        this.complete = true;
        if (this.onload) {
          this.onload();
        }
      }, 0);
    }
  } as any;

  // Mock URL.createObjectURL and revokeObjectURL
  global.URL = {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn()
  } as any;

  // Mock TextEncoder
  global.TextEncoder = class MockTextEncoder {
    encode(str: string) {
      return new Uint8Array(str.length);
    }
  } as any;
});

// Arbitraries for generating test data

/**
 * Generate a valid frame with data URL
 */
const frameArbitrary = fc.record({
  data: fc.string().map(s => `data:image/png;base64,${s}`),
  width: fc.integer({ min: 1, max: 1920 }),
  height: fc.integer({ min: 1, max: 1080 }),
  index: fc.nat()
});

/**
 * Generate an array of frames
 */
const framesArrayArbitrary = fc.array(frameArbitrary, { minLength: 1, maxLength: 20 }).map((frames, index) => 
  frames.map((frame, i) => ({ ...frame, index: i }))
);

/**
 * Generate export configuration
 */
const exportConfigArbitrary = fc.record({
  frameRate: fc.integer({ min: 1, max: 120 }),
  loop: fc.boolean(),
  autoplay: fc.boolean(),
  showControls: fc.boolean(),
  playbackSpeed: fc.double({ min: 0.25, max: 2.0, noNaN: true }),
  backgroundColor: fc.option(fc.constantFrom('transparent', '#ffffff', '#000000', 'red'), { nil: undefined })
});

describe('Export Orchestrator Property Tests', () => {
  
  // Feature: animation-export, Property 9: Progress reporting completeness
  describe('Property 9: Progress reporting completeness', () => {
    it('should report progress stages in correct order with monotonically increasing percentages', async () => {
      await fc.assert(
        fc.asyncProperty(framesArrayArbitrary, exportConfigArbitrary, async (frames, config) => {
          const orchestrator = new ExportOrchestrator();
          const progressUpdates: ExportProgress[] = [];

          // Register progress callback
          orchestrator.onProgress((progress) => {
            progressUpdates.push({ ...progress });
          });

          // Execute export
          await orchestrator.export(frames, config);

          // Verify we have progress updates
          expect(progressUpdates.length).toBeGreaterThan(0);

          // Verify stages are in correct order
          const stages = progressUpdates.map(p => p.stage);
          const expectedStageOrder = ['processing', 'generating', 'downloading', 'complete'];
          
          // Find the first occurrence of each expected stage
          let lastIndex = -1;
          for (const expectedStage of expectedStageOrder) {
            const index = stages.indexOf(expectedStage);
            if (index !== -1) {
              // Stage should appear after the previous stage
              expect(index).toBeGreaterThan(lastIndex);
              lastIndex = index;
            }
          }

          // Verify final stage is 'complete'
          const finalStage = progressUpdates[progressUpdates.length - 1].stage;
          expect(finalStage).toBe('complete');

          // Verify percentages increase monotonically (or stay the same)
          for (let i = 1; i < progressUpdates.length; i++) {
            const prevPercentage = progressUpdates[i - 1].percentage;
            const currPercentage = progressUpdates[i].percentage;
            expect(currPercentage).toBeGreaterThanOrEqual(prevPercentage);
          }

          // Verify final percentage is 100
          const finalPercentage = progressUpdates[progressUpdates.length - 1].percentage;
          expect(finalPercentage).toBe(100);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: animation-export, Property 10: Error reporting clarity
  describe('Property 10: Error reporting clarity', () => {
    it('should provide non-empty error messages for all failure cases', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            // Empty frames array
            [],
            // Invalid frame (missing data)
            [{ width: 100, height: 100, index: 0 }] as any,
            // Invalid frame (negative dimensions)
            [{ data: 'data:image/png;base64,test', width: -1, height: 100, index: 0 }] as any,
            // Invalid frame (zero dimensions)
            [{ data: 'data:image/png;base64,test', width: 0, height: 0, index: 0 }] as any
          ),
          async (invalidFrames) => {
            const orchestrator = new ExportOrchestrator();
            let errorProgress: ExportProgress | null = null;

            // Register progress callback to capture error
            orchestrator.onProgress((progress) => {
              if (progress.stage === 'error') {
                errorProgress = progress;
              }
            });

            // Execute export with invalid data
            const result = await orchestrator.export(invalidFrames);

            // Verify export failed
            expect(result.success).toBe(false);

            // Verify error message is non-empty
            expect(result.error).toBeDefined();
            expect(result.error).not.toBe('');
            expect(result.error!.length).toBeGreaterThan(0);

            // Verify error was reported via progress callback
            expect(errorProgress).not.toBeNull();
            expect(errorProgress!.message).not.toBe('');
            expect(errorProgress!.message.length).toBeGreaterThan(0);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: animation-export, Property 12: Frame data optimization
  describe('Property 12: Frame data optimization', () => {
    it('should produce smaller output when frames exceed size threshold', async () => {
      // Generate large frames that will trigger optimization
      const largeFrameArbitrary = fc.record({
        data: fc.string({ minLength: 30000, maxLength: 50000 }).map(s => `data:image/png;base64,${s}`),
        width: fc.integer({ min: 800, max: 1920 }),
        height: fc.integer({ min: 600, max: 1080 }),
        index: fc.nat()
      });

      const largeFramesArrayArbitrary = fc.array(largeFrameArbitrary, { minLength: 20, maxLength: 30 }).map((frames) => 
        frames.map((frame, i) => ({ ...frame, index: i }))
      );

      await fc.assert(
        fc.asyncProperty(largeFramesArrayArbitrary, async (frames) => {
          const orchestrator = new ExportOrchestrator();
          let optimizationDetected = false;

          // Register progress callback to detect optimization
          orchestrator.onProgress((progress) => {
            if (progress.message.includes('Optimizing') || progress.message.includes('optimization')) {
              optimizationDetected = true;
            }
          });

          // Calculate unoptimized size (sum of data URL lengths)
          const unoptimizedSize = frames.reduce((sum, frame) => sum + frame.data.length, 0);

          // Execute export
          const result = await orchestrator.export(frames);

          // If optimization was triggered, verify the result
          if (optimizationDetected) {
            // The file size should be smaller than unoptimized
            expect(result.fileSize).toBeLessThan(unoptimizedSize);
          }

          return true;
        }),
        { numRuns: 20 } // Fewer runs due to larger data
      );
    }, 60000); // 60 second timeout for this test
  });
});
