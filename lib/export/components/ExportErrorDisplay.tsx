'use client';

export interface ExportErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ExportErrorDisplay({ error, onRetry, onDismiss }: ExportErrorDisplayProps) {
  return (
    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded space-y-3">
      {/* Error Header */}
      <div className="flex items-start gap-2">
        <span className="text-xl">❌</span>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-red-400 mb-1">Export Failed</h3>
          <p className="text-xs text-gray-300">{error}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 px-3 py-2 bg-[#ff6b00] hover:bg-[#ff8533] rounded text-sm font-medium transition-colors"
          >
            🔄 Retry Export
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-sm transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Alternative Download Methods */}
      <div className="pt-2 border-t border-red-500/30">
        <p className="text-xs text-gray-400 mb-2">Alternative options:</p>
        <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
          <li>Try reducing the number of frames</li>
          <li>Lower the frame rate or canvas dimensions</li>
          <li>Check browser console for detailed errors</li>
        </ul>
      </div>
    </div>
  );
}
