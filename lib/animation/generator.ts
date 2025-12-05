/**
 * Animation Frame Generator
 */

import { AnimationPreset, AnimationKeyframe, GeneratedFrame, CanvasObject, TextAnimationConfig } from './types';
import { interpolate } from './easing';

export class AnimationGenerator {
  /**
   * Generate frames from an animation preset
   */
  generateFromPreset(preset: AnimationPreset): GeneratedFrame[] {
    const frames: GeneratedFrame[] = [];
    
    for (let frameIndex = 0; frameIndex < preset.duration; frameIndex++) {
      const obj = this.interpolateKeyframes(preset.keyframes, frameIndex, preset);
      frames.push({
        objects: [obj]
      });
    }
    
    return frames;
  }

  /**
   * Interpolate between keyframes for a specific frame
   */
  private interpolateKeyframes(
    keyframes: AnimationKeyframe[],
    frameIndex: number,
    preset: AnimationPreset
  ): CanvasObject {
    // Find surrounding keyframes
    let startKeyframe: AnimationKeyframe | null = null;
    let endKeyframe: AnimationKeyframe | null = null;
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (frameIndex >= keyframes[i].frame && frameIndex <= keyframes[i + 1].frame) {
        startKeyframe = keyframes[i];
        endKeyframe = keyframes[i + 1];
        break;
      }
    }
    
    // If no surrounding keyframes found, use last keyframe
    if (!startKeyframe || !endKeyframe) {
      const lastKeyframe = keyframes[keyframes.length - 1];
      return {
        type: 'emoji',
        content: preset.emoji,
        x: lastKeyframe.x ?? 0,
        y: lastKeyframe.y ?? 0,
        fontSize: 80,
        rotation: lastKeyframe.rotation ?? 0,
        scale: lastKeyframe.scale ?? 1,
        opacity: lastKeyframe.opacity ?? 1
      };
    }
    
    // Calculate progress between keyframes
    const frameDiff = endKeyframe.frame - startKeyframe.frame;
    const progress = frameDiff > 0 ? (frameIndex - startKeyframe.frame) / frameDiff : 0;
    
    // Interpolate all properties
    return {
      type: 'emoji',
      content: preset.emoji,
      x: interpolate(startKeyframe.x ?? 0, endKeyframe.x ?? 0, progress, preset.easing),
      y: interpolate(startKeyframe.y ?? 0, endKeyframe.y ?? 0, progress, preset.easing),
      fontSize: 80,
      rotation: interpolate(startKeyframe.rotation ?? 0, endKeyframe.rotation ?? 0, progress, preset.easing),
      scale: interpolate(startKeyframe.scale ?? 1, endKeyframe.scale ?? 1, progress, preset.easing),
      opacity: interpolate(startKeyframe.opacity ?? 1, endKeyframe.opacity ?? 1, progress, preset.easing)
    };
  }

  /**
   * Generate text animation frames (letter by letter reveal)
   */
  generateTextAnimation(config: TextAnimationConfig): GeneratedFrame[] {
    const frames: GeneratedFrame[] = [];
    const totalFrames = config.startFrame + (config.text.length * config.letterDelay) + 30;
    
    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
      const objects: CanvasObject[] = [];
      
      // Calculate how many letters to show
      const framesSinceStart = frameIndex - config.startFrame;
      const lettersToShow = Math.max(0, Math.floor(framesSinceStart / config.letterDelay));
      
      // Add each letter as a separate object with slight offset
      for (let i = 0; i < Math.min(lettersToShow, config.text.length); i++) {
        const letter = config.text[i];
        const letterFrameAge = framesSinceStart - (i * config.letterDelay);
        
        // Add bounce effect when letter appears
        let yOffset = 0;
        if (letterFrameAge < 10) {
          const bounceProgress = letterFrameAge / 10;
          yOffset = -20 * Math.sin(bounceProgress * Math.PI);
        }
        
        // Calculate scale for pop-in effect
        let scale = 1;
        if (letterFrameAge < 5) {
          scale = 0.5 + (letterFrameAge / 5) * 0.5;
        }
        
        objects.push({
          type: 'text',
          content: letter,
          x: config.x + (i * config.fontSize * 0.7),
          y: config.y + yOffset,
          fontSize: config.fontSize,
          color: config.color,
          scale: scale,
          opacity: 1
        });
      }
      
      frames.push({ objects });
    }
    
    return frames;
  }

  /**
   * Combine multiple animation sequences
   */
  combineAnimations(animations: GeneratedFrame[][]): GeneratedFrame[] {
    const maxLength = Math.max(...animations.map(a => a.length));
    const combined: GeneratedFrame[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const objects: CanvasObject[] = [];
      
      for (const animation of animations) {
        if (i < animation.length) {
          objects.push(...animation[i].objects);
        } else if (animation.length > 0) {
          // Repeat last frame if animation is shorter
          objects.push(...animation[animation.length - 1].objects);
        }
      }
      
      combined.push({ objects });
    }
    
    return combined;
  }
}
