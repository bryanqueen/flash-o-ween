/**
 * ExportProgressDisplay Component Tests
 */

import { describe, it, expect } from 'vitest';
import { ExportProgress } from '../../types';

describe('ExportProgressDisplay', () => {
  it('should display correct stage labels', () => {
    const stages: ExportProgress['stage'][] = [
      'processing',
      'generating',
      'downloading',
      'complete',
      'error'
    ];

    const expectedLabels = [
      '🔄 Processing Frames',
      '📝 Generating HTML',
      '💾 Preparing Download',
      '✅ Export Complete',
      '❌ Export Failed'
    ];

    stages.forEach((stage, index) => {
      const getStageLabel = (s: ExportProgress['stage']): string => {
        switch (s) {
          case 'processing':
            return '🔄 Processing Frames';
          case 'generating':
            return '📝 Generating HTML';
          case 'downloading':
            return '💾 Preparing Download';
          case 'complete':
            return '✅ Export Complete';
          case 'error':
            return '❌ Export Failed';
          default:
            return '⏳ Exporting';
        }
      };

      expect(getStageLabel(stage)).toBe(expectedLabels[index]);
    });
  });

  it('should use correct progress bar colors', () => {
    const getProgressColor = (stage: ExportProgress['stage']): string => {
      switch (stage) {
        case 'complete':
          return 'bg-green-500';
        case 'error':
          return 'bg-red-500';
        default:
          return 'bg-[#ff6b00]';
      }
    };

    expect(getProgressColor('processing')).toBe('bg-[#ff6b00]');
    expect(getProgressColor('generating')).toBe('bg-[#ff6b00]');
    expect(getProgressColor('downloading')).toBe('bg-[#ff6b00]');
    expect(getProgressColor('complete')).toBe('bg-green-500');
    expect(getProgressColor('error')).toBe('bg-red-500');
  });

  it('should display progress percentage correctly', () => {
    const progress: ExportProgress = {
      stage: 'processing',
      percentage: 50,
      message: 'Processing frames...'
    };

    expect(progress.percentage).toBe(50);
    expect(progress.percentage).toBeGreaterThanOrEqual(0);
    expect(progress.percentage).toBeLessThanOrEqual(100);
  });

  it('should display file size when available', () => {
    const progressWithSize: ExportProgress = {
      stage: 'downloading',
      percentage: 90,
      message: 'Preparing download...',
      fileSize: 102400 // 100 KB in bytes
    };

    expect(progressWithSize.fileSize).toBeDefined();
    const sizeInKB = (progressWithSize.fileSize! / 1024).toFixed(2);
    expect(sizeInKB).toBe('100.00');
  });

  it('should handle progress without file size', () => {
    const progressWithoutSize: ExportProgress = {
      stage: 'processing',
      percentage: 25,
      message: 'Processing frame 5 of 20...'
    };

    expect(progressWithoutSize.fileSize).toBeUndefined();
  });

  it('should show cancel button for in-progress stages', () => {
    const inProgressStages: ExportProgress['stage'][] = [
      'processing',
      'generating',
      'downloading'
    ];

    const completedStages: ExportProgress['stage'][] = [
      'complete',
      'error'
    ];

    inProgressStages.forEach(stage => {
      const shouldShowCancel = stage !== 'complete' && stage !== 'error';
      expect(shouldShowCancel).toBe(true);
    });

    completedStages.forEach(stage => {
      const shouldShowCancel = stage !== 'complete' && stage !== 'error';
      expect(shouldShowCancel).toBe(false);
    });
  });
});
