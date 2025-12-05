'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimationPreset } from '../types';
import { AnimationGenerator } from '../generator';
import { interpolate } from '../easing';

interface AnimationPreviewProps {
  preset: AnimationPreset;
  size?: number;
}

/**
 * Mini preview component that shows animation in real-time
 */
export function AnimationPreview({ preset, size = 100 }: AnimationPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate frames
    const generator = new AnimationGenerator();
    const frames = generator.generateFromPreset(preset);

    // Animation loop
    let animationId: number;
    let lastTime = 0;
    const fps = 30;
    const frameDuration = 1000 / fps;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameDuration) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Get current frame data
        const frame = frames[currentFrame % frames.length];
        
        if (frame.objects.length > 0) {
          const obj = frame.objects[0];
          
          // Scale coordinates to fit preview
          const scale = size / 800; // Assuming original canvas is 800x600
          const x = obj.x * scale;
          const y = obj.y * scale;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((obj.rotation || 0) * Math.PI / 180);
          ctx.scale(obj.scale || 1, obj.scale || 1);
          ctx.globalAlpha = obj.opacity ?? 1;
          
          // Draw emoji
          ctx.font = `${obj.fontSize * scale}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = obj.color || '#ffffff';
          ctx.fillText(obj.content, 0, 0);
          
          ctx.restore();
        }

        setCurrentFrame(prev => (prev + 1) % frames.length);
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [preset, currentFrame, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size * 0.75}
      className="rounded border border-[#3a3a3a]"
    />
  );
}
