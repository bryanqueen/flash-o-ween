/**
 * Animation Preset System Types
 */

export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';

export interface AnimationKeyframe {
  frame: number;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
}

export interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  duration: number; // in frames
  keyframes: AnimationKeyframe[];
  easing: EasingFunction;
}

export interface TextAnimationConfig {
  text: string;
  startFrame: number;
  letterDelay: number; // frames between each letter
  fontSize: number;
  color: string;
  x: number;
  y: number;
}

export interface GeneratedFrame {
  objects: CanvasObject[];
}

export interface CanvasObject {
  type: 'text' | 'emoji';
  content: string;
  x: number;
  y: number;
  fontSize: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  color?: string;
}
