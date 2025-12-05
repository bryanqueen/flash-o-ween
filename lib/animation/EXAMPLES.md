# Animation Examples

## Visual Guide to Each Animation

### 1. ⚽ Bouncing Ball Animation

```
Frame 0:    ⚽ (top, scale: 1.0)
            |
Frame 15:   |
            |
            ⚽ (bottom, scale: 1.2) ← squashed on impact
            
Frame 30:   ⚽ (top, scale: 1.0)
            |
Frame 45:   |
            |
            ⚽ (bottom, scale: 1.2)
            
Frame 60:   ⚽ (top, scale: 1.0)
```

**Properties Animated:**
- Y position: 100 → 450 → 100 (bouncing)
- Scale: 1.0 → 1.2 → 1.0 (squash on impact)
- X position: 400 (stays centered)

**Easing:** Bounce (realistic physics)

---

### 2. 👻 Ghost Floating Animation

```
Frame 0:    👻 (left, slightly down, rotated -5°, opacity 0.8)
            
Frame 30:      👻 (center, middle, no rotation, opacity 1.0)
            
Frame 60:         👻 (right, slightly down, rotated 5°, opacity 0.8)
            
Frame 90:   👻 (back to start)
```

**Properties Animated:**
- X position: 300 → 350 → 400 → 300 (drifting)
- Y position: 200 → 250 → 200 (floating)
- Rotation: -5° → 0° → 5° → -5° (gentle sway)
- Opacity: 0.8 → 1.0 → 0.8 (ethereal effect)

**Easing:** EaseInOut (smooth, ghostly)

---

### 3. 🎃 Pumpkin Smiling Animation

```
Frame 0:    🎃 (small, rotated -10°)
            
Frame 15:     🎃 (large, no rotation)
            
Frame 30:    🎃 (normal, rotated 10°)
            
Frame 45:     🎃 (large, no rotation)
            
Frame 60:    🎃 (small, rotated -10°)
```

**Properties Animated:**
- Scale: 0.8 → 1.2 → 1.0 → 1.2 → 0.8 (pulsing)
- Rotation: -10° → 0° → 10° → 0° → -10° (wobble)
- X, Y: 400, 300 (stays centered)

**Easing:** EaseInOut (breathing effect)

---

### 4. 🦇 Bat Flying Animation

```
Frame 0:    🦇 (off-screen left)
            
Frame 30:        🦇 (entering, tilted up)
            
Frame 60:              🦇 (center screen)
            
Frame 90:                    🦇 (exiting, tilted down)
            
Frame 120:                         🦇 (off-screen right)
```

**Properties Animated:**
- X position: -50 → 200 → 400 → 600 → 850 (flying across)
- Y position: 150 → 100 → 200 → 150 → 100 (wavy path)
- Rotation: 0° → -15° → 0° → 15° → 0° (flight dynamics)
- Scale: 1.0 → 1.1 → 1.0 → 1.1 → 1.0 (wing flapping)

**Easing:** EaseInOut (smooth flight)

---

### 5. 📝 Text Animation - "BOO!"

```
Frame 0-7:   (empty)

Frame 8:     B (appears with bounce)

Frame 16:    B O (second letter appears)

Frame 24:    B O O (third letter appears)

Frame 32:    B O O ! (final letter appears)

Frame 40+:   B O O ! (all visible, settled)
```

**Per Letter Animation:**
```
Appearance:
  Frame 0:   (invisible)
  Frame 1:   scale: 0.5, y: -20 (small, above)
  Frame 2:   scale: 0.7, y: -15
  Frame 3:   scale: 0.9, y: -8
  Frame 4:   scale: 1.0, y: -2
  Frame 5:   scale: 1.0, y: 0 (settled)
```

**Properties Animated:**
- Scale: 0.5 → 1.0 (pop-in)
- Y offset: -20 → 0 (bounce down)
- Opacity: 0 → 1 (fade in)
- Letter delay: 8 frames between each

**Easing:** Sine wave for bounce

---

## Combining Animations

### Example: Halloween Scene

