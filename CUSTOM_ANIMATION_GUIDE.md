# 🎨 Custom Animation Builder Guide

## Overview

The Custom Animation Builder lets you create your own animations from scratch with full control over every aspect of the motion!

## How to Access

1. Click **✨ Animations** button (purple, top menu)
2. Click the **🎨 Custom** tab
3. Click **"Open Custom Animation Builder"**

## Building Your Animation

### 1. Basic Settings

**Emoji/Object**
- Enter any emoji or character (🌟, 🕷️, 💫, etc.)
- This is what will be animated

**Duration**
- How many frames the animation lasts (10-300)
- At 12 FPS: 60 frames = 5 seconds

**Easing Function**
- `linear` - Constant speed
- `easeIn` - Slow start, fast end
- `easeOut` - Fast start, slow end  
- `easeInOut` - Smooth start and end
- `bounce` - Bouncing physics
- `elastic` - Spring-like overshoot

### 2. Keyframes

Keyframes define the object's state at specific frames. The system automatically interpolates between them.

**Each keyframe has:**
- **Frame #** - When this state occurs (0 to duration)
- **X Position** - Horizontal position (0-800)
- **Y Position** - Vertical position (0-600)
- **Rotation** - Angle in degrees (-360 to 360)
- **Scale** - Size multiplier (0.1 to 3.0)
- **Opacity** - Transparency (0 = invisible, 1 = solid)

**Managing Keyframes:**
- Click **➕ Add Keyframe** to add more
- Click **🗑️ Remove** to delete (must keep at least 2)
- Keyframes are automatically sorted by frame number

### 3. Apply

Click **"Apply Custom Animation"** and your animation will be generated!

## Examples

### Example 1: Spinning Star

```
Settings:
- Emoji: 🌟
- Duration: 60 frames
- Easing: linear

Keyframes:
1. Frame 0:  x=400, y=300, rotation=0,   scale=1
2. Frame 60: x=400, y=300, rotation=360, scale=1

Result: Star spins in place
```

### Example 2: Growing & Fading Circle

```
Settings:
- Emoji: ⭕
- Duration: 60 frames
- Easing: easeOut

Keyframes:
1. Frame 0:  x=400, y=300, scale=0.1, opacity=1
2. Frame 60: x=400, y=300, scale=3.0, opacity=0

Result: Circle grows and fades out
```

### Example 3: Bouncing Ball (Custom)

```
Settings:
- Emoji: ⚽
- Duration: 60 frames
- Easing: bounce

Keyframes:
1. Frame 0:  x=400, y=100, scale=1.0
2. Frame 15: x=400, y=450, scale=1.2
3. Frame 30: x=400, y=100, scale=1.0
4. Frame 45: x=400, y=450, scale=1.2
5. Frame 60: x=400, y=100, scale=1.0

Result: Ball bounces up and down with squash
```

### Example 4: Spider Crawling

```
Settings:
- Emoji: 🕷️
- Duration: 90 frames
- Easing: easeInOut

Keyframes:
1. Frame 0:  x=100, y=100, rotation=0
2. Frame 30: x=400, y=200, rotation=-10
3. Frame 60: x=700, y=100, rotation=10
4. Frame 90: x=700, y=400, rotation=0

Result: Spider crawls in a path with slight rotation
```

### Example 5: Pulsing Heart

```
Settings:
- Emoji: ❤️
- Duration: 40 frames
- Easing: easeInOut

Keyframes:
1. Frame 0:  x=400, y=300, scale=1.0
2. Frame 20: x=400, y=300, scale=1.3
3. Frame 40: x=400, y=300, scale=1.0

Result: Heart beats/pulses
```

### Example 6: Figure-8 Motion

```
Settings:
- Emoji: 🦋
- Duration: 120 frames
- Easing: linear

Keyframes:
1. Frame 0:   x=400, y=300
2. Frame 30:  x=500, y=200
3. Frame 60:  x=400, y=300
4. Frame 90:  x=300, y=400
5. Frame 120: x=400, y=300

Result: Butterfly flies in figure-8 pattern
```

## Pro Tips

### Smooth Loops
Make the first and last keyframe identical:
```
Frame 0:  x=400, y=300, rotation=0
Frame 60: x=400, y=300, rotation=0
```

### Complex Paths
Add more keyframes for detailed motion:
```
Frame 0:  x=100, y=100
Frame 15: x=200, y=150
Frame 30: x=300, y=100
Frame 45: x=400, y=150
Frame 60: x=500, y=100
```

