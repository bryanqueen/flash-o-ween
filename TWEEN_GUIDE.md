# ⚡ Motion Tweening Guide (Adobe Flash Style)

## What is Tweening?

**Tweening** (short for "in-betweening") is the Adobe Flash way of creating animation:
1. You draw on Frame 1
2. You draw on Frame 10 (in a different position)
3. Flash automatically creates frames 2-9 for you!

This is **much more powerful** than preset animations because you control exactly what gets animated.

## How It Works

### The Flash-o-ween Way

```
Frame 1: Draw a circle on the left
         ⭕ (you draw this)

Frame 10: Draw the same circle on the right
                                    ⭕ (you draw this)

Click "Create Tween" →

Result: Frames 2-9 are automatically generated!
Frame 1:  ⭕
Frame 2:    ⭕
Frame 3:      ⭕
Frame 4:        ⭕
Frame 5:          ⭕
Frame 6:            ⭕
Frame 7:              ⭕
Frame 8:                ⭕
Frame 9:                  ⭕
Frame 10:                   ⭕
```

## Step-by-Step Tutorial

### Example 1: Moving a Circle

**Step 1: Draw on Frame 1**
```
1. Make sure you're on Frame 1 (check timeline)
2. Select Circle tool (⭕)
3. Draw a circle on the left side
4. Frame 1 now has content!
```

**Step 2: Draw on Frame 10**
```
1. Click on Frame 10 in the timeline
2. Draw the SAME circle on the right side
3. Frame 10 now has content!
```

**Step 3: Create the Tween**
```
1. Click the green "⚡ Create Tween" button
2. Set Start Frame: 1
3. Set End Frame: 10
4. Choose easing (try "Ease In-Out")
5. Click "Create Tween"
```

**Result:** Frames 2-9 are automatically filled with the circle moving smoothly from left to right!

### Example 2: Rotating a Star

**Frame 1:**
```
- Draw a star ⭐ in the center
- Don't rotate it (0°)
```

**Frame 20:**
```
- Draw the same star in the center
- Rotate it 180° (use Select tool and rotate handle)
```

**Create Tween (1 to 20):**
```
Result: Star spins smoothly!
```

### Example 3: Growing Heart

**Frame 1:**
```
- Draw a small heart ❤️
- Scale it down to 50%
```

**Frame 15:**
```
- Draw a large heart ❤️
- Scale it up to 200%
```

**Create Tween (1 to 15):**
```
Result: Heart grows smoothly!
```

## What Gets Tweened?

The system automatically interpolates:
- ✅ **Position** (x, y coordinates)
- ✅ **Rotation** (angle)
- ✅ **Scale** (size)
- ✅ **Opacity** (transparency)
- ✅ **Colors** (fill and stroke)
- ✅ **Size** (width, height, radius)

## Easing Options

### Linear
```
────────────
Constant speed throughout
```

### Ease In
```
╰────────────
Slow start, fast end
Good for: Objects accelerating
```

### Ease Out
```
────────────╮
Fast start, slow end
Good for: Objects decelerating
```

### Ease In-Out
```
╰──────────╮
Slow start and end, fast middle
Good for: Natural motion (RECOMMENDED)
```

### Bounce
```
╰─╮╰╮╰╮─────
Bouncing effect
Good for: Balls, springs
```

### Elastic
```
╰─╮╭╮───────
Spring overshoot
Good for: Playful animations
```

## Pro Tips

### Tip 1: Match Object Count
```
Frame 1: Draw 3 circles
Frame 10: Draw 3 circles (in new positions)
→ All 3 will tween!
```

### Tip 2: Complex Paths
```
Frame 1:  Circle at (100, 300)
Frame 5:  Circle at (300, 100)
Frame 10: Circle at (500, 300)
Frame 15: Circle at (700, 100)

Create multiple tweens:
- Tween 1→5
- Tween 5→10
- Tween 10→15

Result: Wavy path!
```

### Tip 3: Combine with Manual Drawing
```
Frame 1-10: Tween a moving circle
Frame 11-20: Manually draw explosion frames
Result: Circle moves then explodes!
```

