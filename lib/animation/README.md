# Animation Preset System

A complete animation system for Flash-o-ween that supports programmatic animations with keyframes, easing functions, and text effects.

## Features

### 🎬 Built-in Animation Presets

1. **Bouncing Ball** (⚽)
   - Ball bounces up and down with physics-based motion
   - 60 frames, bounce easing
   - Includes scale changes on impact

2. **Ghost Floating** (👻)
   - Smooth floating motion with opacity changes
   - 90 frames, easeInOut easing
   - Gentle rotation for ethereal effect

3. **Pumpkin Smiling** (🎃)
   - Pulsing/growing animation with rotation
   - 60 frames, easeInOut easing
   - Perfect for a happy pumpkin

4. **Bat Flying** (🦇)
   - Bat flies across the screen
   - 120 frames, easeInOut easing
   - Includes wing flapping simulation via scale

### 📝 Text Animation

- Letter-by-letter reveal effect
- Customizable text, color, and size
- Bounce effect when each letter appears
- Perfect for "BOO!" or any spooky text

## Usage

### In the App

1. Click the **✨ Animations** button in the top menu
2. Choose between:
   - **Animation Presets** tab: Select a pre-built animation
   - **Text Animation** tab: Create custom text reveals
3. Animation will be applied starting from the current frame
4. Frames are automatically generated and added to your timeline

### Programmatic Usage

```typescript
import { AnimationGenerator, AnimationRenderer } from '@/lib/animation';

// Generate frames from preset
const generator = new AnimationGenerator();
const frames = generator.generateFromPreset(preset);

// Apply to canvas
const renderer = new AnimationRenderer();
const updatedFrames = await renderer.applyToCanvas(
  fabricCanvas,
  frames,
  startFrame,
  existingFrames
);
```

## Architecture

- **types.ts**: TypeScript definitions for animations
- **presets.ts**: Built-in animation configurations
- **easing.ts**: Easing functions (linear, easeIn, easeOut, bounce, elastic)
- **generator.ts**: Generates frame data from presets
- **renderer.ts**: Applies generated frames to Fabric canvas
- **components/AnimationPresetPanel.tsx**: UI for selecting animations

## Easing Functions

- `linear`: Constant speed
- `easeIn`: Slow start, fast end
- `easeOut`: Fast start, slow end
- `easeInOut`: Slow start and end
- `bounce`: Bouncing effect
- `elastic`: Spring-like motion

## Extending

To add new animation presets, edit `presets.ts`:

```typescript
{
  id: 'my-animation',
  name: 'My Animation',
  description: 'Description here',
  emoji: '🎨',
  duration: 60,
  easing: 'easeInOut',
  keyframes: [
    { frame: 0, x: 100, y: 100, scale: 1 },
    { frame: 30, x: 200, y: 200, scale: 1.5 },
    { frame: 60, x: 100, y: 100, scale: 1 }
  ]
}
```
