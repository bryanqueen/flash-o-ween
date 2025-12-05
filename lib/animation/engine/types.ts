/**
 * Core Animation Engine Types
 */

import { FabricObject } from 'fabric';
import { EasingFunction } from '../types';

/**
 * Animation keyframe
 */
export interface Keyframe {
  time: number;      // Time in seconds
  value: number;     // Property value at this time
  easing?: EasingFunction;
}

/**
 * Animation track - controls one or more properties of an object
 */
export interface AnimationTrack {
  id: string;
  name: string;
  target?: FabricObject;  // Fabric object to animate
  targetId?: string;      // Alternative: target by ID
  startTime: number;      // When track starts (seconds)
  duration: number;       // Track duration (seconds)
  enabled: boolean;       // Is track active
  easing?: EasingFunction;
  keyframes: {
    [property: string]: Keyframe[];  // Property name -> keyframes
  };
}

/**
 * Animation state
 */
export interface AnimationState {
  isPlaying: boolean;
  currentTime: number;    // Current playback time (seconds)
  duration: number;       // Total animation duration (seconds)
  fps: number;            // Frames per second
  loop: boolean;          // Loop playback
  speed: number;          // Playback speed multiplier
}

/**
 * Playback options
 */
export interface PlaybackOptions {
  fps?: number;
  loop?: boolean;
  speed?: number;
  autoplay?: boolean;
}

/**
 * Animation event
 */
export interface AnimationEvent {
  type: string;
  time?: number;
  track?: AnimationTrack;
  speed?: number;
  fps?: number;
  loop?: boolean;
}

/**
 * Timeline marker
 */
export interface TimelineMarker {
  time: number;
  label: string;
  color?: string;
}

/**
 * Animation clip - reusable animation sequence
 */
export interface AnimationClip {
  id: string;
  name: string;
  duration: number;
  tracks: AnimationTrack[];
}
