# Animation Engine Examples

## Basic Usage

### Creating an Animation Engine

```typescript
import { Canvas } from 'fabric';
import { AnimationEngine, createTrack } from '@/lib/animation/engine';

// Create canvas
const canvas = new Canvas(canvasElement, {
  width: 800,
  height: 600
});

// Create engine
const engine = new AnimationEngine(canvas, {
  fps: 30,
  loop: true,
  speed: 1.0
});
```

### Creating a Simple Animation

```typescript
import { FabricText } from 'fabric';

// Create object to animate
const text = new FabricText('Hello!', {
  left: 100,
  top: 100,
  fontSize: 60
});
canvas.add(text);

// Create animation track
const track = createTrack('text-move', 'Move Text')
  .target(text)
  .duration(2)
  .easing('easeInOut')
  .moveTo(0, 2, 100, 100, 400, 300)
  .build();

// Add track and play
engine.addTrack(track);
engine.play();
```

## Advanced Examples

### Fade In Animation

```typescript
const fadeTrack = createTrack('fade-in', 'Fade In')
  .target(myObject)
  .fadeIn(0, 1.5)
  .build();

engine.addTrack(fadeTrack);
```

### Spin Animation

```typescript
const spinTrack = createTrack('spin', 'Spin 360')
  .target(myObject)
  .spin(0, 2, 2) // 2 full rotations in 2 seconds
  .easing('linear')
  .build();

engine.addTrack(spinTrack);
```

### Pulse Animation

```typescript
const pulseTrack = createTrack('pulse', 'Pulse Effect')
  .target(myObject)
  .pulse(0, 1, 0.8, 1.2) // Scale from 0.8 to 1.2
  .easing('easeInOut')
  .build();

engine.addTrack(pulseTrack);
```

### Bounce Animation

```typescript
const bounceTrack = createTrack('bounce', 'Bounce')
  .target(ball)
  .bounce(0, 1, 100, 400) // Bounce from y=100 to y=400
  .build();

engine.addTrack(bounceTrack);
```

### Complex Multi-Property Animation

```typescript
const complexTrack = createTrack('complex', 'Complex Animation')
  .target(myObject)
  .duration(3)
  .easing('easeInOut')
  // Position
  .keyframe('x', 0, 100)
  .keyframe('x', 1.5, 400)
  .keyframe('x', 3, 100)
  // Rotation
  .keyframe('rotation', 0, 0)
  .keyframe('rotation', 1.5, 180)
  .keyframe('rotation', 3, 360)
  // Scale
  .keyframe('scaleX', 0, 1)
  .keyframe('scaleX', 1.5, 1.5)
  .keyframe('scaleX', 3, 1)
  // Opacity
  .keyframe('opacity', 0, 1)
  .keyframe('opacity', 1.5, 0.5)
  .keyframe('opacity', 3, 1)
  .build();

engine.addTrack(complexTrack);
```

## Sequential Animations

```typescript
// Animation 1: Fade in (0-1s)
const fadeIn = createTrack('fade', 'Fade In')
  .target(obj)
  .fadeIn(0, 1)
  .build();

// Animation 2: Move (1-3s)
const move = createTrack('move', 'Move')
  .target(obj)
  .startAt(1)
  .moveTo(0, 2, 100, 100, 400, 300)
  .build();

// Animation 3: Fade out (3-4s)
const fadeOut = createTrack('fadeout', 'Fade Out')
  .target(obj)
  .startAt(3)
  .fadeOut(0, 1)
  .build();

engine.addTrack(fadeIn);
engine.addTrack(move);
engine.addTrack(fadeOut);
engine.play();
```

## Parallel Animations

```typescript
// Multiple objects animating simultaneously
const obj1Track = createTrack('obj1', 'Object 1')
  .target(object1)
  .moveTo(0, 2, 0, 100, 400, 100)
  .build();

const obj2Track = createTrack('obj2', 'Object 2')
  .target(object2)
  .moveTo(0, 2, 800, 100, 400, 100)
  .build();

const obj3Track = createTrack('obj3', 'Object 3')
  .target(object3)
  .fadeIn(0, 2)
  .build();

engine.addTrack(obj1Track);
engine.addTrack(obj2Track);
engine.addTrack(obj3Track);
engine.play();
```

