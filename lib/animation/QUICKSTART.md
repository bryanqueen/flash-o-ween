# Animation System Quick Start

## For Users

### Apply a Pre-built Animation
1. Click **✨ Animations** button (top menu)
2. Select an animation from the list
3. Done! Animation applies to current frame

### Create Text Animation
1. Click **✨ Animations** → **Text Animation** tab
2. Type your text (e.g., "BOO!")
3. Customize color and size
4. Click **Apply Text Animation**

## For Developers

### Basic Usage

```typescript
import { AnimationGenerator, AnimationRenderer } from '@/lib/animation';
import { animationPresets } from '@/lib/animation/presets';

// 1. Get a preset
const bouncingBall = animationPresets.find(p => p.id === 'bouncing-ball');

// 2. Generate frames
const generator = new AnimationGenerator();
const frames = generator.generateFromPreset(bouncingBall);

// 3. Apply to canvas
const renderer = new AnimationRenderer();
const updatedFrames = await renderer.applyToCanvas(
  fabricCanvas,
  frames,
  startFrameIndex,
  existingFrames
);
```

### Create Custom Animation

```typescript
import { AnimationPreset } from '@/lib/animation/types';

const myAnimation: AnimationPreset = {
  id: 'spinning-star',
  name: 'Spinning Star',
  description: 'A star that spins in place',
  emoji: '⭐',
  duration: 60,
  easing: 'linear',
  keyframes: [
    { frame: 0, x: 400, y: 300, rotation: 0, scale: 1 },
    { frame: 30, x: 400, y: 300, rotation: 180, scale: 1.5 },
    { frame: 60, x: 400, y: 300, rotation: 360, scale: 1 }
  ]
};

const frames = generator.generateFromPreset(myAnimation);
```

### Text Animation

```typescript
const textConfig = {
  text: 'SPOOKY!',
  startFrame: 0,
  letterDelay: 10,  // frames between letters
  fontSize: 100,
  color: '#ff0000',
  x: 200,
  y: 300
};

const frames = generator.generateTextAnimation(textConfig);
```

### Combine Multiple Animations

```typescript
const animation1 = generator.generateFromPreset(preset1);
const animation2 = generator.generateFromPreset(preset2);

const combined = generator.combineAnimations([animation1, animation2]);
```

## Available Easing Functions

- `linear` - Constant speed
- `easeIn` - Accelerate from zero
- `easeOut` - Decelerate to zero
- `easeInOut` - Accelerate then decelerate
- `bounce` - Bouncing effect
- `elastic` - Spring-like overshoot

## Keyframe Properties

All properties are optional and will interpolate between keyframes:

```typescript
{
  frame: number;      // Frame number (required)
  x?: number;         // X position
  y?: number;         // Y position
  rotation?: number;  // Rotation in degrees
  scale?: number;     // Scale multiplier (1 = 100%)
  opacity?: number;   // Opacity (0-1)
}
```

## Architecture

```
User clicks preset
    ↓
AnimationPresetPanel (UI)
    ↓
AnimationGenerator (creates frame data)
    ↓
AnimationRenderer (applies to Fabric canvas)
    ↓
Updated frames in timeline
```

## Testing

```bash
npm test lib/animation/__tests__/animation-system.test.ts
```

## File Structure

- `types.ts` - TypeScript interfaces
- `presets.ts` - Built-in animation definitions
- `easing.ts` - Interpolation functions
- `generator.ts` - Frame generation logic
- `renderer.ts` - Canvas rendering
- `components/AnimationPresetPanel.tsx` - UI component
- `components/AnimationPreview.tsx` - Preview component

## Performance Tips

1. **Frame count**: Keep animations under 120 frames for smooth performance
2. **Easing**: Use simpler easing functions for better performance
3. **Combining**: Limit to 3-4 simultaneous animations
4. **Canvas size**: Smaller canvas = faster rendering

## Common Patterns

### Loop Animation
```typescript
keyframes: [
  { frame: 0, x: 100, y: 100 },
  { frame: 30, x: 200, y: 200 },
  { frame: 60, x: 100, y: 100 }  // Return to start
]
```

### Fade In/Out
```typescript
keyframes: [
  { frame: 0, opacity: 0 },
  { frame: 30, opacity: 1 },
  { frame: 60, opacity: 0 }
]
```

### Circular Motion
```typescript
// Use trigonometry in custom generator
const angle = (frame / duration) * Math.PI * 2;
const x = centerX + radius * Math.cos(angle);
const y = centerY + radius * Math.sin(angle);
```

## Troubleshooting

**Animation not smooth?**
- Check keyframe spacing (more keyframes = smoother)
- Try different easing function
- Increase FPS in playback

**Objects not appearing?**
- Verify x, y coordinates are within canvas bounds
- Check opacity is not 0
- Ensure scale is not 0

**Performance issues?**
- Reduce animation duration
- Simplify keyframes
- Use linear easing instead of complex functions

## Next Steps

1. Try the built-in presets
2. Modify preset parameters
3. Create your own custom animations
4. Combine multiple animations
5. Export and share!

Happy animating! 🎃
