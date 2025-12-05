/**
 * Setup verification test
 * Ensures the testing infrastructure is properly configured
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { FrameFormat } from '../types';

describe('Test Setup', () => {
  it('should run basic unit tests', () => {
    expect(true).toBe(true);
  });

  it('should import types correctly', () => {
    expect(FrameFormat.DATA_URL).toBe('data_url');
    expect(FrameFormat.CANVAS).toBe('canvas');
  });

  it('should run property-based tests with fast-check', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      }),
      { numRuns: 100 }
    );
  });
});
