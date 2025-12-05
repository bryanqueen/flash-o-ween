/**
 * Built-in Animation Presets
 */

import { AnimationPreset } from './types';

export const animationPresets: AnimationPreset[] = [
  {
    id: 'bouncing-ball',
    name: 'Bouncing Ball',
    description: 'A ball that bounces up and down',
    emoji: '⚽',
    duration: 60,
    easing: 'bounce',
    keyframes: [
      { frame: 0, x: 400, y: 100, scale: 1 },
      { frame: 15, x: 400, y: 450, scale: 1.2 },
      { frame: 30, x: 400, y: 100, scale: 1 },
      { frame: 45, x: 400, y: 450, scale: 1.2 },
      { frame: 60, x: 400, y: 100, scale: 1 }
    ]
  },
  {
    id: 'ghost-floating',
    name: 'Ghost Floating',
    description: 'A ghost floating up and down smoothly',
    emoji: '👻',
    duration: 90,
    easing: 'easeInOut',
    keyframes: [
      { frame: 0, x: 300, y: 200, opacity: 0.8, rotation: -5 },
      { frame: 30, x: 350, y: 250, opacity: 1, rotation: 0 },
      { frame: 60, x: 400, y: 200, opacity: 0.8, rotation: 5 },
      { frame: 90, x: 300, y: 200, opacity: 0.8, rotation: -5 }
    ]
  },
  {
    id: 'pumpkin-smiling',
    name: 'Pumpkin Smiling',
    description: 'A pumpkin that grows and pulses',
    emoji: '🎃',
    duration: 60,
    easing: 'easeInOut',
    keyframes: [
      { frame: 0, x: 400, y: 300, scale: 0.8, rotation: -10 },
      { frame: 15, x: 400, y: 300, scale: 1.2, rotation: 0 },
      { frame: 30, x: 400, y: 300, scale: 1, rotation: 10 },
      { frame: 45, x: 400, y: 300, scale: 1.2, rotation: 0 },
      { frame: 60, x: 400, y: 300, scale: 0.8, rotation: -10 }
    ]
  },
  {
    id: 'bat-flying',
    name: 'Bat Flying',
    description: 'A bat flying across the screen',
    emoji: '🦇',
    duration: 120,
    easing: 'easeInOut',
    keyframes: [
      { frame: 0, x: -50, y: 150, scale: 1, rotation: 0 },
      { frame: 30, x: 200, y: 100, scale: 1.1, rotation: -15 },
      { frame: 60, x: 400, y: 200, scale: 1, rotation: 0 },
      { frame: 90, x: 600, y: 150, scale: 1.1, rotation: 15 },
      { frame: 120, x: 850, y: 100, scale: 1, rotation: 0 }
    ]
  }
];