```
Timeline:
0-60:    👻 Ghost floating in background
60-120:  🦇 Bat flies across
120-180: 🎃 Pumpkin pulses in foreground
180-220: B O O ! text appears

Result: 220 frames of spooky animation!
```

### Example: Multiple Objects

```
Frame 0:
  - Apply Ghost Floating at position (200, 200)
  - Apply Pumpkin Smiling at position (600, 300)
  
Result: Both animate simultaneously!
```

---

## Code Examples

### Bouncing Ball Keyframes

```typescript
keyframes: [
  { frame: 0,  x: 400, y: 100, scale: 1 },
  { frame: 15, x: 400, y: 450, scale: 1.2 },  // Impact
  { frame: 30, x: 400, y: 100, scale: 1 },    // Peak
  { frame: 45, x: 400, y: 450, scale: 1.2 },  // Impact
  { frame: 60, x: 400, y: 100, scale: 1 }     // Peak
]
```

### Ghost Floating Keyframes

```typescript
keyframes: [
  { frame: 0,  x: 300, y: 200, opacity: 0.8, rotation: -5 },
  { frame: 30, x: 350, y: 250, opacity: 1,   rotation: 0 },
  { frame: 60, x: 400, y: 200, opacity: 0.8, rotation: 5 },
  { frame: 90, x: 300, y: 200, opacity: 0.8, rotation: -5 }
]
```

### Custom Text Animation

```typescript
const config = {
  text: 'SPOOKY',
  startFrame: 0,
  letterDelay: 10,
  fontSize: 100,
  color: '#ff0000',
  x: 200,
  y: 300
};

// Generates:
// Frame 0-9:   (empty)
// Frame 10:    S
// Frame 20:    S P
// Frame 30:    S P O
// Frame 40:    S P O O
// Frame 50:    S P O O K
// Frame 60:    S P O O K Y
```

---

## Easing Comparison

### Linear vs EaseInOut (Ghost Floating)

```
Linear:
Position: 300 → 325 → 350 → 375 → 400
          (constant speed)

EaseInOut:
Position: 300 → 310 → 350 → 390 → 400
          (slow → fast → slow)
```

### Bounce Easing (Ball)

```
Y Position over time:
100 ↓
    ↓
    ↓ (accelerating)
    ↓
450 ← impact
    ↑ (bounce back)
    ↑
    ↑ (decelerating)
100 ← peak
```

---

## Performance Notes

### Frame Counts
- Bouncing Ball: 60 frames
- Ghost Floating: 90 frames
- Pumpkin Smiling: 60 frames
- Bat Flying: 120 frames
- Text (4 chars): ~40 frames

### Rendering Time
- Single animation: ~100-200ms
- Text animation: ~50-100ms
- Combined (2 animations): ~200-300ms

### Memory Usage
- Each frame: ~50-100KB (with thumbnail)
- 60-frame animation: ~3-6MB
- Typical scene (3 animations): ~10-15MB

---

## Tips & Tricks

### Smooth Loops
Make first and last keyframes identical:
```typescript
{ frame: 0,  x: 100, y: 100 },
{ frame: 30, x: 200, y: 200 },
{ frame: 60, x: 100, y: 100 }  // Same as frame 0
```

### Realistic Physics
Use bounce easing for gravity effects:
```typescript
easing: 'bounce'
```

### Ethereal Effects
Combine opacity and rotation:
```typescript
{ opacity: 0.8, rotation: -5 },
{ opacity: 1.0, rotation: 0 },
{ opacity: 0.8, rotation: 5 }
```

### Dynamic Text
Adjust letter delay for speed:
```typescript
letterDelay: 5   // Fast
letterDelay: 10  // Normal
letterDelay: 15  // Slow, dramatic
```

---

## Common Patterns

### Fade In
```typescript
{ frame: 0,  opacity: 0 },
{ frame: 30, opacity: 1 }
```

### Spin
```typescript
{ frame: 0,  rotation: 0 },
{ frame: 60, rotation: 360 }
```

### Grow
```typescript
{ frame: 0,  scale: 0 },
{ frame: 30, scale: 1 }
```

### Slide In
```typescript
{ frame: 0,  x: -100 },
{ frame: 30, x: 400 }
```

Happy animating! 🎃👻🦇
