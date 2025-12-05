'use client';

import { useState } from 'react';
import { EasingFunction } from '../types';

interface TweenPanelProps {
  currentFrame: number;
  totalFrames: number;
  onCreateTween: (startFrame: number, endFrame: number, easing: EasingFunction) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TweenPanel({
  currentFrame,
  totalFrames,
  onCreateTween,
  isOpen,
  onClose
}: TweenPanelProps) {
  const [startFrame, setStartFrame] = useState(currentFrame);
  const [endFrame, setEndFrame] = useState(Math.min(currentFrame + 10, totalFrames - 1));
  const [easing, setEasing] = useState<EasingFunction>('easeInOut');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (startFrame >= endFrame) {
      alert('End frame must be after start frame');
      return;
    }
    onCreateTween(startFrame, endFrame, easing);
    onClose();
  };

  const easingOptions: { value: EasingFunction; label: string; description: string }[] = [
    { value: 'linear', label: 'Linear', description: 'Constant speed' },
    { value: 'easeIn', label: 'Ease In', description: 'Slow start, fast end' },
    { value: 'easeOut', label: 'Ease Out', description: 'Fast start, slow end' },
    { value: 'easeInOut', label: 'Ease In-Out', description: 'Smooth start and end' },
    { value: 'bounce', label: 'Bounce', description: 'Bouncing effect' },
    { value: 'elastic', label: 'Elastic', description: 'Spring-like overshoot' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-lg w-[500px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <h2 className="text-xl font-bold text-[#10b981] flex items-center gap-2">
            <span>⚡</span> Create Motion Tween
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <span>💡</span> How it works
            </h3>
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
              <li>Draw your object on the <strong>start frame</strong></li>
              <li>Move to the <strong>end frame</strong> and draw it in a new position</li>
              <li>Click "Create Tween" to automatically fill in-between frames</li>
            </ol>
          </div>

          {/* Frame Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Frame
              </label>
              <input
                type="number"
                value={startFrame}
                onChange={(e) => setStartFrame(Math.max(0, Math.min(totalFrames - 2, Number(e.target.value))))}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white"
                min="0"
                max={totalFrames - 2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Frame
              </label>
              <input
                type="number"
                value={endFrame}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setEndFrame(Math.max(startFrame + 1, Math.min(totalFrames - 1, value)));
                }}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white"
                min={startFrame + 1}
                max={totalFrames - 1}
              />
              <p className="text-xs text-gray-400 mt-1">
                Max frame: {totalFrames - 1}
              </p>
            </div>

            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded p-3 text-sm text-gray-300">
              <strong>Frames to generate:</strong> {endFrame - startFrame - 1} in-between frames
            </div>
          </div>

          {/* Easing Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Motion Style (Easing)
            </label>
            <div className="space-y-2">
              {easingOptions.map(option => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded cursor-pointer transition-colors ${
                    easing === option.value
                      ? 'bg-[#10b981]/20 border-2 border-[#10b981]'
                      : 'bg-[#2a2a2a] border-2 border-[#3a3a3a] hover:border-[#4a4a4a]'
                  }`}
                >
                  <input
                    type="radio"
                    name="easing"
                    value={option.value}
                    checked={easing === option.value}
                    onChange={(e) => setEasing(e.target.value as EasingFunction)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-xs text-gray-400">{option.description}</div>
                  </div>
                </label>
              ))}
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
            onClick={handleCreate}
            className="flex-1 px-4 py-2 bg-[#10b981] hover:bg-[#0ea472] rounded font-medium transition-colors"
          >
            Create Tween
          </button>
        </div>
      </div>
    </div>
  );
}