### Tip 4: Multiple Objects
```
Frame 1:
- Ghost on left
- Bat on right

Frame 20:
- Ghost on right
- Bat on left

Tween 1→20: They swap positions!
```

## Common Workflows

### Workflow 1: Simple Movement
```
1. Draw object on Frame 1
2. Move to Frame 10
3. Draw object in new position
4. Create Tween (1→10)
5. Done!
```

### Workflow 2: Complex Animation
```
1. Draw on Frame 1
2. Draw on Frame 5 (different position)
3. Tween 1→5
4. Draw on Frame 10 (another position)
5. Tween 5→10
6. Draw on Frame 15 (final position)
7. Tween 10→15
8. Result: Multi-segment animation!
```

### Workflow 3: Loop Animation
```
1. Draw on Frame 1
2. Draw on Frame 30 (different state)
3. Tween 1→30
4. Copy Frame 1 to Frame 60
5. Tween 30→60
6. Result: Smooth loop!
```

## Troubleshooting

### "Both frames must have content"
```
Problem: You didn't draw on both frames
Solution: Make sure BOTH start and end frames have drawings
```

### Objects don't match up
```
Problem: Different number of objects on each frame
Solution: Draw the same number of objects on both frames
```

### Motion looks jerky
```
Problem: Too few in-between frames
Solution: Use more frames (e.g., 1→30 instead of 1→10)
```

### Object jumps instead of moving smoothly
```
Problem: Using "Linear" easing
Solution: Try "Ease In-Out" for smoother motion
```

## Comparison: Tweening vs Presets

### Tweening (⚡ Create Tween)
- ✅ You draw whatever you want
- ✅ Full control over start and end
- ✅ Works with ANY object (circles, rectangles, drawings, text)
- ✅ Adobe Flash style
- ❌ Requires drawing on 2+ frames

### Presets (✨ Presets)
- ✅ One-click animations
- ✅ Pre-made effects (ghost, bat, etc.)
- ✅ No drawing required
- ❌ Limited to preset objects
- ❌ Less control

**Use Tweening when:** You want full creative control
**Use Presets when:** You want quick, pre-made effects

## Advanced Techniques

### Technique 1: Fade In/Out
```
Frame 1: Draw object, set opacity to 0%
Frame 10: Same object, set opacity to 100%
Tween: Object fades in!
```

### Technique 2: Color Change
```
Frame 1: Draw red circle
Frame 10: Draw blue circle (same position)
Tween: Circle changes from red to blue!
```

### Technique 3: Morphing
```
Frame 1: Draw small circle
Frame 10: Draw large square (same center)
Tween: Shape morphs!
```

### Technique 4: Path Following
```
Create keyframes at:
Frame 1, 5, 10, 15, 20, 25, 30
Draw object at different positions
Tween each segment
Result: Object follows complex path!
```

## Real-World Examples

### Example: Bouncing Ball
```
Frame 1:  Ball at top (y=100)
Frame 10: Ball at bottom (y=500), scale=1.2 (squashed)
Frame 20: Ball at top (y=100), scale=1.0
Easing: Bounce
Result: Realistic bouncing!
```

### Example: Flying Bird
```
Frame 1:  Bird on left, rotated -10°
Frame 15: Bird in center, rotated 0°
Frame 30: Bird on right, rotated 10°
Easing: Ease In-Out
Result: Bird flies across with tilt!
```

### Example: Pulsing Heart
```
Frame 1:  Heart, scale=1.0
Frame 10: Heart, scale=1.3
Frame 20: Heart, scale=1.0
Easing: Ease In-Out
Result: Heart beats!
```

## Quick Reference

| Action | Steps |
|--------|-------|
| Create tween | Draw on 2 frames → Click ⚡ Create Tween |
| Change easing | In tween dialog, select different easing |
| Multiple tweens | Create tween for each segment separately |
| Loop animation | Make first and last frames identical |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate frames |
| `Ctrl+Z` | Undo |
| `V` | Select tool (for moving objects) |
| `B` | Brush tool (for drawing) |

---

**Ready to animate?** 
1. Draw on Frame 1
2. Draw on Frame 10
3. Click **⚡ Create Tween**

That's the Adobe Flash way! 🎬
