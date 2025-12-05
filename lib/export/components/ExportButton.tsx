'use client';

import { useState } from 'react';
import { ExportOrchestrator } from '../export-orchestrator';
import { Frame, ExportConfig, ExportResult, ExportProgress } from '../types';

export interface ExportButtonProps {
  frames: Frame[];
  config?: Partial<ExportConfig>;
  onExportStart?: () => void;
  onExportComplete?: (result: ExportResult) => void;
  onExportError?: (error: string) => void;
}

export function ExportButton({
  frames,
  config,
  onExportStart,
  onExportComplete,
  onExportError,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleExport = async () => {
    if (frames.length === 0) {
      const error = 'No frames to export';
      setStatus(error);
      onExportError?.(error);
      return;
    }

    setIsExporting(true);
    setStatus('Starting export...');
    onExportStart?.();

    const orchestrator = new ExportOrchestrator();
    
    orchestrator.onProgress((progress: ExportProgress) => {
      setStatus(progress.message);
    });

    try {
      const result = await orchestrator.export(frames, config);
      
      if (result.success) {
        setStatus(`Export complete! (${(result.fileSize / 1024).toFixed(2)} KB)`);
        onExportComplete?.(result);
      } else {
        setStatus(`Export failed: ${result.error}`);
        onExportError?.(result.error || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setStatus(`Error: ${errorMessage}`);
      onExportError?.(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleExport}
        disabled={isExporting || frames.length === 0}
        className={`px-4 py-2 rounded font-medium transition-all ${
          isExporting || frames.length === 0
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-[#ff6b00] hover:bg-[#ff8533] shadow-lg shadow-orange-500/30'
        }`}
      >
        {isExporting ? '⏳ Exporting...' : '📥 Export Animation'}
      </button>
      {status && (
        <div className="text-xs text-gray-400 text-center">
          {status}
        </div>
      )}
    </div>
  );
}