### Combine Effects
Animate multiple properties at once:
```
Frame 0:  x=100, y=300, scale=0.5, opacity=0, rotation=0
Frame 60: x=700, y=300, scale=1.5, opacity=1, rotation=360
```

### Realistic Physics
Use `bounce` easing for gravity effects:
```
Easing: bounce
Frame 0:  y=100
Frame 60: y=500
```

### Smooth Motion
Use `easeInOut` for natural movement:
```
Easing: easeInOut
Frame 0:  x=100
Frame 60: x=700
```

## Canvas Coordinates

```
(0,0) ─────────────────── (800,0)
  │                           │
  │                           │
  │        (400,300)          │
  │         CENTER            │
  │                           │
  │                           │
(0,600) ─────────────────── (800,600)
```

**Common Positions:**
- Top-left: x=100, y=100
- Top-center: x=400, y=100
- Top-right: x=700, y=100
- Center: x=400, y=300
- Bottom-left: x=100, y=500
- Bottom-center: x=400, y=500
- Bottom-right: x=700, y=500

## Animation Ideas

### Simple Animations
- 🌟 Twinkling star (scale + opacity)
- 🌙 Moon rising (y position)
- ☀️ Sun rotating (rotation)
- 💫 Sparkle appearing (scale + opacity)

### Movement Animations
- 🚀 Rocket flying (x, y, rotation)
- 🐝 Bee buzzing (wavy path)
- 🎈 Balloon floating up (y + slight x drift)
- 🍂 Leaf falling (y + rotation)

### Complex Animations
- 🎪 Circus performer (circular motion)
- 🎢 Roller coaster (complex path)
- 🌊 Wave motion (sine wave path)
- 🎯 Target zoom (scale + rotation)

## Workflow

1. **Start Simple**: Begin with 2 keyframes
2. **Test**: Apply and see how it looks
3. **Refine**: Add more keyframes for detail
4. **Adjust Easing**: Try different easing functions
5. **Polish**: Fine-tune positions and timing

## Troubleshooting

**Object not visible?**
- Check x, y are within canvas (0-800, 0-600)
- Check opacity is not 0
- Check scale is not 0

**Motion too fast/slow?**
- Adjust duration (more frames = slower)
- Change easing function
- Adjust FPS in playback (top menu)

**Jerky motion?**
- Add more keyframes between start/end
- Use easeInOut instead of linear
- Increase frame count

**Object jumps?**
- Check keyframes are in order by frame number
- Make sure no duplicate frame numbers
- Verify all positions are set

## Advanced Techniques

### Circular Motion
```
Use trigonometry in your head:
Frame 0:   x=400+100*cos(0°),   y=300+100*sin(0°)
Frame 15:  x=400+100*cos(90°),  y=300+100*sin(90°)
Frame 30:  x=400+100*cos(180°), y=300+100*sin(180°)
Frame 45:  x=400+100*cos(270°), y=300+100*sin(270°)
Frame 60:  x=400+100*cos(360°), y=300+100*sin(360°)

Simplified:
Frame 0:   x=500, y=300
Frame 15:  x=400, y=400
Frame 30:  x=300, y=300
Frame 45:  x=400, y=200
Frame 60:  x=500, y=300
```

### Pendulum Swing
```
Frame 0:  x=300, y=200, rotation=-45
Frame 30: x=400, y=250, rotation=0
Frame 60: x=500, y=200, rotation=45
Frame 90: x=400, y=250, rotation=0
Frame 120: x=300, y=200, rotation=-45
```

### Fade In/Out Loop
```
Frame 0:  opacity=0
Frame 20: opacity=1
Frame 40: opacity=1
Frame 60: opacity=0
```

## Saving Your Work

Once you apply a custom animation:
1. It becomes part of your timeline
2. You can export it with **📥 Export**
3. The animation is saved in the HTML file
4. You can apply more animations on other frames

## Combining with Other Features

- **Layer with presets**: Apply custom animation, then add preset on another frame
- **Manual editing**: Use Select tool to adjust animated objects
- **Draw backgrounds**: Add drawings to frames with animations
- **Multiple objects**: Apply different custom animations at different positions

---

**Ready to create?** Click **✨ Animations** → **🎨 Custom** → **Open Custom Animation Builder**

Happy animating! 🎨✨
