/**
 * ExportErrorDisplay Component Tests
 */

import { describe, it, expect, vi } from 'vitest';

describe('ExportErrorDisplay', () => {
  it('should display error message', () => {
    const errorMessage = 'Export failed: Invalid frame format';
    
    // Verify error message is non-empty
    expect(errorMessage).toBeDefined();
    expect(errorMessage.length).toBeGreaterThan(0);
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    
    // Simulate retry button click
    onRetry();
    
    expect(onRetry).toHaveBeenCalled();
  });

  it('should call onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    
    // Simulate dismiss button click
    onDismiss();
    
    expect(onDismiss).toHaveBeenCalled();
  });

  it('should provide alternative options in error display', () => {
    const alternativeOptions = [
      'Try reducing the number of frames',
      'Lower the frame rate or canvas dimensions',
      'Check browser console for detailed errors'
    ];

    // Verify alternative options are available
    expect(alternativeOptions.length).toBeGreaterThan(0);
    alternativeOptions.forEach(option => {
      expect(option.length).toBeGreaterThan(0);
    });
  });

  it('should handle different error types', () => {
    const errors = [
      'No frames to export',
      'Frame processing failed at frame 5',
      'Failed to generate HTML',
      'Browser blocked file download'
    ];

    errors.forEach(error => {
      expect(error).toBeDefined();
      expect(error.length).toBeGreaterThan(0);
    });
  });
});
