# 🎨 Custom Animation Builder - Quick Start

## 3-Step Process

### Step 1: Open the Builder
```
Click ✨ Animations → 🎨 Custom tab → "Open Custom Animation Builder"
```

### Step 2: Configure Your Animation
```
Basic Settings:
├─ Emoji: 🌟 (any emoji/character)
├─ Duration: 60 frames
└─ Easing: easeInOut

Keyframes:
├─ Keyframe 1 (Frame 0):
│  ├─ X: 100, Y: 300
│  ├─ Rotation: 0°
│  ├─ Scale: 0.5
│  └─ Opacity: 0
│
└─ Keyframe 2 (Frame 60):
   ├─ X: 700, Y: 300
   ├─ Rotation: 360°
   ├─ Scale: 1.5
   └─ Opacity: 1
```

### Step 3: Apply
```
Click "Apply Custom Animation" → Frames generate automatically!
```

## Visual Example

### Creating a Spinning, Growing Star

```
┌─────────────────────────────────────────────────┐
│  Custom Animation Builder                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Emoji: 🌟                Duration: 60          │
│  Easing: [easeInOut ▼]                         │
│                                                 │
│  ┌─ Keyframe 1 ─────────────────────────────┐ │
│  │ Frame: 0                                  │ │
│  │ X: 100   Y: 300   Rotation: 0°           │ │
│  │ Scale: 0.5   Opacity: 0                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Keyframe 2 ─────────────────────────────┐ │
│  │ Frame: 60                                 │ │
│  │ X: 700   Y: 300   Rotation: 360°         │ │
│  │ Scale: 1.5   Opacity: 1                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [Apply Custom Animation]                      │
└─────────────────────────────────────────────────┘

Result:
Frame 0:  🌟 (small, invisible, left side)
Frame 15: 🌟 (growing, fading in, rotating)
Frame 30: 🌟 (medium, visible, center)
Frame 45: 🌟 (larger, rotating more)
Frame 60: 🌟 (large, fully visible, right side, full rotation)
```

## Common Patterns

### 1. Simple Movement
```
Keyframe 1: x=100, y=300
Keyframe 2: x=700, y=300
→ Moves left to right
```

### 2. Rotation
```
Keyframe 1: rotation=0
Keyframe 2: rotation=360
→ Spins once
```

### 3. Scale Animation
```
Keyframe 1: scale=0.5
Keyframe 2: scale=2.0
→ Grows larger
```

### 4. Fade In/Out
```
Keyframe 1: opacity=0
Keyframe 2: opacity=1
Keyframe 3: opacity=0
→ Fades in then out
```

### 5. Bounce Effect
```
Easing: bounce
Keyframe 1: y=100
Keyframe 2: y=500
→ Bounces down
```

## Quick Examples

### Twinkling Star ⭐
```
Emoji: ⭐
Duration: 40
Easing: easeInOut

Keyframe 1 (0):  scale=0.8, opacity=0.5
Keyframe 2 (20): scale=1.2, opacity=1.0
Keyframe 3 (40): scale=0.8, opacity=0.5
```

### Flying Bird 🐦
```
Emoji: 🐦
Duration: 90
Easing: easeInOut

Keyframe 1 (0):  x=0,   y=200, rotation=-10
Keyframe 2 (45): x=400, y=150, rotation=0
Keyframe 3 (90): x=800, y=200, rotation=10
```

### Pulsing Heart ❤️
```
Emoji: ❤️
Duration: 30
Easing: easeInOut

Keyframe 1 (0):  scale=1.0
Keyframe 2 (15): scale=1.3
Keyframe 3 (30): scale=1.0
```

### Falling Leaf 🍂
```
Emoji: 🍂
Duration: 120
Easing: linear

Keyframe 1 (0):   x=400, y=0,   rotation=0
Keyframe 2 (30):  x=350, y=150, rotation=90
Keyframe 3 (60):  x=450, y=300, rotation=180
Keyframe 4 (90):  x=400, y=450, rotation=270
Keyframe 5 (120): x=400, y=600, rotation=360
```

## Tips

✅ **Start with 2 keyframes** - Add more later for complexity
✅ **Test early** - Apply and preview, then refine
✅ **Use easeInOut** - Most natural for general motion
✅ **Keep it simple** - Complex animations can be built from simple keyframes
✅ **Match first/last** - For seamless loops

❌ **Don't overcomplicate** - More keyframes ≠ better
❌ **Watch coordinates** - Stay within canvas (0-800, 0-600)
❌ **Avoid zero scale** - Object becomes invisible
❌ **Check frame order** - Keyframes must be sequential

## Keyboard Workflow

While in the builder:
- `Tab` - Move between fields
- `Enter` - Apply animation
- `Esc` - Cancel/close

## What Gets Animated?

| Property | Range | Effect |
|----------|-------|--------|
| X Position | 0-800 | Horizontal movement |
| Y Position | 0-600 | Vertical movement |
| Rotation | -360 to 360° | Spinning/tilting |
| Scale | 0.1-3.0 | Size changes |
| Opacity | 0-1 | Fade in/out |

## Easing Cheat Sheet

```
linear:     ────────────  Constant speed
easeIn:     ╰────────────  Slow → Fast
easeOut:    ────────────╮  Fast → Slow
easeInOut:  ╰──────────╮  Slow → Fast → Slow
bounce:     ╰─╮╰╮╰╮─────  Bouncing physics
elastic:    ╰─╮╭╮───────  Spring overshoot
```

## Next Steps

1. **Try the examples** above
2. **Experiment** with different emojis
3. **Combine** multiple animations
4. **Share** your creations!

For more details, see [CUSTOM_ANIMATION_GUIDE.md](./CUSTOM_ANIMATION_GUIDE.md)

---

**Ready?** Click **✨ Animations** → **🎨 Custom** and start creating! 🎨
