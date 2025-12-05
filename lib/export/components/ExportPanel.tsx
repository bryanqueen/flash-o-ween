'use client';

import { useState, useEffect } from 'react';
import { ExportConfig, ExportProgress, ExportResult, Frame as ExportFrame } from '../types';
import { ExportButton } from './ExportButton';
import { ExportConfigPanel } from './ExportConfigPanel';
import { ExportProgressDisplay } from './ExportProgressDisplay';
import { ExportErrorDisplay } from './ExportErrorDisplay';

// Default export configuration
const DEFAULT_CONFIG: ExportConfig = {
  frameRate: 30,
  loop: true,
  autoplay: true,
  showControls: true,
  playbackSpeed: 1.0,
};

export interface ExportPanelProps {
  frames: ExportFrame[] | (() => Promise<ExportFrame[]>);
  isOpen: boolean;
  onClose: () => void;
}

export function ExportPanel({ frames, isOpen, onClose }: ExportPanelProps) {
  const [config, setConfig] = useState<ExportConfig>(DEFAULT_CONFIG);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [resolvedFrames, setResolvedFrames] = useState<ExportFrame[]>([]);
  const [isLoadingFrames, setIsLoadingFrames] = useState(false);

  // Resolve frames when panel opens
  useEffect(() => {
    if (isOpen) {
      if (typeof frames === 'function') {
        setIsLoadingFrames(true);
        setResolvedFrames([]); // Clear previous frames
        frames().then(resolved => {
          setResolvedFrames(resolved);
          setIsLoadingFrames(false);
        }).catch(err => {
          setError(err.message || 'Failed to load frames');
          setIsLoadingFrames(false);
        });
      } else {
        setResolvedFrames(frames);
      }
    } else {
      // Reset state when panel closes
      setResolvedFrames([]);
      setIsLoadingFrames(false);
      setError(null);
      setProgress(null);
    }
    // Only depend on isOpen, not frames function reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExportStart = () => {
    setIsExporting(true);
    setError(null);
    setProgress(null);
  };

  const handleExportComplete = (result: ExportResult) => {
    setIsExporting(false);
    if (result.success) {
      // Keep the progress display showing completion
      setTimeout(() => {
        setProgress(null);
      }, 3000);
    }
  };

  const handleExportError = (errorMessage: string) => {
    setIsExporting(false);
    setError(errorMessage);
    setProgress(null);
  };

  const handleRetry = () => {
    setError(null);
    setProgress(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0d0d0d] border-2 border-[#3a3a3a] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#3a3a3a] p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#ff6b00] flex items-center gap-2">
            <span>📥</span> Export Animation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Frame Info */}
          <div className="p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded">
            <div className="text-sm text-gray-400">
              {isLoadingFrames ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin">⏳</div>
                  <span>Preparing frames for export...</span>
                </div>
              ) : (
                <>
                  <span className="font-bold text-white">{resolvedFrames.length}</span> frames ready to export
                </>
              )}
            </div>
          </div>

          {/* Configuration Panel */}
          <ExportConfigPanel config={config} onChange={setConfig} />

          {/* Progress Display */}
          {progress && !error && (
            <ExportProgressDisplay progress={progress} />
          )}

          {/* Error Display */}
          {error && (
            <ExportErrorDisplay
              error={error}
              onRetry={handleRetry}
              onDismiss={handleDismissError}
            />
          )}

          {/* Export Button */}
          {!isExporting && !error && !isLoadingFrames && (
            <ExportButton
              frames={resolvedFrames}
              config={config}
              onExportStart={handleExportStart}
              onExportComplete={handleExportComplete}
              onExportError={handleExportError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