## Event Handling

```typescript
// Listen to playback events
engine.on('play', (event) => {
  console.log('Animation started at', event.time);
});

engine.on('pause', (event) => {
  console.log('Animation paused at', event.time);
});

engine.on('update', (event) => {
  console.log('Current time:', event.time);
  updateTimelineUI(event.time);
});

engine.on('complete', (event) => {
  console.log('Animation completed!');
  showCompletionMessage();
});

engine.on('trackAdded', (event) => {
  console.log('Track added:', event.track.name);
});
```

## Playback Control

```typescript
// Play/Pause
engine.play();
engine.pause();
engine.toggle();

// Stop and reset
engine.stop();

// Seek to specific time
engine.seek(2.5); // Jump to 2.5 seconds

// Change speed
engine.setSpeed(0.5);  // Half speed
engine.setSpeed(2.0);  // Double speed

// Change FPS
engine.setFPS(60);

// Toggle loop
engine.setLoop(true);
```

## Timeline Management

```typescript
import { Timeline } from '@/lib/animation/engine';

const timeline = new Timeline(engine);

// Add markers
timeline.addMarker(0, 'Start', '#00ff00');
timeline.addMarker(2.5, 'Middle', '#ffff00');
timeline.addMarker(5, 'End', '#ff0000');

// Enable snapping
timeline.setSnap(true, 0.1); // Snap to 0.1 second intervals

// Split track at time
timeline.splitTrack('my-track', 1.5);

// Duplicate track
const newId = timeline.duplicateTrack('my-track', 2); // Offset by 2 seconds

// Move track
timeline.moveTrack('my-track', 3); // Move to 3 seconds

// Get statistics
const stats = timeline.getStats();
console.log(`Total tracks: ${stats.totalTracks}`);
console.log(`Total keyframes: ${stats.totalKeyframes}`);
console.log(`Duration: ${stats.duration}s`);
```

## Export/Import

```typescript
// Export animation
const animationData = engine.export();
localStorage.setItem('myAnimation', JSON.stringify(animationData));

// Import animation
const savedData = JSON.parse(localStorage.getItem('myAnimation'));
engine.import(savedData);
```

## Halloween Examples

### Ghost Floating

```typescript
const ghost = new FabricText('👻', {
  fontSize: 80,
  left: 300,
  top: 200
});
canvas.add(ghost);

const ghostTrack = createTrack('ghost', 'Ghost Float')
  .target(ghost)
  .duration(4)
  .easing('easeInOut')
  // Float up and down
  .keyframe('y', 0, 200)
  .keyframe('y', 2, 250)
  .keyframe('y', 4, 200)
  // Drift left and right
  .keyframe('x', 0, 300)
  .keyframe('x', 2, 350)
  .keyframe('x', 4, 300)
  // Fade in and out
  .keyframe('opacity', 0, 0.8)
  .keyframe('opacity', 2, 1)
  .keyframe('opacity', 4, 0.8)
  // Gentle rotation
  .keyframe('rotation', 0, -5)
  .keyframe('rotation', 2, 0)
  .keyframe('rotation', 4, 5)
  .build();

engine.addTrack(ghostTrack);
engine.setLoop(true);
engine.play();
```

### Bat Flying

