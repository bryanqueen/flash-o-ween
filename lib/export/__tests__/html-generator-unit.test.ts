/**
 * Unit tests for HTML Generator - focusing on validation and error handling
 */

import { describe, it, expect } from 'vitest';
import { HTMLGenerator } from '../html-generator';
import { ProcessedFrame, ExportConfig } from '../types';
import { InvalidConfigError, TemplateRenderError } from '../errors';

describe('HTMLGenerator Unit Tests', () => {
  const generator = new HTMLGenerator();

  // Helper to create a valid processed frame
  const createFrame = (index: number = 0): ProcessedFrame => ({
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    width: 100,
    height: 100,
    index
  });

  // Helper to create a valid config
  const createConfig = (): ExportConfig => ({
    frameRate: 30,
    loop: true,
    autoplay: true,
    showControls: true,
    playbackSpeed: 1.0,
    backgroundColor: 'transparent'
  });

  describe('generate() - Configuration Validation', () => {
    it('should throw InvalidConfigError for invalid frameRate (too low)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), frameRate: 0 };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('frameRate must be between 1 and 120');
    });

    it('should throw InvalidConfigError for invalid frameRate (too high)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), frameRate: 121 };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('frameRate must be between 1 and 120');
    });

    it('should throw InvalidConfigError for invalid frameRate (NaN)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), frameRate: NaN };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('frameRate must be between 1 and 120');
    });

    it('should throw InvalidConfigError for invalid playbackSpeed (too low)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), playbackSpeed: 0 };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('playbackSpeed must be between 0.25 and 2.0');
    });

    it('should throw InvalidConfigError for invalid playbackSpeed (too high)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), playbackSpeed: 2.1 };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('playbackSpeed must be between 0.25 and 2.0');
    });

    it('should throw InvalidConfigError for invalid playbackSpeed (NaN)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), playbackSpeed: NaN };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('playbackSpeed must be between 0.25 and 2.0');
    });

    it('should throw InvalidConfigError for invalid width (negative)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), width: -100 };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('width must be positive');
    });

    it('should throw InvalidConfigError for invalid width (zero)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), width: 0 };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('width must be positive');
    });

    it('should throw InvalidConfigError for invalid height (negative)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), height: -100 };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('height must be positive');
    });

    it('should throw InvalidConfigError for invalid height (zero)', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), height: 0 };

      expect(() => generator.generate(frames, config)).toThrow(InvalidConfigError);
      expect(() => generator.generate(frames, config)).toThrow('height must be positive');
    });

    it('should accept valid configuration at boundary values', () => {
      const frames = [createFrame()];
      
      // Test minimum valid values
      const minConfig = { ...createConfig(), frameRate: 1, playbackSpeed: 0.25 };
      expect(() => generator.generate(frames, minConfig)).not.toThrow();

      // Test maximum valid values
      const maxConfig = { ...createConfig(), frameRate: 120, playbackSpeed: 2.0 };
      expect(() => generator.generate(frames, maxConfig)).not.toThrow();
    });
  });

  describe('generate() - Frame Validation', () => {
    it('should throw TemplateRenderError for empty frame array', () => {
      const frames: ProcessedFrame[] = [];
      const config = createConfig();

      expect(() => generator.generate(frames, config)).toThrow(TemplateRenderError);
      expect(() => generator.generate(frames, config)).toThrow('no frames provided');
    });

    it('should throw TemplateRenderError for null frames', () => {
      const config = createConfig();

      expect(() => generator.generate(null as any, config)).toThrow(TemplateRenderError);
      expect(() => generator.generate(null as any, config)).toThrow('no frames provided');
    });

    it('should throw TemplateRenderError for undefined frames', () => {
      const config = createConfig();

      expect(() => generator.generate(undefined as any, config)).toThrow(TemplateRenderError);
      expect(() => generator.generate(undefined as any, config)).toThrow('no frames provided');
    });

    it('should accept single frame', () => {
      const frames = [createFrame()];
      const config = createConfig();

      const html = generator.generate(frames, config);
      expect(html).toBeTruthy();
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('should accept multiple frames', () => {
      const frames = [createFrame(0), createFrame(1), createFrame(2)];
      const config = createConfig();

      const html = generator.generate(frames, config);
      expect(html).toBeTruthy();
      expect(html).toContain('<!DOCTYPE html>');
    });
  });

  describe('generate() - Orchestration', () => {
    it('should successfully orchestrate all generation steps', () => {
      const frames = [createFrame(0), createFrame(1)];
      const config = createConfig();

      const html = generator.generate(frames, config);

      // Verify all major sections are present
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<style>');
      expect(html).toContain('const frames = [');
      expect(html).toContain('class AnimationPlayer');
      expect(html).toContain('const player = new AnimationPlayer');
    });

    it('should validate configuration before generating', () => {
      const frames = [createFrame()];
      const invalidConfig = { ...createConfig(), frameRate: -1 };

      // Should fail validation before any generation occurs
      expect(() => generator.generate(frames, invalidConfig)).toThrow(InvalidConfigError);
    });

    it('should validate frames before generating', () => {
      const config = createConfig();

      // Should fail frame validation before any generation occurs
      expect(() => generator.generate([], config)).toThrow(TemplateRenderError);
    });
  });

  describe('generate() - Error Handling', () => {
    it('should preserve InvalidConfigError when thrown', () => {
      const frames = [createFrame()];
      const config = { ...createConfig(), frameRate: 200 };

      try {
        generator.generate(frames, config);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidConfigError);
        expect((error as Error).name).toBe('InvalidConfigError');
      }
    });

    it('should preserve TemplateRenderError when thrown', () => {
      const config = createConfig();

      try {
        generator.generate([], config);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TemplateRenderError);
        expect((error as Error).name).toBe('TemplateRenderError');
      }
    });

    it('should return valid HTML for valid inputs', () => {
      const frames = [createFrame()];
      const config = createConfig();

      const html = generator.generate(frames, config);
      
      // Should be a non-empty string
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
      
      // Should start with DOCTYPE
      expect(html.trim().startsWith('<!DOCTYPE html>')).toBe(true);
    });
  });
});
