# 🎃 Flash-o-ween

A Halloween-themed frame-by-frame animation tool with built-in animation presets! Create spooky animations with bouncing balls, floating ghosts, smiling pumpkins, flying bats, and animated text.

## ✨ Features

- **Frame-by-frame drawing** with multiple tools (brush, eraser, shapes)
- **5 Built-in Halloween animations**:
  - ⚽ Bouncing Ball
  - 👻 Ghost Floating
  - 🎃 Pumpkin Smiling
  - 🦇 Bat Flying
  - 📝 Text Animation ("BOO!" and more)
- **🎨 Custom Animation Builder** - Create your own animations with:
  - Keyframe editor with full control
  - 6 easing functions (linear, easeIn, easeOut, easeInOut, bounce, elastic)
  - Animate position, rotation, scale, and opacity
  - Use any emoji or character
- **Animation preset system** with keyframe interpolation
- **Export to HTML** with standalone playback
- **Timeline editor** with frame management
- **Sprite library** with Halloween emojis
- **Undo/Redo** support
- **Playback controls** with adjustable FPS

## 🚀 Quick Start

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎬 Two Ways to Animate

### ⚡ Motion Tweening (Adobe Flash Style) - RECOMMENDED
1. Draw your object on Frame 1
2. Move to Frame 10 and draw it in a new position
3. Click **⚡ Create Tween** button
4. System automatically generates frames 2-9!
5. Works with ANY drawing (circles, rectangles, text, etc.)

See [TWEEN_GUIDE.md](./TWEEN_GUIDE.md) for the full tutorial.

### ✨ Animation Presets (Quick Effects)
1. Click **✨ Presets** button
2. Choose pre-made animation (Ghost, Bat, Pumpkin, etc.)
3. Animation applies instantly
4. Good for quick effects

See [ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md) for preset details.

## 🛠️ Tools

- **Select** (V) - Move and resize objects
- **Brush** (B) - Freehand drawing
- **Eraser** (E) - Remove content
- **Rectangle** (R) - Draw rectangles
- **Circle** (C) - Draw circles
- **Fill** (F) - Fill background

## 📚 Documentation

- [Tween Guide](./TWEEN_GUIDE.md) - Motion tweening tutorial (Adobe Flash style)
- [Tween Troubleshooting](./TWEEN_TROUBLESHOOTING.md) - Common issues and solutions
- [Animation Systems Explained](./ANIMATION_SYSTEMS_EXPLAINED.md) - Understand both systems
- [Animation Guide](./ANIMATION_GUIDE.md) - Preset animations guide
- [Animation System](./lib/animation/README.md) - Technical documentation

## 🏗️ Project Structure

```
flash-o-ween/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main animation editor
│   └── layout.tsx         # App layout
├── lib/
│   ├── animation/         # Animation preset system
│   │   ├── components/    # UI components
│   │   ├── types.ts       # TypeScript definitions
│   │   ├── presets.ts     # Built-in animations
│   │   ├── generator.ts   # Frame generation
│   │   ├── renderer.ts    # Canvas rendering
│   │   └── easing.ts      # Easing functions
│   └── export/            # HTML export system
│       ├── components/    # Export UI
│       ├── export-orchestrator.ts
│       ├── frame-processor.ts
│       └── html-generator.ts
└── public/                # Static assets
```

## 🧪 Testing

```bash
npm test
```

Run specific test suite:
```bash
npm test lib/animation/__tests__/animation-system.test.ts
```

## 🎨 Creating Custom Animations

```typescript
import { AnimationPreset } from '@/lib/animation/types';

const myAnimation: AnimationPreset = {
  id: 'my-animation',
  name: 'My Animation',
  description: 'Custom animation',
  emoji: '🎨',
  duration: 60,
  easing: 'easeInOut',
  keyframes: [
    { frame: 0, x: 100, y: 100, scale: 1 },
    { frame: 30, x: 200, y: 200, scale: 1.5 },
    { frame: 60, x: 100, y: 100, scale: 1 }
  ]
};
```

Add your preset to `lib/animation/presets.ts` to make it available in the UI.

## 🔧 Tech Stack

- **Next.js 16** - React framework
- **Fabric.js** - Canvas manipulation
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vitest** - Testing

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Fabric.js Documentation](http://fabricjs.com/docs/)
- [Animation System Guide](./lib/animation/README.md)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
