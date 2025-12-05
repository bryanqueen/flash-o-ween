# Animation System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Flash-o-ween Editor (app/page.tsx)                  │  │
│  │  - Canvas                                             │  │
│  │  - Timeline                                           │  │
│  │  - Tools                                              │  │
│  │  - ✨ Animations Button                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              AnimationPresetPanel Component                  │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ Preset Gallery   │  │  Text Animation Config       │   │
│  │ - Bouncing Ball  │  │  - Text input                │   │
│  │ - Ghost Floating │  │  - Font size slider          │   │
│  │ - Pumpkin Smile  │  │  - Color picker              │   │
│  │ - Bat Flying     │  │  - Apply button              │   │
│  └──────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Animation Generator                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  generateFromPreset(preset)                          │  │
│  │  - Reads keyframes                                    │  │
│  │  - Interpolates between frames                        │  │
│  │  - Applies easing functions                           │  │
│  │  - Returns GeneratedFrame[]                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  generateTextAnimation(config)                        │  │
│  │  - Calculates letter timing                           │  │
│  │  - Creates bounce effects                             │  │
│  │  - Returns GeneratedFrame[]                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Animation Renderer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  applyToCanvas(canvas, frames, startFrame)           │  │
│  │  - Creates temporary Fabric canvas                    │  │
│  │  - Loads existing frame data                          │  │
│  │  - Adds generated objects                             │  │
│  │  - Renders to JSON + thumbnail                        │  │
│  │  - Returns updated frame array                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Frame Storage                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  frames: Frame[]                                      │  │
│  │  - id: number                                         │  │
│  │  - data: string (Fabric JSON)                         │  │
│  │  - thumbnail: string (data URL)                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Timeline & Playback                       │
│  - Display frame thumbnails                                  │
│  - Play/pause animation                                      │
│  - Scrub through frames                                      │
│  - Export to HTML                                            │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Applying a Preset Animation

```
1. User clicks "Bouncing Ball" preset
   ↓
2. AnimationPresetPanel calls onApplyPreset(preset)
   ↓
3. handleApplyPreset() in page.tsx:
   - Sets isApplyingAnimation = true
   - Saves current frame
   ↓
4. AnimationGenerator.generateFromPreset(preset):
   - Iterates through duration (60 frames)
   - For each frame:
     * Finds surrounding keyframes
     * Calculates progress (0-1)
     * Applies easing function
     * Interpolates all properties (x, y, rotation, scale, opacity)
   - Returns GeneratedFrame[] with 60 frames
   ↓
5. AnimationRenderer.applyToCanvas():
   - Creates temporary Fabric canvas
   - For each generated frame:
     * Loads existing frame data (if any)
     * Creates Fabric objects from generated data
     * Renders canvas
     * Converts to JSON + thumbnail
     * Stores in frame array
   - Returns updated frames
   ↓
6. setFrames(updatedFrames)
   - React updates state
   - Timeline re-renders with new thumbnails
   - User sees animation in timeline
   ↓
7. User clicks Play
   - Frames display in sequence
   - Animation plays smoothly
```

### Text Animation Flow

```
1. User enters "BOO!" in text panel
   ↓
2. User clicks "Apply Text Animation"
   ↓
3. handleApplyTextAnimation(config)
   ↓
4. AnimationGenerator.generateTextAnimation():
   - Calculates total frames needed
   - For each frame:
     * Determines how many letters to show
     * For each visible letter:
       - Calculate age since appearance
       - Apply bounce effect (y offset)
       - Apply scale effect (pop-in)
       - Create CanvasObject
   - Returns GeneratedFrame[]
   ↓
5. AnimationRenderer.applyToCanvas()
   - Same rendering process as presets
   ↓
6. Frames appear in timeline
   - Each frame shows progressive letter reveal
```

## Component Hierarchy

```
FlashOWeen (app/page.tsx)
├── Canvas (Fabric.js)
├── Tools Sidebar
├── Properties Panel
├── Timeline
│   └── Frame Thumbnails
├── AnimationPresetPanel
│   ├── Preset Gallery
│   │   └── Preset Cards (4 animations)
│   └── Text Animation Tab
│       ├── Text Input
│       ├── Font Size Slider
│       ├── Color Picker
│       └── Apply Button
└── ExportPanel
```

## Module Dependencies

```
app/page.tsx
├── fabric (Canvas, Rect, Circle, FabricText, PencilBrush)
├── @/lib/export (ExportPanel, Frame)
└── @/lib/animation
    ├── AnimationPresetPanel
    ├── AnimationGenerator
    ├── AnimationRenderer
    └── types (AnimationPreset, TextAnimationConfig)

lib/animation/
├── components/
│   ├── AnimationPresetPanel.tsx
│   │   └── uses: types, presets
│   └── AnimationPreview.tsx
│       └── uses: types, generator, easing
├── generator.ts
│   └── uses: types, easing
├── renderer.ts
│   └── uses: types, fabric
├── easing.ts
│   └── uses: types
├── presets.ts
│   └── uses: types
└── types.ts (no dependencies)
```

## State Management

```
FlashOWeen Component State:
├── selectedTool: Tool
├── isPlaying: boolean
├── currentFrame: number
├── fps: number
├── brushSize: number
├── brushColor: string
├── frames: Frame[]
├── isExportPanelOpen: boolean
├── isAnimationPanelOpen: boolean ← NEW
└── isApplyingAnimation: boolean ← NEW

Refs:
├── canvasRef: HTMLCanvasElement
├── fabricCanvasRef: Canvas
├── historyRef: string[]
├── historyStepRef: number
└── previousFrameRef: number
```

