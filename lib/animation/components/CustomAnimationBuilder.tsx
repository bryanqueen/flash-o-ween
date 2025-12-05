'use client';

import { useState } from 'react';
import { AnimationKeyframe, EasingFunction, AnimationPreset } from '../types';

interface CustomAnimationBuilderProps {
  onApplyCustomAnimation: (preset: AnimationPreset) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomAnimationBuilder({
  onApplyCustomAnimation,
  isOpen,
  onClose
}: CustomAnimationBuilderProps) {
  const [emoji, setEmoji] = useState('🎨');
  const [duration, setDuration] = useState(60);
  const [easing, setEasing] = useState<EasingFunction>('easeInOut');
  const [keyframes, setKeyframes] = useState<AnimationKeyframe[]>([
    { frame: 0, x: 400, y: 300, rotation: 0, scale: 1, opacity: 1 },
    { frame: 60, x: 400, y: 300, rotation: 360, scale: 1, opacity: 1 }
  ]);

  if (!isOpen) return null;

  const addKeyframe = () => {
    const lastFrame = keyframes[keyframes.length - 1];
    const newFrame = Math.min(lastFrame.frame + 15, duration);
    
    setKeyframes([
      ...keyframes,
      {
        frame: newFrame,
        x: lastFrame.x,
        y: lastFrame.y,
        rotation: lastFrame.rotation || 0,
        scale: lastFrame.scale || 1,
        opacity: lastFrame.opacity ?? 1
      }
    ]);
  };

  const removeKeyframe = (index: number) => {
    if (keyframes.length <= 2) return; // Keep at least 2 keyframes
    setKeyframes(keyframes.filter((_, i) => i !== index));
  };

  const updateKeyframe = (index: number, field: keyof AnimationKeyframe, value: number) => {
    const updated = [...keyframes];
    updated[index] = { ...updated[index], [field]: value };
    setKeyframes(updated);
  };

  const handleApply = () => {
    // Sort keyframes by frame number
    const sortedKeyframes = [...keyframes].sort((a, b) => a.frame - b.frame);
    
    const customPreset: AnimationPreset = {
      id: `custom-${Date.now()}`,
      name: 'Custom Animation',
      description: 'User-created animation',
      emoji: emoji,
      duration: duration,
      keyframes: sortedKeyframes,
      easing: easing
    };

    onApplyCustomAnimation(customPreset);
    onClose();
  };

  const easingOptions: EasingFunction[] = ['linear', 'easeIn', 'easeOut', 'easeInOut', 'bounce', 'elastic'];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-lg w-[700px] max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <h2 className="text-xl font-bold text-[#8b5cf6] flex items-center gap-2">
            <span>🎨</span> Custom Animation Builder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Basic Settings */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-white mb-2">Basic Settings</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Emoji/Object</label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-white text-2xl text-center"
                  placeholder="🎨"
                  maxLength={2}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">Duration (frames)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Math.max(10, Math.min(300, Number(e.target.value))))}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-white"
                  min="10"
                  max="300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Easing Function</label>
              <select
                value={easing}
                onChange={(e) => setEasing(e.target.value as EasingFunction)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-white"
              >
                {easingOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {easing === 'linear' && 'Constant speed'}
                {easing === 'easeIn' && 'Slow start, fast end'}
                {easing === 'easeOut' && 'Fast start, slow end'}
                {easing === 'easeInOut' && 'Slow start and end'}
                {easing === 'bounce' && 'Bouncing effect'}
                {easing === 'elastic' && 'Spring-like motion'}
              </p>
            </div>
          </div>

          {/* Keyframes */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white">Keyframes</h3>
              <button
                onClick={addKeyframe}
                className="px-3 py-1 bg-[#8b5cf6] hover:bg-[#9d6fff] rounded text-sm transition-colors"
              >
                ➕ Add Keyframe
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {keyframes.map((keyframe, index) => (
                <div key={index} className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#8b5cf6]">
                      Keyframe {index + 1}
                    </span>
                    {keyframes.length > 2 && (
                      <button
                        onClick={() => removeKeyframe(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Frame #</label>
                      <input
                        type="number"
                        value={keyframe.frame}
                        onChange={(e) => updateKeyframe(index, 'frame', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm"
                        min="0"
                        max={duration}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">X Position</label>
                      <input
                        type="number"
                        value={keyframe.x ?? 400}
                        onChange={(e) => updateKeyframe(index, 'x', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm"
                        min="0"
                        max="800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Y Position</label>
                      <input
                        type="number"
                        value={keyframe.y ?? 300}
                        onChange={(e) => updateKeyframe(index, 'y', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm"
                        min="0"
                        max="600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Rotation (°)</label>
                      <input
                        type="number"
                        value={keyframe.rotation ?? 0}
                        onChange={(e) => updateKeyframe(index, 'rotation', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm"
                        min="-360"
                        max="360"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Scale</label>
                      <input
                        type="number"
                        value={keyframe.scale ?? 1}
                        onChange={(e) => updateKeyframe(index, 'scale', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm"
                        min="0.1"
                        max="3"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Opacity</label>
                      <input
                        type="number"
                        value={keyframe.opacity ?? 1}
                        onChange={(e) => updateKeyframe(index, 'opacity', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white text-sm"
                        min="0"
                        max="1"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
            <h3 className="font-bold text-white mb-2">Animation Summary</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Object: <span className="text-2xl">{emoji}</span></p>
              <p>• Duration: {duration} frames</p>
              <p>• Keyframes: {keyframes.length}</p>
              <p>• Easing: {easing}</p>
              <p>• At 12 FPS: {(duration / 12).toFixed(1)} seconds</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3a3a3a] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-[#8b5cf6] hover:bg-[#9d6fff] rounded font-medium transition-colors"
          >
            Apply Custom Animation
          </button>
        </div>
      </div>
    </div>
  );
}
