'use client';

import { ExportConfig } from '../types';

export interface ExportConfigPanelProps {
  config: ExportConfig;
  onChange: (config: ExportConfig) => void;
}

export function ExportConfigPanel({ config, onChange }: ExportConfigPanelProps) {
  const updateConfig = (updates: Partial<ExportConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleFrameRateChange = (value: number) => {
    const clamped = Math.max(1, Math.min(120, value));
    updateConfig({ frameRate: clamped });
  };

  const handlePlaybackSpeedChange = (value: number) => {
    const clamped = Math.max(0.25, Math.min(2.0, value));
    updateConfig({ playbackSpeed: clamped });
  };

  const handleWidthChange = (value: string) => {
    const num = parseInt(value, 10);
    updateConfig({ width: isNaN(num) || num <= 0 ? undefined : num });
  };

  const handleHeightChange = (value: string) => {
    const num = parseInt(value, 10);
    updateConfig({ height: isNaN(num) || num <= 0 ? undefined : num });
  };

  return (
    <div className="p-4 bg-[#1a1a1a] border border-[#3a3a3a] rounded space-y-4">
      <h3 className="text-sm font-bold text-[#ff6b00] flex items-center gap-2">
        <span>⚙️</span> Export Configuration
      </h3>

      {/* Frame Rate */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">
          Frame Rate: {config.frameRate} FPS
        </label>
        <input
          type="range"
          min="1"
          max="120"
          value={config.frameRate}
          onChange={(e) => handleFrameRateChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>120</span>
        </div>
      </div>

      {/* Playback Speed */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">
          Playback Speed: {config.playbackSpeed.toFixed(2)}x
        </label>
        <input
          type="range"
          min="0.25"
          max="2.0"
          step="0.25"
          value={config.playbackSpeed}
          onChange={(e) => handlePlaybackSpeedChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.25x</span>
          <span>2.0x</span>
        </div>
      </div>

      {/* Toggle Switches */}
      <div className="space-y-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs text-gray-400">Loop Animation</span>
          <input
            type="checkbox"
            checked={config.loop}
            onChange={(e) => updateConfig({ loop: e.target.checked })}
            className="w-4 h-4 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs text-gray-400">Autoplay</span>
          <input
            type="checkbox"
            checked={config.autoplay}
            onChange={(e) => updateConfig({ autoplay: e.target.checked })}
            className="w-4 h-4 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs text-gray-400">Show Controls</span>
          <input
            type="checkbox"
            checked={config.showControls}
            onChange={(e) => updateConfig({ showControls: e.target.checked })}
            className="w-4 h-4 cursor-pointer"
          />
        </label>
      </div>

      {/* Canvas Dimensions */}
      <div>
        <label className="text-xs text-gray-400 block mb-2">
          Canvas Dimensions (optional)
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Width"
              value={config.width || ''}
              onChange={(e) => handleWidthChange(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Height"
              value={config.height || ''}
              onChange={(e) => handleHeightChange(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">
          Background Color
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={config.backgroundColor || '#000000'}
            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
            className="w-12 h-8 rounded cursor-pointer"
          />
          <input
            type="text"
            value={config.backgroundColor || ''}
            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
            placeholder="transparent"
            className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
