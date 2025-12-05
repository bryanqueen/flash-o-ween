/**
 * Property-based tests for File Download Service
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { FileDownloadService } from '../file-download-service';

describe('FileDownloadService Property-Based Tests', () => {
  const service = new FileDownloadService();

  // Feature: animation-export, Property 11: File size reporting
  // **Validates: Requirements 7.5**
  it('Property 11: File size reporting - calculateSize returns accurate byte count', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (content) => {
          // Calculate size using the service
          const reportedSize = service.calculateSize(content);

          // Calculate expected size using TextEncoder (same method as implementation)
          const encoder = new TextEncoder();
          const expectedSize = encoder.encode(content).length;

          // The reported size must match the actual byte size
          expect(reportedSize).toBe(expectedSize);

          // Size should be non-negative
          expect(reportedSize).toBeGreaterThanOrEqual(0);

          // For empty string, size should be 0
          if (content === '') {
            expect(reportedSize).toBe(0);
          }

          // For non-empty strings, size should be positive
          if (content.length > 0) {
            expect(reportedSize).toBeGreaterThan(0);
          }

          // Size should be at least as large as the string length
          // (UTF-8 encoding means some characters take multiple bytes)
          expect(reportedSize).toBeGreaterThanOrEqual(content.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional property: File size is consistent for same content
  it('Property: File size calculation is deterministic', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (content) => {
          const size1 = service.calculateSize(content);
          const size2 = service.calculateSize(content);

          // Same content should always produce same size
          expect(size1).toBe(size2);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional property: Blob creation produces correct size
  it('Property: Created blob has correct size', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (content) => {
          const blob = service.createBlob(content);
          const calculatedSize = service.calculateSize(content);

          // Blob size should match calculated size
          expect(blob.size).toBe(calculatedSize);

          // Blob should have correct type
          expect(blob.type).toBe('text/html');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional property: Blob creation with custom MIME type
  it('Property: Blob respects custom MIME type', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.constantFrom('text/html', 'text/plain', 'application/json', 'text/css'),
        (content, mimeType) => {
          const blob = service.createBlob(content, mimeType);

          // Blob should have the specified MIME type
          expect(blob.type).toBe(mimeType);

          // Size should still be accurate
          const calculatedSize = service.calculateSize(content);
          expect(blob.size).toBe(calculatedSize);
        }
      ),
      { numRuns: 100 }
    );
  });
});
