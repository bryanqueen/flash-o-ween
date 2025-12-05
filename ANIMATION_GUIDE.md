# 🎃 Flash-o-ween Animation Guide

## Overview

Your Flash-o-ween app now supports **5 amazing Halloween animations** that can be applied with a single click!

## ✨ Available Animations

### 1. ⚽ Bouncing Ball
- A ball that bounces up and down with realistic physics
- **Duration**: 60 frames
- **Effect**: Squashes on impact, smooth bounce motion
- **Use case**: Perfect for adding dynamic movement

### 2. 👻 Ghost Floating
- A ghost that floats smoothly up and down
- **Duration**: 90 frames
- **Effect**: Gentle floating with opacity changes and slight rotation
- **Use case**: Spooky ethereal atmosphere

### 3. 🎃 Pumpkin Smiling
- A pumpkin that grows and pulses
- **Duration**: 60 frames
- **Effect**: Scale changes with rotation for a "breathing" effect
- **Use case**: Happy, welcoming Halloween vibe

### 4. 🦇 Bat Flying
- A bat that flies across the screen
- **Duration**: 120 frames
- **Effect**: Smooth flight path with wing flapping simulation
- **Use case**: Dynamic scene transitions

### 5. 📝 Text Animation - "BOO!"
- Letter-by-letter text reveal
- **Customizable**: Text, color, size
- **Effect**: Each letter bounces in with a pop effect
- **Use case**: Title cards, jump scares, messages

## 🎬 How to Use

### Step 1: Open Animation Panel
Click the **✨ Animations** button in the top menu bar (purple button next to Export)

### Step 2: Choose Your Animation

**Option A: Pre-built Animations**
1. Stay on the "Animation Presets" tab
2. Click any animation card (Bouncing Ball, Ghost, Pumpkin, or Bat)
3. Animation will be applied starting from your current frame

**Option B: Custom Text Animation**
1. Switch to the "Text Animation" tab
2. Enter your text (default: "BOO!")
3. Adjust font size (40-200px)
4. Pick a color
5. Click "Apply Text Animation"

### Step 3: Preview & Edit
- Use the timeline to scrub through frames
- Press **▶️ Play** to see the animation in action
- Adjust FPS for speed control
- You can still draw on frames or add more sprites!

### Step 4: Export
Click **📥 Export** to save your animation as a standalone HTML file

## 🎨 Pro Tips

### Combining Animations
1. Apply first animation at frame 0
2. Move to frame 60
3. Apply second animation
4. Result: Sequential animations!

### Layering Effects
- Apply an animation preset
- Switch to manual drawing mode
- Add backgrounds, effects, or details to individual frames
- The animation objects remain editable

### Creating Loops
- Set your FPS to match the animation duration
- For 60-frame animation at 12 FPS = 5 seconds
- Enable loop in export settings for seamless playback

### Custom Timing
- Apply animation starting at any frame
- Use the timeline to delete unwanted frames
- Duplicate frames for slow-motion effects

## 🔧 Technical Details

### Animation System Features
- **Keyframe interpolation**: Smooth motion between defined points
- **Easing functions**: Linear, easeIn, easeOut, easeInOut, bounce, elastic
- **Property animation**: Position (x, y), rotation, scale, opacity
- **Non-destructive**: Animations layer on top of existing content

### Performance
- Animations are pre-rendered to frames
- No runtime performance impact
- Export includes all animation data
- Typical animation: 60-120 frames

### File Structure
```
lib/animation/
├── components/
│   └── AnimationPresetPanel.tsx  # UI component
├── types.ts                       # TypeScript definitions
├── presets.ts                     # Built-in animations
├── easing.ts                      # Easing functions
├── generator.ts                   # Frame generation
├── renderer.ts                    # Canvas rendering
└── index.ts                       # Public API
```

## 🎃 Example Workflow

**Creating a Halloween Scene:**

1. **Frame 0-60**: Apply "Ghost Floating"
2. **Frame 60-120**: Apply "Bat Flying"
3. **Frame 120-180**: Apply "Pumpkin Smiling"
4. **Frame 180-220**: Apply "BOO!" text animation
5. **Manual touches**: Add background, moon, stars
6. **Export**: 220 frames at 12 FPS = 18 seconds of spooky fun!

## 🐛 Troubleshooting

**Animation not appearing?**
- Make sure you're on the correct frame
- Check that the animation panel closed (means it applied)
- Look for the "Applying..." state in the button

**Animation looks choppy?**
- Increase FPS in playback controls
- Check that all frames loaded (thumbnails visible)

**Want to modify an animation?**
- Animations become regular canvas objects
- Use Select tool (↖️) to move/resize/rotate
- Edit individual frames for custom tweaks

## 🚀 Next Steps

Want to create your own animations? Check out `lib/animation/presets.ts` to see how the built-in animations are defined. You can add custom keyframes, adjust timing, and create entirely new effects!

Happy animating! 🎃👻🦇
