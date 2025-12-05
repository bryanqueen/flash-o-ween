'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, Rect, Circle, FabricText, PencilBrush } from 'fabric';
import { ExportPanel, Frame as ExportFrame } from '@/lib/export';
import { AnimationPresetPanel } from '@/lib/animation/components/AnimationPresetPanel';
import { TweenPanel } from '@/lib/animation/components/TweenPanel';
import { AnimationGenerator } from '@/lib/animation/generator';
import { AnimationRenderer } from '@/lib/animation/renderer';
import { TweenGenerator } from '@/lib/animation/tween-generator';
import { AnimationPreset, TextAnimationConfig, EasingFunction } from '@/lib/animation/types';

type Tool = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'fill' | 'select';

interface Frame {
  id: number;
  thumbnail: string;
  data: string;
}

export default function FlashOWeen() {
  const [selectedTool, setSelectedTool] = useState<Tool>('brush');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [fps, setFps] = useState(12);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#ff6b00');
  const [frames, setFrames] = useState<Frame[]>(
    Array.from({ length: 10 }, (_, i) => ({ id: i, thumbnail: '', data: '' }))
  );
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  const [isAnimationPanelOpen, setIsAnimationPanelOpen] = useState(false);
  const [isTweenPanelOpen, setIsTweenPanelOpen] = useState(false);
  const [isApplyingAnimation, setIsApplyingAnimation] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyStepRef = useRef(0);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#1a1a1a',
      });
      
      fabricCanvasRef.current = canvas;
      
      // Initialize brush
      const brush = new PencilBrush(canvas);
      brush.color = brushColor;
      brush.width = brushSize;
      canvas.freeDrawingBrush = brush;
      
      // Set initial drawing mode
      canvas.isDrawingMode = true;

      // Save initial state
      saveHistory();

      // Handle object modifications for undo/redo
      let isLoadingFromHistory = false;
      
      canvas.on('object:added', () => {
        if (!isLoadingFromHistory) {
          saveHistory();
        }
      });
      canvas.on('object:modified', () => {
        if (!isLoadingFromHistory) {
          saveHistory();
        }
      });
      canvas.on('object:removed', () => {
        if (!isLoadingFromHistory) {
          saveHistory();
        }
      });
      canvas.on('path:created', () => {
        if (!isLoadingFromHistory) {
          saveHistory();
        }
      });

      // Store flag in canvas for history loading
      (canvas as any).isLoadingFromHistory = () => isLoadingFromHistory;
      (canvas as any).setLoadingFromHistory = (val: boolean) => { isLoadingFromHistory = val; };
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Update tool
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    switch (selectedTool) {
      case 'select':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case 'brush':
        canvas.isDrawingMode = true;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = brushColor;
          canvas.freeDrawingBrush.width = brushSize;
        }
        break;
      case 'eraser':
        canvas.isDrawingMode = true;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = '#1a1a1a';
          canvas.freeDrawingBrush.width = brushSize * 2;
        }
        break;
      case 'fill':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'pointer';
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
    }
    canvas.renderAll();
  }, [selectedTool, brushColor, brushSize]);

  // Update brush properties
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Reinitialize brush with new properties
    if (selectedTool === 'brush' || selectedTool === 'eraser') {
      const brush = new PencilBrush(canvas);
      brush.color = selectedTool === 'brush' ? brushColor : '#1a1a1a';
      brush.width = selectedTool === 'brush' ? brushSize : brushSize * 2;
      canvas.freeDrawingBrush = brush;
    }
  }, [brushColor, brushSize, selectedTool]);

  const saveHistory = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const json = JSON.stringify(canvas.toJSON());
    historyRef.current = historyRef.current.slice(0, historyStepRef.current + 1);
    historyRef.current.push(json);
    historyStepRef.current = historyRef.current.length - 1;
  };

  const undo = () => {
    if (historyStepRef.current > 0) {
      historyStepRef.current--;
      loadFromHistory();
    }
  };

  const redo = () => {
    if (historyStepRef.current < historyRef.current.length - 1) {
      historyStepRef.current++;
      loadFromHistory();
    }
  };

  const loadFromHistory = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const json = historyRef.current[historyStepRef.current];
    
    // Set flag to prevent saving during load
    if ((canvas as any).setLoadingFromHistory) {
      (canvas as any).setLoadingFromHistory(true);
    }
    
    canvas.loadFromJSON(json).then(() => {
      canvas.renderAll();
      if ((canvas as any).setLoadingFromHistory) {
        (canvas as any).setLoadingFromHistory(false);
      }
    });
  };

  const clearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    objects.forEach(obj => canvas.remove(obj));
    canvas.backgroundColor = '#1a1a1a';
    canvas.renderAll();
  };

  const handleMouseDown = (e: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || selectedTool === 'select' || selectedTool === 'brush' || selectedTool === 'eraser') return;

    const pointer = canvas.getPointer(e.e);
    const startX = pointer.x;
    const startY = pointer.y;

    if (selectedTool === 'fill') {
      // Simple fill: change background color
      canvas.backgroundColor = brushColor;
      canvas.renderAll();
      return;
    }

    if (selectedTool === 'rectangle') {
      const rect = new Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: brushColor,
        strokeWidth: brushSize,
        selectable: false,
      });
      canvas.add(rect);

      const onMouseMove = (e: any) => {
        const pointer = canvas.getPointer(e.e);
        rect.set({
          width: Math.abs(pointer.x - startX),
          height: Math.abs(pointer.y - startY),
          left: Math.min(startX, pointer.x),
          top: Math.min(startY, pointer.y),
        });
        canvas.renderAll();
      };

      const onMouseUp = () => {
        canvas.off('mouse:move', onMouseMove);
        canvas.off('mouse:up', onMouseUp);
        rect.set({ selectable: true });
        canvas.renderAll();
      };

      canvas.on('mouse:move', onMouseMove);
      canvas.on('mouse:up', onMouseUp);
    } else if (selectedTool === 'circle') {
      const circle = new Circle({
        left: startX,
        top: startY,
        radius: 0,
        fill: 'transparent',
        stroke: brushColor,
        strokeWidth: brushSize,
        originX: 'center',
        originY: 'center',
        selectable: false,
      });
      canvas.add(circle);

      const onMouseMove = (e: any) => {
        const pointer = canvas.getPointer(e.e);
        const radius = Math.sqrt(Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2));
        circle.set({ radius });
        canvas.renderAll();
      };

      const onMouseUp = () => {
        canvas.off('mouse:move', onMouseMove);
        canvas.off('mouse:up', onMouseUp);
        circle.set({ selectable: true });
        canvas.renderAll();
      };

      canvas.on('mouse:move', onMouseMove);
      canvas.on('mouse:up', onMouseUp);
    }
  };

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const handler = (e: any) => handleMouseDown(e);
    canvas.on('mouse:down', handler);
    return () => {
      canvas.off('mouse:down', handler);
    };
  }, [selectedTool, brushColor, brushSize]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }, 1000 / fps);
      return () => clearInterval(interval);
    }
  }, [isPlaying, fps, frames.length]);

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keys when typing in input fields
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const previousFrameRef = useRef(0);

  // Save current frame data
  const saveCurrentFrame = (frameIndex: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const json = JSON.stringify(canvas.toJSON());
    const thumbnail = canvas.toDataURL({ format: 'png', quality: 0.3, multiplier: 0.1 });
    
    setFrames(prev => {
      const newFrames = [...prev];
      if (newFrames[frameIndex]) {
        newFrames[frameIndex] = {
          ...newFrames[frameIndex],
          data: json,
          thumbnail: thumbnail,
        };
      }
      return newFrames;
    });
  };

  // Load frame data when switching frames
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Save previous frame before switching
    if (previousFrameRef.current !== currentFrame) {
      saveCurrentFrame(previousFrameRef.current);
    }

    // Load new frame
    const frameData = frames[currentFrame]?.data;
    if (frameData) {
      if ((canvas as any).setLoadingFromHistory) {
        (canvas as any).setLoadingFromHistory(true);
      }
      
      canvas.loadFromJSON(frameData).then(() => {
        canvas.renderAll();
        if ((canvas as any).setLoadingFromHistory) {
          (canvas as any).setLoadingFromHistory(false);
        }
      });
    } else {
      // Clear canvas for empty frame
      if ((canvas as any).setLoadingFromHistory) {
        (canvas as any).setLoadingFromHistory(true);
      }
      canvas.clear();
      canvas.backgroundColor = '#1a1a1a';
      canvas.renderAll();
      if ((canvas as any).setLoadingFromHistory) {
        (canvas as any).setLoadingFromHistory(false);
      }
    }

    previousFrameRef.current = currentFrame;
  }, [currentFrame, frames]);

  const addFrame = () => {
    setFrames(prev => [...prev, { id: prev.length, thumbnail: '', data: '' }]);
  };

  const deleteFrame = () => {
    if (frames.length <= 1) return; // Keep at least one frame
    
    setFrames(prev => {
      const newFrames = prev.filter((_, index) => index !== currentFrame);
      return newFrames;
    });
    
    // Adjust current frame if needed
    if (currentFrame >= frames.length - 1) {
      setCurrentFrame(Math.max(0, frames.length - 2));
    }
  };

  const addSpriteToCanvas = (emoji: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = new FabricText(emoji, {
      left: 400,
      top: 300,
      fontSize: 80,
      selectable: true,
      hasControls: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const halloweenSprites = [
    { name: '🎃 Pumpkin', emoji: '🎃' },
    { name: '👻 Ghost', emoji: '👻' },
    { name: '🦇 Bat', emoji: '🦇' },
    { name: '🕷️ Spider', emoji: '🕷️' },
    { name: '💀 Skull', emoji: '💀' },
    { name: '🕸️ Web', emoji: '🕸️' },
    { name: '🧙 Witch', emoji: '🧙' },
    { name: '🧛 Vampire', emoji: '🧛' },
  ];

  // Convert frames to export format
  // Note: This function is passed to ExportPanel which only calls it when needed
  const convertFramesToExportFormat = async (): Promise<ExportFrame[]> => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return [];

    // Save current frame before converting
    saveCurrentFrame(currentFrame);

    const exportFrames: ExportFrame[] = [];

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      
      // Skip empty frames
      if (!frame.data) continue;

      // Create a temporary canvas to render the frame
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      const tempFabricCanvas = new Canvas(tempCanvas, {
        width: canvas.width,
        height: canvas.height,
      });

      try {
        // Load the frame data into the temporary canvas
        await tempFabricCanvas.loadFromJSON(frame.data);
        
        // Ensure background color is set
        if (!tempFabricCanvas.backgroundColor) {
          tempFabricCanvas.backgroundColor = '#1a1a1a';
        }
        
        // Force a render and wait for it to complete
        tempFabricCanvas.renderAll();
        
        // Give the canvas time to actually render (minimal delay)
        await new Promise(resolve => setTimeout(resolve, 1));

        // Convert to data URL immediately before disposing
        const dataUrl = tempCanvas.toDataURL('image/png');

        exportFrames.push({
          data: dataUrl,
          width: canvas.width,
          height: canvas.height,
          index: i,
        });
      } finally {
        // Clean up temporary canvas
        tempFabricCanvas.dispose();
      }

      // Yield to event loop to keep UI responsive
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    return exportFrames;
  };

  const handleExportClick = () => {
    // Save current frame before opening export panel
    saveCurrentFrame(currentFrame);
    setIsExportPanelOpen(true);
  };

  const handleApplyPreset = async (preset: AnimationPreset) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isApplyingAnimation) return;
    
    setIsApplyingAnimation(true);
    
    try {
      // Save current frame
      saveCurrentFrame(currentFrame);
      
      // Generate animation frames
      const generator = new AnimationGenerator();
      const generatedFrames = generator.generateFromPreset(preset);
      
      // Apply to canvas
      const renderer = new AnimationRenderer();
      const updatedFrames = await renderer.applyToCanvas(
        canvas,
        generatedFrames,
        currentFrame,
        frames
      );
      
      setFrames(updatedFrames);
      
      // Move to first frame of animation
      setCurrentFrame(currentFrame);
    } catch (error) {
      console.error('Failed to apply animation preset:', error);
      alert('Failed to apply animation. Please try again.');
    } finally {
      setIsApplyingAnimation(false);
    }
  };

  const handleApplyTextAnimation = async (config: TextAnimationConfig) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isApplyingAnimation) return;
    
    setIsApplyingAnimation(true);
    
    try {
      // Save current frame
      saveCurrentFrame(currentFrame);
      
      // Generate text animation frames
      const generator = new AnimationGenerator();
      const generatedFrames = generator.generateTextAnimation(config);
      
      // Apply to canvas
      const renderer = new AnimationRenderer();
      const updatedFrames = await renderer.applyToCanvas(
        canvas,
        generatedFrames,
        currentFrame,
        frames
      );
      
      setFrames(updatedFrames);
      
      // Move to first frame of animation
      setCurrentFrame(currentFrame);
    } catch (error) {
      console.error('Failed to apply text animation:', error);
      alert('Failed to apply text animation. Please try again.');
    } finally {
      setIsApplyingAnimation(false);
    }
  };

  const handleCreateTween = async (startFrame: number, endFrame: number, easing: EasingFunction) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isApplyingAnimation) return;

    // Save current frame first to ensure it's up to date
    saveCurrentFrame(currentFrame);

    // Wait a bit for state to update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if both frames have data and actual content
    const startFrameData = frames[startFrame]?.data;
    const endFrameData = frames[endFrame]?.data;

    if (!startFrameData || !endFrameData || startFrameData === '' || endFrameData === '') {
      alert(`Both start and end frames must have content. Draw on both frames first!\n\nStart frame ${startFrame}: ${startFrameData ? 'Has data' : 'Empty'}\nEnd frame ${endFrame}: ${endFrameData ? 'Has data' : 'Empty'}`);
      return;
    }

    // Check if frames have actual objects (not just empty canvas)
    try {
      const startJSON = JSON.parse(startFrameData);
      const endJSON = JSON.parse(endFrameData);
      
      if (!startJSON.objects || startJSON.objects.length === 0) {
        alert(`Start frame ${startFrame} is empty. Draw something on it first!`);
        return;
      }
      
      if (!endJSON.objects || endJSON.objects.length === 0) {
        alert(`End frame ${endFrame} is empty. Draw something on it first!`);
        return;
      }
    } catch (e) {
      alert('Error reading frame data. Please try drawing on both frames again.');
      return;
    }

    setIsApplyingAnimation(true);

    try {
      // Create tween
      const tweenGenerator = new TweenGenerator();
      const tweenedFrames = await tweenGenerator.createTween(
        startFrameData,
        endFrameData,
        startFrame,
        endFrame,
        easing,
        canvas.width,
        canvas.height
      );

      // Update frames
      setFrames(prev => {
        const updatedFrames = [...prev];
        for (const tweenFrame of tweenedFrames) {
          updatedFrames[tweenFrame.frameIndex] = {
            id: tweenFrame.frameIndex,
            data: tweenFrame.data,
            thumbnail: tweenFrame.thumbnail
          };
        }
        return updatedFrames;
      });

      alert(`✅ Created ${tweenedFrames.length} in-between frames!`);
    } catch (error) {
      console.error('Failed to create tween:', error);
      alert(`Failed to create tween: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsApplyingAnimation(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d]">
      {/* Top Menu Bar */}
      <div className=" bg-[#1a1a1a] border-b border-[#3a3a3a] flex items-center px-4 gap-6">
        <div className="flex items-center gap-3">
          <img 
            src="/flash-o-ween_logo.png" 
            alt="Flash-o-ween Logo" 
            className="w-20 h-22 object-contain"
          />
          <h1 className="text-3xl font-black italic text-[#ff6b00] tracking-wide" style={{
            textShadow: '0 0 10px rgba(255, 107, 0, 0.5), 0 0 20px rgba(255, 107, 0, 0.3)',
            background: 'linear-gradient(to bottom, #ff8533, #ff6b00, #ff4500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Flash-o-ween
          </h1>
        </div>
        
        {/* Edit Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-sm transition-colors"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            onClick={redo}
            className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-sm transition-colors"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
          <button
            onClick={clearCanvas}
            className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-sm transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-sm transition-colors"
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button
            onClick={() => { setIsPlaying(false); setCurrentFrame(0); }}
            className="px-4 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-sm transition-colors"
          >
            ⏹️ Stop
          </button>
          
          <div className="flex items-center gap-2 ml-4">
            <label className="text-sm text-gray-400">FPS:</label>
            <input
              type="number"
              min="1"
              max="120"
              value={fps}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= 120) {
                  setFps(value);
                }
              }}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-sm w-16 text-center"
            />
          </div>

          {/* Create Tween Button (Flash-style) */}
          <button
            onClick={() => setIsTweenPanelOpen(true)}
            disabled={isApplyingAnimation}
            className="px-4 py-1 bg-[#10b981] hover:bg-[#0ea472] border border-[#10b981] rounded text-sm transition-colors shadow-lg shadow-green-500/30 ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Create motion tween between frames"
          >
            {isApplyingAnimation ? '⏳ Creating...' : '⚡ Create Tween'}
          </button>

          {/* Animation Presets Button */}
          <button
            onClick={() => setIsAnimationPanelOpen(true)}
            disabled={isApplyingAnimation}
            className="px-4 py-1 bg-[#8b5cf6] hover:bg-[#9d6fff] border border-[#8b5cf6] rounded text-sm transition-colors shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplyingAnimation ? '⏳ Applying...' : '✨ Presets'}
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportClick}
            className="px-4 py-1 bg-[#ff6b00] hover:bg-[#ff8533] border border-[#ff6b00] rounded text-sm transition-colors shadow-lg shadow-orange-500/30"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-[#1a1a1a] border-r border-[#3a3a3a] flex flex-col items-center py-4 gap-2">
          {[
            { tool: 'select' as Tool, icon: '↖️', label: 'Select (V)' },
            { tool: 'brush' as Tool, icon: '🖌️', label: 'Brush (B)' },
            { tool: 'eraser' as Tool, icon: '🧹', label: 'Eraser (E)' },
            { tool: 'rectangle' as Tool, icon: '⬜', label: 'Rectangle (R)' },
            { tool: 'circle' as Tool, icon: '⭕', label: 'Circle (C)' },
            { tool: 'fill' as Tool, icon: '🪣', label: 'Fill (F)' },
          ].map(({ tool, icon, label }) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`w-12 h-12 flex items-center justify-center rounded transition-all ${
                selectedTool === tool
                  ? 'bg-[#ff6b00] shadow-lg shadow-orange-500/50'
                  : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
              }`}
              title={label}
            >
              <span className="text-xl">{icon}</span>
            </button>
          ))}
        </div>

        {/* Center - Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0d0d] p-8">
          <div className="relative">
            <div className="absolute -top-6 left-0 text-sm text-gray-500">
              Frame {currentFrame + 1} / {frames.length}
            </div>
            <canvas
              ref={canvasRef}
              className="border-2 border-[#3a3a3a] shadow-2xl"
            />
          </div>
        </div>

        {/* Right Sidebar - Properties & Sprites */}
        <div className="w-64 bg-[#1a1a1a] border-l border-[#3a3a3a] flex flex-col">
          {/* Properties Panel */}
          <div className="p-4 border-b border-[#3a3a3a]">
            <h3 className="text-sm font-bold mb-3 text-[#ff6b00] flex items-center gap-2">
              <span>🎨</span> Properties
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Color</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Brush Size: {brushSize}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Halloween Sprite Library */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-bold mb-3 text-[#8b5cf6] flex items-center gap-2">
              <span>👻</span> Sprite Library
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {halloweenSprites.map((sprite) => (
                <button
                  key={sprite.name}
                  onClick={() => addSpriteToCanvas(sprite.emoji)}
                  className="p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded transition-colors flex flex-col items-center gap-1"
                  title={sprite.name}
                >
                  <span className="text-3xl">{sprite.emoji}</span>
                  <span className="text-xs text-gray-400">{sprite.name.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="h-32 bg-[#1a1a1a] border-t border-[#3a3a3a] p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-[#10b981]">⏱️ Timeline</span>
          <button
            onClick={addFrame}
            className="ml-auto px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-xs transition-colors"
            title="Add Frame"
          >
            ➕ Add
          </button>
          <button
            onClick={deleteFrame}
            disabled={frames.length <= 1}
            className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Frame"
          >
            🗑️ Delete
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {frames.map((frame, index) => {
            // Check if frame has actual content
            let hasContent = false;
            try {
              if (frame.data) {
                const json = JSON.parse(frame.data);
                hasContent = json.objects && json.objects.length > 0;
              }
            } catch (e) {
              hasContent = false;
            }

            return (
              <button
                key={frame.id}
                onClick={() => setCurrentFrame(index)}
                className={`flex-shrink-0 w-20 h-16 rounded border-2 transition-all ${
                  currentFrame === index
                    ? 'border-[#ff6b00] shadow-lg shadow-orange-500/30'
                    : 'border-[#3a3a3a] hover:border-[#4a4a4a]'
                } bg-[#2a2a2a] flex items-center justify-center relative overflow-hidden`}
              >
                <span className="text-xs absolute top-1 left-1 text-gray-500 z-10">
                  {index}
                </span>
                {hasContent && (
                  <span className="text-xs absolute top-1 right-1 z-10" title="Has content">
                    ✓
                  </span>
                )}
                {frame.thumbnail ? (
                  <img 
                    src={frame.thumbnail} 
                    alt={`Frame ${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl opacity-50">🎬</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tween Panel (Flash-style) */}
      <TweenPanel
        currentFrame={currentFrame}
        totalFrames={frames.length}
        onCreateTween={handleCreateTween}
        isOpen={isTweenPanelOpen}
        onClose={() => setIsTweenPanelOpen(false)}
      />

      {/* Animation Preset Panel */}
      <AnimationPresetPanel
        onApplyPreset={handleApplyPreset}
        onApplyTextAnimation={handleApplyTextAnimation}
        isOpen={isAnimationPanelOpen}
        onClose={() => setIsAnimationPanelOpen(false)}
      />

      {/* Export Panel */}
      <ExportPanel
        frames={convertFramesToExportFormat}
        isOpen={isExportPanelOpen}
        onClose={() => setIsExportPanelOpen(false)}
      />
    </div>
  );
}