```typescript
const bat = new FabricText('🦇', {
  fontSize: 60,
  left: -50,
  top: 150
});
canvas.add(bat);

const batTrack = createTrack('bat', 'Bat Flight')
  .target(bat)
  .duration(5)
  .easing('easeInOut')
  // Fly across screen
  .keyframe('x', 0, -50)
  .keyframe('x', 2.5, 400)
  .keyframe('x', 5, 850)
  // Wavy flight path
  .keyframe('y', 0, 150)
  .keyframe('y', 1.25, 100)
  .keyframe('y', 2.5, 200)
  .keyframe('y', 3.75, 150)
  .keyframe('y', 5, 100)
  // Wing flapping (scale)
  .keyframe('scaleX', 0, 1)
  .keyframe('scaleX', 0.5, 1.1)
  .keyframe('scaleX', 1, 1)
  .keyframe('scaleX', 1.5, 1.1)
  .keyframe('scaleX', 2, 1)
  // Tilt during flight
  .keyframe('rotation', 0, 0)
  .keyframe('rotation', 1.25, -15)
  .keyframe('rotation', 2.5, 0)
  .keyframe('rotation', 3.75, 15)
  .keyframe('rotation', 5, 0)
  .build();

engine.addTrack(batTrack);
engine.play();
```

### Pumpkin Pulse

```typescript
const pumpkin = new FabricText('🎃', {
  fontSize: 100,
  left: 350,
  top: 250
});
canvas.add(pumpkin);

const pumpkinTrack = createTrack('pumpkin', 'Pumpkin Pulse')
  .target(pumpkin)
  .pulse(0, 2, 0.8, 1.2)
  .build();

engine.addTrack(pumpkinTrack);
engine.setLoop(true);
engine.play();
```

### Text Reveal

```typescript
const letters = ['B', 'O', 'O', '!'];
const letterObjects = [];

letters.forEach((letter, i) => {
  const text = new FabricText(letter, {
    fontSize: 120,
    left: 200 + (i * 100),
    top: 250,
    fill: '#ff6b00',
    opacity: 0
  });
  canvas.add(text);
  letterObjects.push(text);

  // Create reveal animation for each letter
  const track = createTrack(`letter-${i}`, `Letter ${letter}`)
    .target(text)
    .startAt(i * 0.3) // Stagger by 0.3 seconds
    .duration(0.5)
    // Fade in
    .keyframe('opacity', 0, 0)
    .keyframe('opacity', 0.5, 1)
    // Bounce in
    .keyframe('y', 0, 200)
    .keyframe('y', 0.25, 250)
    .keyframe('y', 0.5, 250)
    // Pop scale
    .keyframe('scaleX', 0, 0.5)
    .keyframe('scaleX', 0.25, 1.2)
    .keyframe('scaleX', 0.5, 1)
    .build();

  engine.addTrack(track);
});

engine.play();
```

## Performance Tips

```typescript
// Use lower FPS for better performance
engine.setFPS(24); // Instead of 60

// Disable tracks when not needed
const track = engine.getTrack('my-track');
if (track) {
  track.enabled = false;
}

// Remove unused tracks
engine.removeTrack('old-track');

// Clean up when done
engine.destroy();
```

## Integration with Flash-o-ween

```typescript
// In your Flash-o-ween app
import { AnimationEngine, createTrack } from '@/lib/animation/engine';

// Initialize engine with Fabric canvas
const engine = new AnimationEngine(fabricCanvasRef.current, {
  fps: fps,
  loop: true
});

// Create animation from preset
function applyPreset(preset: AnimationPreset) {
  const track = createTrack(preset.id, preset.name)
    .duration(preset.duration / fps) // Convert frames to seconds
    .easing(preset.easing);

  // Add keyframes
  preset.keyframes.forEach(kf => {
    const time = kf.frame / fps;
    if (kf.x !== undefined) track.keyframe('x', time, kf.x);
    if (kf.y !== undefined) track.keyframe('y', time, kf.y);
    if (kf.rotation !== undefined) track.keyframe('rotation', time, kf.rotation);
    if (kf.scale !== undefined) {
      track.keyframe('scaleX', time, kf.scale);
      track.keyframe('scaleY', time, kf.scale);
    }
    if (kf.opacity !== undefined) track.keyframe('opacity', time, kf.opacity);
  });

  engine.addTrack(track.build());
  engine.play();
}
```

Happy animating! 🎃
