/**
 * Animation Engine Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnimationEngine } from '../AnimationEngine';
import { createTrack } from '../TrackBuilder';
import { Canvas, FabricText } from 'fabric';

describe('AnimationEngine', () => {
  let canvas: Canvas;
  let engine: AnimationEngine;

  beforeEach(() => {
    // Create mock canvas
    const canvasElement = document.createElement('canvas');
    canvas = new Canvas(canvasElement);
    engine = new AnimationEngine(canvas, { fps: 30, loop: false });
  });

  describe('Track Management', () => {
    it('should add tracks', () => {
      const track = createTrack('test1', 'Test Track')
        .duration(2)
        .build();

      engine.addTrack(track);
      expect(engine.getTrack('test1')).toBeDefined();
      expect(engine.getAllTracks()).toHaveLength(1);
    });

    it('should remove tracks', () => {
      const track = createTrack('test1', 'Test Track').build();
      engine.addTrack(track);
      engine.removeTrack('test1');
      
      expect(engine.getTrack('test1')).toBeUndefined();
      expect(engine.getAllTracks()).toHaveLength(0);
    });

    it('should update duration when adding tracks', () => {
      const track1 = createTrack('t1', 'Track 1')
        .startAt(0)
        .duration(2)
        .build();

      const track2 = createTrack('t2', 'Track 2')
        .startAt(1)
        .duration(3)
        .build();

      engine.addTrack(track1);
      expect(engine.getState().duration).toBe(2);

      engine.addTrack(track2);
      expect(engine.getState().duration).toBe(4); // 1 + 3
    });
  });

  describe('Playback Control', () => {
    it('should start playback', () => {
      engine.play();
      expect(engine.getState().isPlaying).toBe(true);
    });

    it('should pause playback', () => {
      engine.play();
      engine.pause();
      expect(engine.getState().isPlaying).toBe(false);
    });

    it('should stop and reset', () => {
      engine.seek(1.5);
      engine.stop();
      
      expect(engine.getState().isPlaying).toBe(false);
      expect(engine.getState().currentTime).toBe(0);
    });

    it('should toggle play/pause', () => {
      expect(engine.getState().isPlaying).toBe(false);
      
      engine.toggle();
      expect(engine.getState().isPlaying).toBe(true);
      
      engine.toggle();
      expect(engine.getState().isPlaying).toBe(false);
    });
  });

  describe('Seeking', () => {
    it('should seek to specific time', () => {
      const track = createTrack('t1', 'Track')
        .duration(5)
        .build();
      engine.addTrack(track);

      engine.seek(2.5);
      expect(engine.getState().currentTime).toBe(2.5);
    });

    it('should clamp seek time to valid range', () => {
      const track = createTrack('t1', 'Track')
        .duration(5)
        .build();
      engine.addTrack(track);

      engine.seek(-1);
      expect(engine.getState().currentTime).toBe(0);

      engine.seek(10);
      expect(engine.getState().currentTime).toBe(5);
    });
  });

  describe('Playback Settings', () => {
    it('should set playback speed', () => {
      engine.setSpeed(2.0);
      expect(engine.getState().speed).toBe(2.0);
    });

    it('should clamp speed to valid range', () => {
      engine.setSpeed(0.05);
      expect(engine.getState().speed).toBe(0.1);

      engine.setSpeed(10);
      expect(engine.getState().speed).toBe(5.0);
    });

    it('should set FPS', () => {
      engine.setFPS(60);
      expect(engine.getState().fps).toBe(60);
    });

    it('should set loop mode', () => {
      engine.setLoop(true);
      expect(engine.getState().loop).toBe(true);
    });
  });

  describe('Events', () => {
    it('should emit play event', () => {
      const callback = vi.fn();
      engine.on('play', callback);
      
      engine.play();
      expect(callback).toHaveBeenCalled();
    });

    it('should emit pause event', () => {
      const callback = vi.fn();
      engine.on('pause', callback);
      
      engine.play();
      engine.pause();
      expect(callback).toHaveBeenCalled();
    });

    it('should emit seek event', () => {
      const callback = vi.fn();
      engine.on('seek', callback);
      
      engine.seek(1.5);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ time: 1.5 })
      );
    });

    it('should remove event listeners', () => {
      const callback = vi.fn();
      engine.on('play', callback);
      engine.off('play', callback);
      
      engine.play();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Export/Import', () => {
    it('should export animation data', () => {
      const track = createTrack('t1', 'Track')
        .duration(2)
        .keyframe('x', 0, 100)
        .keyframe('x', 2, 200)
        .build();

      engine.addTrack(track);
      const exported = engine.export();

      expect(exported.tracks).toHaveLength(1);
      expect(exported.tracks[0].id).toBe('t1');
      expect(exported.state).toBeDefined();
    });

    it('should import animation data', () => {
      const data = {
        tracks: [
          {
            id: 't1',
            name: 'Track',
            startTime: 0,
            duration: 2,
            enabled: true,
            keyframes: {
              x: [
                { time: 0, value: 100 },
                { time: 2, value: 200 }
              ]
            }
          }
        ],
        state: {
          fps: 60,
          loop: true
        }
      };

      engine.import(data);
      expect(engine.getAllTracks()).toHaveLength(1);
      expect(engine.getState().fps).toBe(60);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources', () => {
      const track = createTrack('t1', 'Track').build();
      engine.addTrack(track);
      engine.play();

      engine.destroy();
      
      expect(engine.getAllTracks()).toHaveLength(0);
      expect(engine.getState().isPlaying).toBe(false);
    });
  });
});
