# 🎃 Flash-o-ween Quick Reference

## 🎬 Animation Presets

| Animation | Emoji | Duration | Effect |
|-----------|-------|----------|--------|
| Bouncing Ball | ⚽ | 60 frames | Bounces up/down with squash |
| Ghost Floating | 👻 | 90 frames | Floats smoothly with fade |
| Pumpkin Smiling | 🎃 | 60 frames | Pulses and wobbles |
| Bat Flying | 🦇 | 120 frames | Flies across screen |
| Text Animation | 📝 | Variable | Letter-by-letter reveal |

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Delete` / `Backspace` | Delete selected |
| `V` | Select tool |
| `B` | Brush tool |
| `E` | Eraser tool |
| `R` | Rectangle tool |
| `C` | Circle tool |
| `F` | Fill tool |

## 🎨 Tools

| Icon | Tool | Description |
|------|------|-------------|
| ↖️ | Select | Move and resize objects |
| 🖌️ | Brush | Freehand drawing |
| 🧹 | Eraser | Remove content |
| ⬜ | Rectangle | Draw rectangles |
| ⭕ | Circle | Draw circles |
| 🪣 | Fill | Fill background |

## 🎃 Halloween Sprites

| Emoji | Name | Use Case |
|-------|------|----------|
| 🎃 | Pumpkin | Jack-o'-lanterns |
| 👻 | Ghost | Spooky spirits |
| 🦇 | Bat | Flying creatures |
| 🕷️ | Spider | Creepy crawlies |
| 💀 | Skull | Skeleton decorations |
| 🕸️ | Web | Spider webs |
| 🧙 | Witch | Magic users |
| 🧛 | Vampire | Blood suckers |

## 🎬 Using Animations

### Apply Preset
1. Click **✨ Animations**
2. Select preset
3. Done!

### Text Animation
1. Click **✨ Animations**
2. Go to **Text Animation** tab
3. Enter text
4. Customize
5. Click **Apply**

### Combine Animations
1. Apply first animation at frame 0
2. Move to frame 60
3. Apply second animation
4. Result: Sequential animations!

## 📊 Playback Controls

| Button | Action |
|--------|--------|
| ▶️ Play | Start animation |
| ⏸️ Pause | Pause animation |
| ⏹️ Stop | Stop and reset |
| FPS | Adjust speed (1-120) |

## 📥 Export

1. Click **📥 Export**
2. Configure settings:
   - Frame rate
   - Loop
   - Autoplay
   - Controls
   - Background color
3. Click **Export Animation**
4. Save HTML file

## 🎯 Pro Tips

### Smooth Loops
- Make first and last frames identical
- Use loop-friendly animations

### Speed Control
- Low FPS (6-12): Choppy, retro feel
- Medium FPS (24-30): Smooth, cinematic
- High FPS (60+): Ultra smooth

### Layering
- Apply animation first
- Add manual details after
- Combine multiple animations

### Performance
- Keep animations under 120 frames
- Use thumbnails to preview
- Export for final playback

## 🔧 Configuration

### Animation Settings
```typescript
{
  frameRate: 30,        // FPS
  loop: true,           // Repeat
  autoplay: true,       // Start on load
  showControls: true,   // Show UI
  playbackSpeed: 1.0,   // Speed multiplier
  backgroundColor: '#1a1a1a'
}
```

### Text Animation
```typescript
{
  text: 'BOO!',
  letterDelay: 8,       // Frames between letters
  fontSize: 120,        // Size in pixels
  color: '#ff6b00',     // Hex color
  x: 250,               // X position
  y: 250                // Y position
}
```

## 📁 File Locations

| File | Purpose |
|------|---------|
| `ANIMATION_GUIDE.md` | User guide |
| `lib/animation/README.md` | Technical docs |
| `lib/animation/QUICKSTART.md` | Developer guide |
| `lib/animation/EXAMPLES.md` | Visual examples |
| `lib/animation/ARCHITECTURE.md` | System design |

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Animation not appearing | Check current frame, wait for "Applying..." to finish |
| Choppy playback | Increase FPS |
| Can't see objects | Check opacity, scale, position |
| Export not working | Save current frame first |
| Performance slow | Reduce frame count, simplify animations |

## 📚 Documentation

- **User Guide**: `ANIMATION_GUIDE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **Quick Start**: `lib/animation/QUICKSTART.md`
- **Examples**: `lib/animation/EXAMPLES.md`
- **Architecture**: `lib/animation/ARCHITECTURE.md`

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000

# Start animating!
```

## 🎃 Example Workflow

1. **Open app** → See canvas and tools
2. **Click ✨ Animations** → Open preset panel
3. **Select "Ghost Floating"** → Animation applies
4. **Press ▶️ Play** → Preview animation
5. **Add more frames** → Click ➕ Add
6. **Apply "BOO!" text** → Text animation
7. **Click 📥 Export** → Save as HTML
8. **Share your creation!** 🎉

---

**Need help?** Check the full guides:
- User: `ANIMATION_GUIDE.md`
- Developer: `lib/animation/QUICKSTART.md`

Happy animating! 🎃👻🦇
