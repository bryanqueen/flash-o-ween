/**
 * Animation System Tests
 */

import { describe, it, expect } from 'vitest';
import { AnimationGenerator } from '../generator';
import { animationPresets } from '../presets';
import { interpolate } from '../easing';

describe('Animation System', () => {
  describe('Easing Functions', () => {
    it('should interpolate linearly', () => {
      expect(interpolate(0, 100, 0.5, 'linear')).toBe(50);
      expect(interpolate(0, 100, 0, 'linear')).toBe(0);
      expect(interpolate(0, 100, 1, 'linear')).toBe(100);
    });

    it('should apply easeIn correctly', () => {
      const result = interpolate(0, 100, 0.5, 'easeIn');
      expect(result).toBeLessThan(50); // Should be slower at start
    });

    it('should apply bounce correctly', () => {
      const result = interpolate(0, 100, 0.5, 'bounce');
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
    });
  });

  describe('Animation Generator', () => {
    const generator = new AnimationGenerator();

    it('should generate frames from bouncing ball preset', () => {
      const preset = animationPresets.find(p => p.id === 'bouncing-ball');
      expect(preset).toBeDefined();
      
      if (preset) {
        const frames = generator.generateFromPreset(preset);
        expect(frames).toHaveLength(preset.duration);
        expect(frames[0].objects).toHaveLength(1);
        expect(frames[0].objects[0].type).toBe('emoji');
        expect(frames[0].objects[0].content).toBe('⚽');
      }
    });

    it('should generate frames from ghost floating preset', () => {
      const preset = animationPresets.find(p => p.id === 'ghost-floating');
      expect(preset).toBeDefined();
      
      if (preset) {
        const frames = generator.generateFromPreset(preset);
        expect(frames).toHaveLength(preset.duration);
        expect(frames[0].objects[0].content).toBe('👻');
      }
    });

    it('should generate text animation frames', () => {
      const config = {
        text: 'BOO!',
        startFrame: 0,
        letterDelay: 8,
        fontSize: 120,
        color: '#ff6b00',
        x: 250,
        y: 250
      };

      const frames = generator.generateTextAnimation(config);
      expect(frames.length).toBeGreaterThan(0);
      
      // First frame should have no letters
      expect(frames[0].objects).toHaveLength(0);
      
      // Later frames should have letters appearing
      const midFrame = frames[Math.floor(frames.length / 2)];
      expect(midFrame.objects.length).toBeGreaterThan(0);
    });

    it('should combine multiple animations', () => {
      const preset1 = animationPresets[0];
      const preset2 = animationPresets[1];
      
      const frames1 = generator.generateFromPreset(preset1);
      const frames2 = generator.generateFromPreset(preset2);
      
      const combined = generator.combineAnimations([frames1, frames2]);
      
      expect(combined.length).toBe(Math.max(frames1.length, frames2.length));
      expect(combined[0].objects.length).toBe(2); // Both animations
    });
  });

  describe('Animation Presets', () => {
    it('should have all required presets', () => {
      const requiredIds = ['bouncing-ball', 'ghost-floating', 'pumpkin-smiling', 'bat-flying'];
      
      for (const id of requiredIds) {
        const preset = animationPresets.find(p => p.id === id);
        expect(preset).toBeDefined();
        expect(preset?.keyframes.length).toBeGreaterThan(0);
      }
    });

    it('should have valid keyframe data', () => {
      for (const preset of animationPresets) {
        expect(preset.duration).toBeGreaterThan(0);
        expect(preset.keyframes.length).toBeGreaterThan(0);
        
        // Check keyframes are in order
        for (let i = 1; i < preset.keyframes.length; i++) {
          expect(preset.keyframes[i].frame).toBeGreaterThanOrEqual(
            preset.keyframes[i - 1].frame
          );
        }
      }
    });
  });
});
