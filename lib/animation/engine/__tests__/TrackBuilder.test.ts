/**
 * Track Builder Tests
 */

import { describe, it, expect } from 'vitest';
import { createTrack } from '../TrackBuilder';

describe('TrackBuilder', () => {
  it('should create basic track', () => {
    const track = createTrack('test', 'Test Track').build();

    expect(track.id).toBe('test');
    expect(track.name).toBe('Test Track');
    expect(track.enabled).toBe(true);
  });

  it('should set track properties', () => {
    const track = createTrack('test', 'Test')
      .startAt(1.5)
      .duration(3)
      .easing('easeInOut')
      .enabled(false)
      .build();

    expect(track.startTime).toBe(1.5);
    expect(track.duration).toBe(3);
    expect(track.easing).toBe('easeInOut');
    expect(track.enabled).toBe(false);
  });

  it('should add keyframes', () => {
    const track = createTrack('test', 'Test')
      .keyframe('x', 0, 100)
      .keyframe('x', 1, 200)
      .keyframe('y', 0, 50)
      .build();

    expect(track.keyframes.x).toHaveLength(2);
    expect(track.keyframes.y).toHaveLength(1);
    expect(track.keyframes.x[0].value).toBe(100);
    expect(track.keyframes.x[1].value).toBe(200);
  });

  it('should sort keyframes by time', () => {
    const track = createTrack('test', 'Test')
      .keyframe('x', 2, 300)
      .keyframe('x', 0, 100)
      .keyframe('x', 1, 200)
      .build();

    expect(track.keyframes.x[0].time).toBe(0);
    expect(track.keyframes.x[1].time).toBe(1);
    expect(track.keyframes.x[2].time).toBe(2);
  });

  it('should add multiple keyframes at once', () => {
    const track = createTrack('test', 'Test')
      .keyframes('x', [
        { time: 0, value: 100 },
        { time: 1, value: 200 },
        { time: 2, value: 300 }
      ])
      .build();

    expect(track.keyframes.x).toHaveLength(3);
  });

  describe('Helper Methods', () => {
    it('should create position animation', () => {
      const track = createTrack('test', 'Test')
        .position(0, 100, 200)
        .position(1, 300, 400)
        .build();

      expect(track.keyframes.x).toHaveLength(2);
      expect(track.keyframes.y).toHaveLength(2);
      expect(track.keyframes.x[0].value).toBe(100);
      expect(track.keyframes.y[0].value).toBe(200);
    });

    it('should create rotation animation', () => {
      const track = createTrack('test', 'Test')
        .rotate(0, 0)
        .rotate(1, 360)
        .build();

      expect(track.keyframes.rotation).toHaveLength(2);
      expect(track.keyframes.rotation[1].value).toBe(360);
    });

    it('should create scale animation', () => {
      const track = createTrack('test', 'Test')
        .scale(0, 1)
        .scale(1, 2)
        .build();

      expect(track.keyframes.scaleX).toHaveLength(2);
      expect(track.keyframes.scaleY).toHaveLength(2);
      expect(track.keyframes.scaleX[1].value).toBe(2);
    });

    it('should create opacity animation', () => {
      const track = createTrack('test', 'Test')
        .opacity(0, 0)
        .opacity(1, 1)
        .build();

      expect(track.keyframes.opacity).toHaveLength(2);
    });

    it('should create fade in animation', () => {
      const track = createTrack('test', 'Test')
        .fadeIn(0, 1)
        .build();

      expect(track.keyframes.opacity).toHaveLength(2);
      expect(track.keyframes.opacity[0].value).toBe(0);
      expect(track.keyframes.opacity[1].value).toBe(1);
    });

    it('should create fade out animation', () => {
      const track = createTrack('test', 'Test')
        .fadeOut(0, 1)
        .build();

      expect(track.keyframes.opacity).toHaveLength(2);
      expect(track.keyframes.opacity[0].value).toBe(1);
      expect(track.keyframes.opacity[1].value).toBe(0);
    });

    it('should create move animation', () => {
      const track = createTrack('test', 'Test')
        .moveTo(0, 2, 100, 100, 300, 300)
        .build();

      expect(track.keyframes.x).toHaveLength(2);
      expect(track.keyframes.y).toHaveLength(2);
      expect(track.keyframes.x[0].value).toBe(100);
      expect(track.keyframes.x[1].value).toBe(300);
    });

    it('should create spin animation', () => {
      const track = createTrack('test', 'Test')
        .spin(0, 2, 2)
        .build();

      expect(track.keyframes.rotation).toHaveLength(2);
      expect(track.keyframes.rotation[1].value).toBe(720); // 2 rotations
    });

    it('should create pulse animation', () => {
      const track = createTrack('test', 'Test')
        .pulse(0, 2, 0.8, 1.2)
        .build();

      expect(track.keyframes.scaleX).toHaveLength(3);
      expect(track.keyframes.scaleY).toHaveLength(3);
      expect(track.keyframes.scaleX[1].value).toBe(1.2); // max scale
    });

    it('should create bounce animation', () => {
      const track = createTrack('test', 'Test')
        .bounce(0, 2, 100, 400)
        .build();

      expect(track.keyframes.y).toHaveLength(2);
      expect(track.easing).toBe('bounce');
    });
  });

  it('should chain multiple operations', () => {
    const track = createTrack('test', 'Test')
      .startAt(1)
      .duration(3)
      .easing('easeInOut')
      .position(0, 100, 100)
      .position(1, 200, 200)
      .scale(0, 1)
      .scale(1, 1.5)
      .opacity(0, 0)
      .opacity(1, 1)
      .build();

    expect(track.startTime).toBe(1);
    expect(track.duration).toBe(3);
    expect(track.keyframes.x).toHaveLength(2);
    expect(track.keyframes.scaleX).toHaveLength(2);
    expect(track.keyframes.opacity).toHaveLength(2);
  });
});
