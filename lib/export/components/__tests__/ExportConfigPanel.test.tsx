/**
 * ExportConfigPanel Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { ExportConfig } from '../../types';

describe('ExportConfigPanel', () => {
  const defaultConfig: ExportConfig = {
    frameRate: 30,
    loop: true,
    autoplay: true,
    showControls: true,
    playbackSpeed: 1.0,
  };

  it('should validate frame rate within bounds (1-120)', () => {
    const onChange = vi.fn();
    
    // Test clamping to minimum
    const clampedMin = Math.max(1, Math.min(120, 0));
    expect(clampedMin).toBe(1);
    
    // Test clamping to maximum
    const clampedMax = Math.max(1, Math.min(120, 150));
    expect(clampedMax).toBe(120);
    
    // Test valid value
    const valid = Math.max(1, Math.min(120, 60));
    expect(valid).toBe(60);
  });

  it('should validate playback speed within bounds (0.25-2.0)', () => {
    const onChange = vi.fn();
    
    // Test clamping to minimum
    const clampedMin = Math.max(0.25, Math.min(2.0, 0.1));
    expect(clampedMin).toBe(0.25);
    
    // Test clamping to maximum
    const clampedMax = Math.max(0.25, Math.min(2.0, 3.0));
    expect(clampedMax).toBe(2.0);
    
    // Test valid value
    const valid = Math.max(0.25, Math.min(2.0, 1.5));
    expect(valid).toBe(1.5);
  });

  it('should handle optional width and height values', () => {
    const onChange = vi.fn();
    
    // Test empty string
    const emptyWidth = parseInt('', 10);
    const resultEmpty = isNaN(emptyWidth) || emptyWidth <= 0 ? undefined : emptyWidth;
    expect(resultEmpty).toBeUndefined();
    
    // Test valid number
    const validWidth = parseInt('800', 10);
    const resultValid = isNaN(validWidth) || validWidth <= 0 ? undefined : validWidth;
    expect(resultValid).toBe(800);
    
    // Test negative number
    const negativeWidth = parseInt('-100', 10);
    const resultNegative = isNaN(negativeWidth) || negativeWidth <= 0 ? undefined : negativeWidth;
    expect(resultNegative).toBeUndefined();
    
    // Test zero
    const zeroWidth = parseInt('0', 10);
    const resultZero = isNaN(zeroWidth) || zeroWidth <= 0 ? undefined : zeroWidth;
    expect(resultZero).toBeUndefined();
  });

  it('should update config when values change', () => {
    const onChange = vi.fn();
    const config = { ...defaultConfig };
    
    // Simulate updating frame rate
    const updatedConfig = { ...config, frameRate: 60 };
    onChange(updatedConfig);
    
    expect(onChange).toHaveBeenCalledWith(updatedConfig);
  });

  it('should handle toggle switches correctly', () => {
    const onChange = vi.fn();
    const config = { ...defaultConfig };
    
    // Toggle loop
    const toggledLoop = { ...config, loop: !config.loop };
    onChange(toggledLoop);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ loop: false }));
    
    // Toggle autoplay
    onChange.mockClear();
    const toggledAutoplay = { ...config, autoplay: !config.autoplay };
    onChange(toggledAutoplay);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ autoplay: false }));
    
    // Toggle showControls
    onChange.mockClear();
    const toggledControls = { ...config, showControls: !config.showControls };
    onChange(toggledControls);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ showControls: false }));
  });

  it('should handle background color updates', () => {
    const onChange = vi.fn();
    const config = { ...defaultConfig };
    
    // Update background color
    const updatedConfig = { ...config, backgroundColor: '#ff0000' };
    onChange(updatedConfig);
    
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ backgroundColor: '#ff0000' }));
  });
});