## Type System

```typescript
// Core Types
interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  duration: number;
  keyframes: AnimationKeyframe[];
  easing: EasingFunction;
}

interface AnimationKeyframe {
  frame: number;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
}

interface GeneratedFrame {
  objects: CanvasObject[];
}

interface CanvasObject {
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

type EasingFunction = 
  | 'linear' 
  | 'easeIn' 
  | 'easeOut' 
  | 'easeInOut' 
  | 'bounce' 
  | 'elastic';
```

## Algorithms

### Keyframe Interpolation

```typescript
function interpolateKeyframes(
  keyframes: AnimationKeyframe[],
  frameIndex: number,
  preset: AnimationPreset
): CanvasObject {
  // 1. Find surrounding keyframes
  let start, end;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frameIndex >= keyframes[i].frame && 
        frameIndex <= keyframes[i + 1].frame) {
      start = keyframes[i];
      end = keyframes[i + 1];
      break;
    }
  }
  
  // 2. Calculate progress (0-1)
  const frameDiff = end.frame - start.frame;
  const progress = (frameIndex - start.frame) / frameDiff;
  
  // 3. Apply easing
  const easedProgress = easingFunctions[preset.easing](progress);
  
  // 4. Interpolate each property
  return {
    x: interpolate(start.x, end.x, easedProgress),
    y: interpolate(start.y, end.y, easedProgress),
    rotation: interpolate(start.rotation, end.rotation, easedProgress),
    scale: interpolate(start.scale, end.scale, easedProgress),
    opacity: interpolate(start.opacity, end.opacity, easedProgress)
  };
}
```

### Bounce Easing

```typescript
function bounce(t: number): number {
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
}
```

### Text Letter Timing

```typescript
function generateTextAnimation(config: TextAnimationConfig) {
  const frames = [];
  const totalFrames = config.startFrame + 
                     (config.text.length * config.letterDelay) + 30;
  
  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const framesSinceStart = frameIndex - config.startFrame;
    const lettersToShow = Math.floor(framesSinceStart / config.letterDelay);
    
    const objects = [];
    for (let i = 0; i < Math.min(lettersToShow, config.text.length); i++) {
      const letterAge = framesSinceStart - (i * config.letterDelay);
      
      // Bounce effect
      const yOffset = letterAge < 10 
        ? -20 * Math.sin((letterAge / 10) * Math.PI)
        : 0;
      
      // Scale effect
      const scale = letterAge < 5
        ? 0.5 + (letterAge / 5) * 0.5
        : 1;
      
      objects.push({
        content: config.text[i],
        x: config.x + (i * config.fontSize * 0.7),
        y: config.y + yOffset,
        scale: scale
      });
    }
    
    frames.push({ objects });
  }
  
  return frames;
}
```

## Performance Considerations

### Rendering Pipeline
1. **Temporary Canvas**: Uses off-screen canvas for rendering
2. **Batch Processing**: Renders all frames in sequence
3. **Async Operations**: Yields to event loop between frames
4. **Thumbnail Generation**: Low quality (0.3) and small size (0.1x)

### Memory Management
- Temporary canvases are disposed after use
- Frame data stored as JSON strings (compressed)
- Thumbnails use data URLs (base64)

### Optimization Strategies
- Pre-render all frames (no runtime interpolation)
- Cache easing function results
- Minimize canvas operations
- Use requestAnimationFrame for playback

## Extension Points

### Adding New Presets
```typescript
// lib/animation/presets.ts
export const animationPresets: AnimationPreset[] = [
  // ... existing presets
  {
    id: 'new-animation',
    name: 'New Animation',
    description: 'Description',
    emoji: '🎨',
    duration: 60,
    easing: 'easeInOut',
    keyframes: [
      { frame: 0, x: 100, y: 100 },
      { frame: 60, x: 200, y: 200 }
    ]
  }
];
```

### Custom Easing Functions
```typescript
// lib/animation/easing.ts
export const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  // ... existing functions
  myCustomEasing: (t: number) => {
    // Custom interpolation logic
    return t * t * t;
  }
};
```

### New Animation Types
```typescript
// Extend CanvasObject type
interface CanvasObject {
  type: 'text' | 'emoji' | 'shape'; // Add new type
  // ... existing properties
  shapeType?: 'circle' | 'rect'; // New property
}
```

## Testing Strategy

### Unit Tests
- Easing functions (mathematical correctness)
- Interpolation logic
- Keyframe validation
- Frame generation

### Integration Tests
- Preset application
- Text animation generation
- Canvas rendering
- Frame storage

### Manual Testing
- Visual inspection of animations
- Performance profiling
- Cross-browser compatibility
- Export functionality

## Future Enhancements

1. **Animation Timeline Editor**
   - Visual keyframe editing
   - Drag-and-drop keyframes
   - Real-time preview

2. **Custom Path Drawing**
   - Draw motion path on canvas
   - Convert to keyframes
   - Bezier curve support

3. **Animation Library**
   - Save custom animations
   - Share with others
   - Import/export presets

4. **Advanced Effects**
   - Particle systems
   - Motion blur
   - Shadow effects
   - Color transitions

5. **Performance Improvements**
   - Web Workers for rendering
   - Progressive loading
   - Frame caching
   - GPU acceleration

---

This architecture provides a solid foundation for the animation system while remaining extensible and maintainable. 🎃
