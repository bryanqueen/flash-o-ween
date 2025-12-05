/**
 * Track Builder - Fluent API for creating animation tracks
 */

import { AnimationTrack, Keyframe } from './types';
import { EasingFunction } from '../types';
import { FabricObject } from 'fabric';

export class TrackBuilder {
  private track: AnimationTrack;

  constructor(id: string, name: string) {
    this.track = {
      id,
      name,
      startTime: 0,
      duration: 1,
      enabled: true,
      keyframes: {}
    };
  }

  /**
   * Set target object
   */
  target(obj: FabricObject): this {
    this.track.target = obj;
    return this;
  }

  /**
   * Set target by ID
   */
  targetId(id: string): this {
    this.track.targetId = id;
    return this;
  }

  /**
   * Set start time
   */
  startAt(time: number): this {
    this.track.startTime = time;
    return this;
  }

  /**
   * Set duration
   */
  duration(seconds: number): this {
    this.track.duration = seconds;
    return this;
  }

  /**
   * Set easing function
   */
  easing(easing: EasingFunction): this {
    this.track.easing = easing;
    return this;
  }

  /**
   * Enable/disable track
   */
  enabled(enabled: boolean): this {
    this.track.enabled = enabled;
    return this;
  }

  /**
   * Add keyframe for a property
   */
  keyframe(property: string, time: number, value: number, easing?: EasingFunction): this {
    if (!this.track.keyframes[property]) {
      this.track.keyframes[property] = [];
    }

    this.track.keyframes[property].push({
      time,
      value,
      easing
    });

    // Sort keyframes by time
    this.track.keyframes[property].sort((a, b) => a.time - b.time);

    return this;
  }

  /**
   * Add multiple keyframes for a property
   */
  keyframes(property: string, keyframes: Array<{ time: number; value: number; easing?: EasingFunction }>): this {
    for (const kf of keyframes) {
      this.keyframe(property, kf.time, kf.value, kf.easing);
    }
    return this;
  }

  /**
   * Animate position
   */
  position(time: number, x: number, y: number): this {
    this.keyframe('x', time, x);
    this.keyframe('y', time, y);
    return this;
  }

  /**
   * Animate rotation
   */
  rotate(time: number, angle: number): this {
    this.keyframe('rotation', time, angle);
    return this;
  }

  /**
   * Animate scale
   */
  scale(time: number, scaleX: number, scaleY?: number): this {
    this.keyframe('scaleX', time, scaleX);
    this.keyframe('scaleY', time, scaleY ?? scaleX);
    return this;
  }

  /**
   * Animate opacity
   */
  opacity(time: number, value: number): this {
    this.keyframe('opacity', time, value);
    return this;
  }

  /**
   * Create a fade in animation
   */
  fadeIn(startTime: number, duration: number): this {
    this.keyframe('opacity', startTime, 0);
    this.keyframe('opacity', startTime + duration, 1);
    return this;
  }

  /**
   * Create a fade out animation
   */
  fadeOut(startTime: number, duration: number): this {
    this.keyframe('opacity', startTime, 1);
    this.keyframe('opacity', startTime + duration, 0);
    return this;
  }

  /**
   * Create a move animation
   */
  moveTo(startTime: number, duration: number, fromX: number, fromY: number, toX: number, toY: number): this {
    this.keyframe('x', startTime, fromX);
    this.keyframe('x', startTime + duration, toX);
    this.keyframe('y', startTime, fromY);
    this.keyframe('y', startTime + duration, toY);
    return this;
  }

  /**
   * Create a spin animation
   */
  spin(startTime: number, duration: number, rotations: number = 1): this {
    this.keyframe('rotation', startTime, 0);
    this.keyframe('rotation', startTime + duration, 360 * rotations);
    return this;
  }

  /**
   * Create a pulse animation
   */
  pulse(startTime: number, duration: number, minScale: number = 0.8, maxScale: number = 1.2): this {
    const mid = startTime + duration / 2;
    this.keyframe('scaleX', startTime, minScale);
    this.keyframe('scaleX', mid, maxScale);
    this.keyframe('scaleX', startTime + duration, minScale);
    this.keyframe('scaleY', startTime, minScale);
    this.keyframe('scaleY', mid, maxScale);
    this.keyframe('scaleY', startTime + duration, minScale);
    return this;
  }

  /**
   * Create a bounce animation
   */
  bounce(startTime: number, duration: number, fromY: number, toY: number): this {
    this.keyframe('y', startTime, fromY);
    this.keyframe('y', startTime + duration, toY);
    this.easing('bounce');
    return this;
  }

  /**
   * Build and return the track
   */
  build(): AnimationTrack {
    return { ...this.track };
  }
}

/**
 * Helper function to create a track builder
 */
export function createTrack(id: string, name: string): TrackBuilder {
  return new TrackBuilder(id, name);
}
