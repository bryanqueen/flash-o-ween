'use client';

import { ExportProgress } from '../types';

export interface ExportProgressDisplayProps {
  progress: ExportProgress;
  onCancel?: () => void;
}

export function ExportProgressDisplay({ progress, onCancel }: ExportProgressDisplayProps) {
  const getStageLabel = (stage: ExportProgress['stage']): string => {
    switch (stage) {
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

  return (
    <div className="p-4 bg-[#1a1a1a] border border-[#3a3a3a] rounded space-y-3">
      {/* Stage Label */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">
          {getStageLabel(progress.stage)}
        </h3>
        {progress.stage !== 'complete' && progress.stage !== 'error' && onCancel && (
          <button
            onClick={onCancel}
            className="text-xs px-2 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${getProgressColor(progress.stage)} transition-all duration-300`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{progress.message}</span>
        <span className="text-white font-mono">{progress.percentage}%</span>
      </div>

      {/* File Size */}
      {progress.fileSize !== undefined && (
        <div className="text-xs text-gray-400 text-center pt-2 border-t border-[#3a3a3a]">
          File Size: {(progress.fileSize / 1024).toFixed(2)} KB
        </div>
      )}
    </div>
  );
}
