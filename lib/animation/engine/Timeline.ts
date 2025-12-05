/**
 * Timeline - Visual timeline management and editing
 */

import { AnimationEngine } from './AnimationEngine';
import { AnimationTrack, TimelineMarker } from './types';

export class Timeline {
  private engine: AnimationEngine;
  private markers: TimelineMarker[] = [];
  private snapEnabled: boolean = true;
  private snapInterval: number = 0.1; // seconds

  constructor(engine: AnimationEngine) {
    this.engine = engine;
  }

  /**
   * Add a marker to the timeline
   */
  addMarker(time: number, label: string, color?: string): void {
    this.markers.push({ time, label, color });
    this.markers.sort((a, b) => a.time - b.time);
  }

  /**
   * Remove a marker
   */
  removeMarker(time: number): void {
    this.markers = this.markers.filter(m => m.time !== time);
  }

  /**
   * Get all markers
   */
  getMarkers(): TimelineMarker[] {
    return [...this.markers];
  }

  /**
   * Get marker at time
   */
  getMarkerAt(time: number, tolerance: number = 0.01): TimelineMarker | undefined {
    return this.markers.find(m => Math.abs(m.time - time) < tolerance);
  }

  /**
   * Enable/disable snapping
   */
  setSnap(enabled: boolean, interval?: number): void {
    this.snapEnabled = enabled;
    if (interval !== undefined) {
      this.snapInterval = interval;
    }
  }

  /**
   * Snap time to grid
   */
  snapTime(time: number): number {
    if (!this.snapEnabled) return time;
    return Math.round(time / this.snapInterval) * this.snapInterval;
  }

  /**
   * Get time at pixel position
   */
  timeAtPosition(pixelX: number, timelineWidth: number): number {
    const state = this.engine.getState();
    return (pixelX / timelineWidth) * state.duration;
  }

  /**
   * Get pixel position for time
   */
  positionAtTime(time: number, timelineWidth: number): number {
    const state = this.engine.getState();
    return (time / state.duration) * timelineWidth;
  }

  /**
   * Get tracks in time range
   */
  getTracksInRange(startTime: number, endTime: number): AnimationTrack[] {
    return this.engine.getAllTracks().filter(track => {
      const trackEnd = track.startTime + track.duration;
      return track.startTime < endTime && trackEnd > startTime;
    });
  }

  /**
   * Split track at time
   */
  splitTrack(trackId: string, time: number): void {
    const track = this.engine.getTrack(trackId);
    if (!track) return;

    const localTime = time - track.startTime;
    if (localTime <= 0 || localTime >= track.duration) return;

    // Create two new tracks
    const track1: AnimationTrack = {
      ...track,
      id: `${track.id}_1`,
      duration: localTime
    };

    const track2: AnimationTrack = {
      ...track,
      id: `${track.id}_2`,
      startTime: time,
      duration: track.duration - localTime,
      keyframes: {}
    };

    // Adjust keyframes for second track
    for (const [property, keyframes] of Object.entries(track.keyframes)) {
      track2.keyframes[property] = keyframes
        .filter(kf => kf.time >= localTime)
        .map(kf => ({ ...kf, time: kf.time - localTime }));
    }

    // Remove original and add new tracks
    this.engine.removeTrack(trackId);
    this.engine.addTrack(track1);
    this.engine.addTrack(track2);
  }

  /**
   * Trim track
   */
  trimTrack(trackId: string, newStartTime: number, newDuration: number): void {
    const track = this.engine.getTrack(trackId);
    if (!track) return;

    const timeDiff = newStartTime - track.startTime;

    // Update track
    track.startTime = newStartTime;
    track.duration = newDuration;

    // Adjust keyframes
    for (const [property, keyframes] of Object.entries(track.keyframes)) {
      track.keyframes[property] = keyframes
        .map(kf => ({ ...kf, time: kf.time - timeDiff }))
        .filter(kf => kf.time >= 0 && kf.time <= newDuration);
    }
  }

  /**
   * Move track to new time
   */
  moveTrack(trackId: string, newStartTime: number): void {
    const track = this.engine.getTrack(trackId);
    if (!track) return;

    track.startTime = this.snapTime(newStartTime);
  }

  /**
   * Duplicate track
   */
  duplicateTrack(trackId: string, offset: number = 0): string {
    const track = this.engine.getTrack(trackId);
    if (!track) return '';

    const newId = `${trackId}_copy_${Date.now()}`;
    const newTrack: AnimationTrack = {
      ...track,
      id: newId,
      name: `${track.name} (Copy)`,
      startTime: track.startTime + offset,
      keyframes: JSON.parse(JSON.stringify(track.keyframes))
    };

    this.engine.addTrack(newTrack);
    return newId;
  }

  /**
   * Get timeline statistics
   */
  getStats(): {
    totalTracks: number;
    activeTracks: number;
    totalKeyframes: number;
    duration: number;
  } {
    const tracks = this.engine.getAllTracks();
    const activeTracks = tracks.filter(t => t.enabled).length;
    
    let totalKeyframes = 0;
    for (const track of tracks) {
      for (const keyframes of Object.values(track.keyframes)) {
        totalKeyframes += keyframes.length;
      }
    }

    return {
      totalTracks: tracks.length,
      activeTracks,
      totalKeyframes,
      duration: this.engine.getState().duration
    };
  }

  /**
   * Clear all markers
   */
  clearMarkers(): void {
    this.markers = [];
  }

  /**
   * Export timeline data
   */
  export(): any {
    return {
      markers: this.markers,
      snapEnabled: this.snapEnabled,
      snapInterval: this.snapInterval
    };
  }

  /**
   * Import timeline data
   */
  import(data: any): void {
    if (data.markers) {
      this.markers = data.markers;
    }
    if (data.snapEnabled !== undefined) {
      this.snapEnabled = data.snapEnabled;
    }
    if (data.snapInterval !== undefined) {
      this.snapInterval = data.snapInterval;
    }
  }
}
