/**
 * Property-based tests for HTML Generator
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { HTMLGenerator, DEFAULT_EXPORT_CONFIG } from '../html-generator';
import { ProcessedFrame, ExportConfig } from '../types';

describe('HTMLGenerator Property-Based Tests', () => {
  const generator = new HTMLGenerator();

  // Helper: Generate a valid processed frame
  const processedFrameArbitrary = fc.record({
    // Generate base64-safe strings (alphanumeric + / + =)
    dataUrl: fc.stringMatching(/^[A-Za-z0-9+/=]*$/).map(s => `data:image/png;base64,${s}`),
    width: fc.integer({ min: 1, max: 4000 }),
    height: fc.integer({ min: 1, max: 4000 }),
    index: fc.nat()
  });

  // Helper: Generate an array of processed frames with sequential indices
  const processedFramesArbitrary = fc.array(processedFrameArbitrary, { minLength: 1, maxLength: 50 })
    .map(frames => frames.map((frame, index) => ({ ...frame, index })));

  // Helper: Generate a valid export config
  const exportConfigArbitrary = fc.record({
    frameRate: fc.integer({ min: 1, max: 120 }),
    loop: fc.boolean(),
    autoplay: fc.boolean(),
    width: fc.option(fc.integer({ min: 1, max: 4000 }), { nil: undefined }),
    height: fc.option(fc.integer({ min: 1, max: 4000 }), { nil: undefined }),
    backgroundColor: fc.option(fc.constantFrom('transparent', '#ffffff', '#000000', 'red', 'blue'), { nil: undefined }),
    showControls: fc.boolean(),
    playbackSpeed: fc.double({ min: 0.25, max: 2.0, noNaN: true })
  });

  // Feature: animation-export, Property 1: Complete frame embedding
  // **Validates: Requirements 1.1**
  it('Property 1: Complete frame embedding - all frames appear in generated HTML with no duplicates', () => {
    fc.assert(
      fc.property(processedFramesArbitrary, exportConfigArbitrary, (frames, config) => {
        const html = generator.generate(frames, config);

        // Check that all frames are embedded
        for (const frame of frames) {
          // Each frame's data URL should appear exactly once in the HTML
          const escapedDataUrl = frame.dataUrl
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'");
          
          expect(html).toContain(escapedDataUrl);
        }

        // Count occurrences of "dataUrl:" to ensure no duplicates
        const dataUrlCount = (html.match(/dataUrl:/g) || []).length;
        expect(dataUrlCount).toBe(frames.length);

        // Verify frame count in the frames array
        const framesArrayMatch = html.match(/const frames = \[([\s\S]*?)\];/);
        expect(framesArrayMatch).toBeTruthy();
        
        if (framesArrayMatch) {
          const framesContent = framesArrayMatch[1];
          const frameObjectCount = (framesContent.match(/\{[\s\S]*?dataUrl:/g) || []).length;
          expect(frameObjectCount).toBe(frames.length);
        }
      }),
      { numRuns: 100 }
    );
  });

  // Feature: animation-export, Property 2: Self-contained output
  // **Validates: Requirements 1.5**
  it('Property 2: Self-contained output - no external dependencies', () => {
    fc.assert(
      fc.property(processedFramesArbitrary, exportConfigArbitrary, (frames, config) => {
        const html = generator.generate(frames, config);

        // Check for external script sources
        expect(html).not.toMatch(/<script[^>]+src=/i);

        // Check for external stylesheets
        expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet["']/i);

        // Check for external image URLs (not data URLs)
        const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
        for (const match of imgMatches) {
          const srcMatch = match.match(/src=["']([^"']+)["']/i);
          if (srcMatch) {
            expect(srcMatch[1]).toMatch(/^data:/);
          }
        }

        // Check that all image data is embedded as data URLs
        const dataUrlPattern = /data:image\//g;
        const dataUrlCount = (html.match(dataUrlPattern) || []).length;
        expect(dataUrlCount).toBeGreaterThanOrEqual(frames.length);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: animation-export, Property 3: Configuration-driven code generation
  // **Validates: Requirements 1.3, 2.3, 3.1, 3.4, 6.1, 6.2, 6.3, 6.4, 6.5**
  it('Property 3: Configuration-driven code generation - HTML reflects all config settings', () => {
    fc.assert(
      fc.property(processedFramesArbitrary, exportConfigArbitrary, (frames, config) => {
        const html = generator.generate(frames, config);

        // Check autoplay setting
        expect(html).toContain(`this.isPlaying = ${config.autoplay}`);

        // Check loop setting - now uses runtime config
        expect(html).toContain(`if (this.config.loop)`);

        // Check controls visibility
        if (config.showControls) {
          expect(html).toContain('id="controls"');
          expect(html).toContain('id="play-pause-btn"');
          expect(html).toContain('id="speed-slider"');
        } else {
          expect(html).toContain('display: none');
        }

        // Check canvas dimensions
        const canvasWidth = config.width || frames[0].width;
        const canvasHeight = config.height || frames[0].height;
        expect(html).toContain(`width="${canvasWidth}"`);
        expect(html).toContain(`height="${canvasHeight}"`);

        // Check background color
        if (config.backgroundColor) {
          expect(html).toContain(`background: ${config.backgroundColor}`);
        }

        // Check frame rate (in JSON config object)
        expect(html).toContain(`"frameRate": ${config.frameRate}`);

        // Check playback speed (in JSON config object)
        expect(html).toContain(`"playbackSpeed": ${config.playbackSpeed}`);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: animation-export, Property 6: HTML structure consistency
  // **Validates: Requirements 5.1, 5.2**
  it('Property 6: HTML structure consistency - distinct sections for styles, frame data, and logic', () => {
    fc.assert(
      fc.property(processedFramesArbitrary, exportConfigArbitrary, (frames, config) => {
        const html = generator.generate(frames, config);

        // Check for style section
        expect(html).toMatch(/<style>[\s\S]*?<\/style>/);

        // Check for frame data section
        expect(html).toContain('const frames = [');

        // Check for animation player class
        expect(html).toContain('class AnimationPlayer');

        // Verify order: styles should come before scripts
        const styleIndex = html.indexOf('<style>');
        const scriptIndex = html.indexOf('<script>');
        expect(styleIndex).toBeLessThan(scriptIndex);

        // Verify frame data comes before player class
        const framesIndex = html.indexOf('const frames = [');
        const playerIndex = html.indexOf('class AnimationPlayer');
        expect(framesIndex).toBeLessThan(playerIndex);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: animation-export, Property 7: Canvas dimension matching
  // **Validates: Requirements 5.4, 6.4**
  it('Property 7: Canvas dimension matching - canvas matches frame dimensions when not specified', () => {
    fc.assert(
      fc.property(processedFramesArbitrary, (frames) => {
        // Use config without custom dimensions
        const config = { ...DEFAULT_EXPORT_CONFIG, width: undefined, height: undefined };
        const html = generator.generate(frames, config);

        // Canvas should match first frame dimensions
        const expectedWidth = frames[0].width;
        const expectedHeight = frames[0].height;

        expect(html).toContain(`width="${expectedWidth}"`);
        expect(html).toContain(`height="${expectedHeight}"`);
        expect(html).toContain(`this.canvas.width = config.width || frames[0].width`);
        expect(html).toContain(`this.canvas.height = config.height || frames[0].height`);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: animation-export, Property 8: Valid HTML5 output
  // **Validates: Requirements 5.5**
  it('Property 8: Valid HTML5 output - generated HTML has valid structure', () => {
    fc.assert(
      fc.property(processedFramesArbitrary, exportConfigArbitrary, (frames, config) => {
        const html = generator.generate(frames, config);

        // Check for DOCTYPE
        expect(html).toMatch(/^<!DOCTYPE html>/i);

        // Check for required HTML5 structure
        expect(html).toMatch(/<html[^>]*>/i);
        expect(html).toContain('</html>');
        expect(html).toMatch(/<head>/i);
        expect(html).toContain('</head>');
        expect(html).toMatch(/<body>/i);
        expect(html).toContain('</body>');

        // Check for charset
        expect(html).toMatch(/<meta charset="UTF-8">/i);

        // Check for viewport
        expect(html).toContain('name="viewport"');

        // Check for title
        expect(html).toMatch(/<title>.*<\/title>/i);

        // Verify proper nesting (closing tags in correct order)
        const htmlOpenIndex = html.indexOf('<html');
        const htmlCloseIndex = html.indexOf('</html>');
        const bodyOpenIndex = html.indexOf('<body>');
        const bodyCloseIndex = html.indexOf('</body>');

        expect(htmlOpenIndex).toBeLessThan(bodyOpenIndex);
        expect(bodyOpenIndex).toBeLessThan(bodyCloseIndex);
        expect(bodyCloseIndex).toBeLessThan(htmlCloseIndex);
      }),
      { numRuns: 100 }
    );
  });
});
