'use client';

import { useState } from 'react';
import { AnimationPreset, TextAnimationConfig } from '../types';
import { animationPresets } from '../presets';
import { CustomAnimationBuilder } from './CustomAnimationBuilder';

interface AnimationPresetPanelProps {
  onApplyPreset: (preset: AnimationPreset) => void;
  onApplyTextAnimation: (config: TextAnimationConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AnimationPresetPanel({
  onApplyPreset,
  onApplyTextAnimation,
  isOpen,
  onClose
}: AnimationPresetPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'presets' | 'text' | 'custom'>('presets');
  const [booText, setBooText] = useState('BOO!');
  const [textColor, setTextColor] = useState('#ff6b00');
  const [fontSize, setFontSize] = useState(120);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  if (!isOpen) return null;

  const handleApplyTextAnimation = () => {
    onApplyTextAnimation({
      text: booText,
      startFrame: 0,
      letterDelay: 8,
      fontSize: fontSize,
      color: textColor,
      x: 250,
      y: 250
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-lg w-[600px] max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <h2 className="text-xl font-bold text-[#ff6b00] flex items-center gap-2">
            <span>✨</span> Animation Presets
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3a3a3a]">
          <button
            onClick={() => setSelectedTab('presets')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'presets'
                ? 'bg-[#2a2a2a] text-[#ff6b00] border-b-2 border-[#ff6b00]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎬 Presets
          </button>
          <button
            onClick={() => setSelectedTab('custom')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'custom'
                ? 'bg-[#2a2a2a] text-[#8b5cf6] border-b-2 border-[#8b5cf6]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎨 Custom
          </button>
          <button
            onClick={() => setSelectedTab('text')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'text'
                ? 'bg-[#2a2a2a] text-[#ff6b00] border-b-2 border-[#ff6b00]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📝 Text
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedTab === 'presets' ? (
            <div className="space-y-3">
              {animationPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onApplyPreset(preset);
                    onClose();
                  }}
                  className="w-full p-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded-lg transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-5xl group-hover:scale-110 transition-transform">
                      {preset.emoji}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{preset.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{preset.description}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>⏱️ {preset.duration} frames</span>
                        <span>📊 {preset.easing}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : selectedTab === 'custom' ? (
            <div className="space-y-4">
              <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-lg font-bold text-white mb-2">Build Your Own Animation</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Create custom animations with keyframes, easing functions, and full control over position, rotation, scale, and opacity.
                </p>
                <button
                  onClick={() => {
                    setShowCustomBuilder(true);
                    onClose();
                  }}
                  className="w-full px-4 py-3 bg-[#8b5cf6] hover:bg-[#9d6fff] rounded-lg font-medium transition-colors"
                >
                  Open Custom Animation Builder
                </button>
              </div>

              <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
                <h4 className="text-sm font-bold text-white mb-2">What You Can Do:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Define multiple keyframes</li>
                  <li>• Control position (x, y)</li>
                  <li>• Set rotation angles</li>
                  <li>• Adjust scale and opacity</li>
                  <li>• Choose easing functions</li>
                  <li>• Use any emoji or character</li>
                </ul>
              </div>

              <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
                <h4 className="text-sm font-bold text-white mb-2">Example Ideas:</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>🌟 Spinning star that grows</p>
                  <p>🕷️ Spider crawling across screen</p>
                  <p>🌙 Moon rising and setting</p>
                  <p>💫 Sparkle that fades in/out</p>
                  <p>🎪 Object moving in a circle</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Text to Animate
                </label>
                <input
                  type="text"
                  value={booText}
                  onChange={(e) => setBooText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white"
                  placeholder="Enter text..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Text Color
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Preview Effect:</h4>
                <p className="text-sm text-gray-400">
                  Letters will appear one by one with a bounce effect
                </p>
              </div>

              <button
                onClick={handleApplyTextAnimation}
                className="w-full px-4 py-3 bg-[#ff6b00] hover:bg-[#ff8533] rounded-lg font-medium transition-colors"
              >
                Apply Text Animation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animation Builder Modal */}
      <CustomAnimationBuilder
        isOpen={showCustomBuilder}
        onClose={() => setShowCustomBuilder(false)}
        onApplyCustomAnimation={(preset) => {
          setShowCustomBuilder(false);
          onApplyPreset(preset);
        }}
      />
    </div>
  );
}
