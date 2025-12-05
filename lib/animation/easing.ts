/**
 * Easing Functions for Animation
 */

import { EasingFunction } from './types';

export const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t: number) => t,
  
  easeIn: (t: number) => t * t,
  
  easeOut: (t: number) => t * (2 - t),
  
  easeInOut: (t: number) => {
    if (t < 0.5) {
      return 2 * t * t;
    }
    return -1 + (4 - 2 * t) * t;
  },
  
  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  
  elastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  }
};

export function interpolate(start: number, end: number, progress: number, easing: EasingFunction = 'linear'): number {
  const easedProgress = easingFunctions[easing](progress);
  return start + (end - start) * easedProgress;
}
