/**
 * Motion Tween Generator (Adobe Flash style)
 * Interpolates between two drawn frames
 */

import { Canvas } from 'fabric';
import { EasingFunction } from './types';
import { interpolate } from './easing';

export interface TweenableObject {
  id: string;
  type: string;
  left: number;
  top: number;
  angle: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  [key: string]: any;
}

export class TweenGenerator {
  /**
   * Create motion tween between two frames
   */
  async createTween(
    startFrameData: string,
    endFrameData: string,
    startFrame: number,
    endFrame: number,
    easing: EasingFunction,
    canvasWidth: number,
    canvasHeight: number
  ): Promise<{ frameIndex: number; data: string; thumbnail: string }[]> {
    // Parse start and end frame JSON
    const startJSON = JSON.parse(startFrameData);
    const endJSON = JSON.parse(endFrameData);

    // Extract objects from both frames
    const startObjects = startJSON.objects || [];
    const endObjects = endJSON.objects || [];

    // Match objects between frames (by index for now, could be smarter)
    const objectPairs = this.matchObjects(startObjects, endObjects);

    // Generate in-between frames
    const tweenedFrames: { frameIndex: number; data: string; thumbnail: string }[] = [];
    const totalFrames = endFrame - startFrame;

    // Create temporary canvas for rendering
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    const fabricCanvas = new Canvas(tempCanvas, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: startJSON.background || '#1a1a1a'
    });

    for (let i = 1; i < totalFrames; i++) {
      const frameIndex = startFrame + i;
      const progress = i / totalFrames;
      const easedProgress = this.applyEasing(progress, easing);

      // Clear canvas
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = startJSON.background || '#1a1a1a';

      // Interpolate each object pair
      const interpolatedObjects = objectPairs.map(pair => 
        this.interpolateObject(pair.start, pair.end, easedProgress)
      );

      // Create frame JSON
      const frameJSON = {
        ...startJSON,
        objects: interpolatedObjects
      };

      // Load and render
      await fabricCanvas.loadFromJSON(frameJSON);
      fabricCanvas.renderAll();

      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 1));

      const data = JSON.stringify(fabricCanvas.toJSON());
      const thumbnail = tempCanvas.toDataURL('image/png', 0.3);

      tweenedFrames.push({
        frameIndex,
        data,
        thumbnail
      });
    }

    // Cleanup
    fabricCanvas.dispose();

    return tweenedFrames;
  }

  /**
   * Match objects between start and end frames
   */
  private matchObjects(startObjects: any[], endObjects: any[]): { start: any; end: any }[] {
    const pairs: { start: any; end: any }[] = [];
    const maxLength = Math.max(startObjects.length, endObjects.length);

    for (let i = 0; i < maxLength; i++) {
      const start = startObjects[i] || startObjects[startObjects.length - 1];
      const end = endObjects[i] || endObjects[endObjects.length - 1];
      
      if (start && end) {
        pairs.push({ start, end });
      }
    }

    return pairs;
  }

  /**
   * Interpolate a single object between start and end states
   */
  private interpolateObject(start: any, end: any, progress: number): any {
    const interpolated = { ...start };

    // Interpolate numeric properties
    const numericProps = ['left', 'top', 'angle', 'scaleX', 'scaleY', 'opacity', 'width', 'height', 'radius'];
    
    for (const prop of numericProps) {
      if (typeof start[prop] === 'number' && typeof end[prop] === 'number') {
        interpolated[prop] = start[prop] + (end[prop] - start[prop]) * progress;
      }
    }

    // Interpolate colors (if needed)
    if (start.fill && end.fill && typeof start.fill === 'string' && typeof end.fill === 'string') {
      interpolated.fill = this.interpolateColor(start.fill, end.fill, progress);
    }

    if (start.stroke && end.stroke && typeof start.stroke === 'string' && typeof end.stroke === 'string') {
      interpolated.stroke = this.interpolateColor(start.stroke, end.stroke, progress);
    }

    return interpolated;
  }

  /**
   * Interpolate between two colors
   */
  private interpolateColor(startColor: string, endColor: string, progress: number): string {
    // Simple hex color interpolation
    if (startColor.startsWith('#') && endColor.startsWith('#')) {
      const start = this.hexToRgb(startColor);
      const end = this.hexToRgb(endColor);

      if (start && end) {
        const r = Math.round(start.r + (end.r - start.r) * progress);
        const g = Math.round(start.g + (end.g - start.g) * progress);
        const b = Math.round(start.b + (end.b - start.b) * progress);
        return this.rgbToHex(r, g, b);
      }
    }

    // If not hex or can't parse, return end color
    return progress < 0.5 ? startColor : endColor;
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Apply easing function to progress
   */
  private applyEasing(progress: number, easing: EasingFunction): number {
    return interpolate(0, 1, progress, easing);
  }
}
