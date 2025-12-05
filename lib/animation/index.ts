/**
 * Animation System
 * Includes both preset system and core animation engine
 */

// Preset System
export * from './types';
export * from './easing';
export * from './presets';
export * from './generator';
export * from './renderer';
export * from './tween-generator';
export { AnimationPresetPanel } from './components/AnimationPresetPanel';
export { CustomAnimationBuilder } from './components/CustomAnimationBuilder';
export { TweenPanel } from './components/TweenPanel';

// Core Animation Engine
export * from './engine';
