/**
 * Core Animation Engine
 * Handles real-time animation playback, timeline management, and frame interpolation
 */

import { Canvas } from 'fabric';
import { AnimationTrack, AnimationState, PlaybackOptions, AnimationEvent } from './types';
import { easingFunctions } from '../easing';

export class AnimationEngine {
  private canvas: Canvas;
  private tracks: Map<string, AnimationTrack> = new Map();
  private state: AnimationState;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private eventListeners: Map<string, Set<(event: AnimationEvent) => void>> = new Map();

  constructor(canvas: Canvas, options: PlaybackOptions = {}) {
    this.canvas = canvas;
    this.state = {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      fps: options.fps || 30,
      loop: options.loop ?? true,
      speed: options.speed || 1.0
    };
  }

  /**
   * Add an animation track
   */
  addTrack(track: AnimationTrack): void {
    this.tracks.set(track.id, track);
    this.updateDuration();
    this.emit('trackAdded', { track });
  }

  /**
   * Remove an animation track
   */
  removeTrack(trackId: string): void {
    const track = this.tracks.get(trackId);
    if (track) {
      this.tracks.delete(trackId);
      this.updateDuration();
      this.emit('trackRemoved', { track });
    }
  }

  /**
   * Get a track by ID
   */
  getTrack(trackId: string): AnimationTrack | undefined {
    return this.tracks.get(trackId);
  }

  /**
   * Get all tracks
   */
  getAllTracks(): AnimationTrack[] {
    return Array.from(this.tracks.values());
  }

  /**
   * Update animation duration based on tracks
   */
  private updateDuration(): void {
    let maxDuration = 0;
    for (const track of this.tracks.values()) {
      if (track.enabled) {
        const trackEnd = track.startTime + track.duration;
        maxDuration = Math.max(maxDuration, trackEnd);
      }
    }
    this.state.duration = maxDuration;
  }

  /**
   * Start playback
   */
  play(): void {
    if (this.state.isPlaying) return;
    
    this.state.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.emit('play', { time: this.state.currentTime });
    this.startAnimationLoop();
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.state.isPlaying) return;
    
    this.state.isPlaying = false;
    this.emit('pause', { time: this.state.currentTime });
    this.stopAnimationLoop();
  }

  /**
   * Stop playback and reset
   */
  stop(): void {
    this.pause();
    this.seek(0);
    this.emit('stop', { time: 0 });
  }

  /**
   * Toggle play/pause
   */
  toggle(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Seek to specific time
   */
  seek(time: number): void {
    this.state.currentTime = Math.max(0, Math.min(time, this.state.duration));
    this.render();
    this.emit('seek', { time: this.state.currentTime });
  }

  /**
   * Set playback speed
   */
  setSpeed(speed: number): void {
    this.state.speed = Math.max(0.1, Math.min(speed, 5.0));
    this.emit('speedChange', { speed: this.state.speed });
  }

  /**
   * Set FPS
   */
  setFPS(fps: number): void {
    this.state.fps = Math.max(1, Math.min(fps, 120));
    this.emit('fpsChange', { fps: this.state.fps });
  }

  /**
   * Set loop mode
   */
  setLoop(loop: boolean): void {
    this.state.loop = loop;
    this.emit('loopChange', { loop });
  }

  /**
   * Get current state
   */
  getState(): Readonly<AnimationState> {
    return { ...this.state };
  }

  /**
   * Main animation loop
   */
  private startAnimationLoop(): void {
    const loop = (currentTime: number) => {
      if (!this.state.isPlaying) return;

      const frameDuration = 1000 / this.state.fps;
      const elapsed = currentTime - this.lastFrameTime;

      if (elapsed >= frameDuration) {
        // Calculate time delta with speed multiplier
        const deltaTime = (elapsed / 1000) * this.state.speed;
        this.state.currentTime += deltaTime;

        // Handle loop or stop at end
        if (this.state.currentTime >= this.state.duration) {
          if (this.state.loop) {
            this.state.currentTime = this.state.currentTime % this.state.duration;
          } else {
            this.state.currentTime = this.state.duration;
            this.pause();
            this.emit('complete', { time: this.state.currentTime });
            return;
          }
        }

        // Render current frame
        this.render();
        this.emit('update', { time: this.state.currentTime });

        this.lastFrameTime = currentTime - (elapsed % frameDuration);
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Stop animation loop
   */
  private stopAnimationLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Render current frame
   */
  private render(): void {
    // Clear canvas (optional - depends on blend mode)
    // this.canvas.clear();

    // Render each active track
    for (const track of this.tracks.values()) {
      if (!track.enabled) continue;

      const localTime = this.state.currentTime - track.startTime;
      
      // Skip if outside track time range
      if (localTime < 0 || localTime > track.duration) continue;

      // Get interpolated values for current time
      const values = this.interpolateTrack(track, localTime);
      
      // Apply to target object
      this.applyValues(track, values);
    }

    // Render canvas
    this.canvas.renderAll();
  }

  /**
   * Interpolate track values at given time
   */
  private interpolateTrack(track: AnimationTrack, time: number): Record<string, number> {
    const values: Record<string, number> = {};

    for (const [property, keyframes] of Object.entries(track.keyframes)) {
      // Find surrounding keyframes
      let startKf = keyframes[0];
      let endKf = keyframes[keyframes.length - 1];

      for (let i = 0; i < keyframes.length - 1; i++) {
        if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
          startKf = keyframes[i];
          endKf = keyframes[i + 1];
          break;
        }
      }

      // Calculate progress
      const duration = endKf.time - startKf.time;
      const progress = duration > 0 ? (time - startKf.time) / duration : 1;

      // Apply easing
      const easing = track.easing || 'linear';
      const easedProgress = easingFunctions[easing](progress);

      // Interpolate value
      values[property] = startKf.value + (endKf.value - startKf.value) * easedProgress;
    }

    return values;
  }

  /**
   * Apply interpolated values to target object
   */
  private applyValues(track: AnimationTrack, values: Record<string, number>): void {
    const target = track.target;
    if (!target) return;

    for (const [property, value] of Object.entries(values)) {
      switch (property) {
        case 'x':
          target.set('left', value);
          break;
        case 'y':
          target.set('top', value);
          break;
        case 'rotation':
          target.set('angle', value);
          break;
        case 'scaleX':
        case 'scaleY':
        case 'opacity':
          target.set(property, value);
          break;
        default:
          // Generic property setter
          (target as any)[property] = value;
      }
    }

    target.setCoords();
  }

  /**
   * Event system
   */
  on(event: string, callback: (event: AnimationEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (event: AnimationEvent) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const eventData: AnimationEvent = { type: event, ...data };
      listeners.forEach(callback => callback(eventData));
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stopAnimationLoop();
    this.tracks.clear();
    this.eventListeners.clear();
  }

  /**
   * Export animation data
   */
  export(): any {
    return {
      tracks: Array.from(this.tracks.values()).map(track => ({
        id: track.id,
        name: track.name,
        startTime: track.startTime,
        duration: track.duration,
        enabled: track.enabled,
        easing: track.easing,
        keyframes: track.keyframes
      })),
      state: this.state
    };
  }

  /**
   * Import animation data
   */
  import(data: any): void {
    this.tracks.clear();
    
    if (data.tracks) {
      for (const trackData of data.tracks) {
        this.addTrack(trackData as AnimationTrack);
      }
    }

    if (data.state) {
      this.state = { ...this.state, ...data.state };
    }
  }
}
