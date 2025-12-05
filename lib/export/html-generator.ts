/**
 * HTML Generator
 * Generates standalone HTML files with embedded animation code
 */

import { ProcessedFrame, ExportConfig } from './types';
import { TemplateRenderError, InvalidConfigError } from './errors';

/**
 * Default export configuration
 */
export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  frameRate: 30,
  loop: true,
  autoplay: true,
  showControls: true,
  playbackSpeed: 1.0,
  backgroundColor: 'transparent'
};

/**
 * HTML Generator interface
 */
export interface IHTMLGenerator {
  generate(frames: ProcessedFrame[], config: ExportConfig): string;
  generateTemplate(frames: ProcessedFrame[], config: ExportConfig): string;
  embedFrameData(frames: ProcessedFrame[]): string;
  generatePlaybackCode(config: ExportConfig): string;
  generateStyles(config: ExportConfig): string;
}

/**
 * HTML Generator implementation
 */
export class HTMLGenerator implements IHTMLGenerator {
  /**
   * Validate export configuration
   */
  private validateConfig(config: ExportConfig): void {
    if (isNaN(config.frameRate) || config.frameRate <= 0 || config.frameRate > 120) {
      throw new InvalidConfigError('Invalid export configuration: frameRate must be between 1 and 120');
    }

    if (isNaN(config.playbackSpeed) || config.playbackSpeed <= 0 || config.playbackSpeed > 2.0) {
      throw new InvalidConfigError('Invalid export configuration: playbackSpeed must be between 0.25 and 2.0');
    }

    if (config.width !== undefined && (isNaN(config.width) || config.width <= 0)) {
      throw new InvalidConfigError('Invalid export configuration: width must be positive');
    }

    if (config.height !== undefined && (isNaN(config.height) || config.height <= 0)) {
      throw new InvalidConfigError('Invalid export configuration: height must be positive');
    }
  }

  /**
   * Main generate function - orchestrates all generation steps
   */
  generate(frames: ProcessedFrame[], config: ExportConfig): string {
    try {
      // Validate configuration
      this.validateConfig(config);

      // Validate frames
      if (!frames || frames.length === 0) {
        throw new TemplateRenderError('Cannot generate HTML: no frames provided');
      }

      // Generate complete HTML template
      return this.generateTemplate(frames, config);
    } catch (error) {
      if (error instanceof InvalidConfigError || error instanceof TemplateRenderError) {
        throw error;
      }
      throw new TemplateRenderError(`Failed to generate HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Embed frame data as JavaScript array literal
   */
  embedFrameData(frames: ProcessedFrame[]): string {
    // Convert frames to JavaScript array with proper escaping
    const frameDataArray = frames.map(frame => {
      // Escape special characters in data URL for JavaScript string literal
      const escapedDataUrl = frame.dataUrl
        .replace(/\\/g, '\\\\')    // Escape backslashes
        .replace(/'/g, "\\'")       // Escape single quotes
        .replace(/\n/g, '\\n')      // Escape newlines
        .replace(/\r/g, '\\r')      // Escape carriage returns
        .replace(/\u2028/g, '\\u2028')  // Escape line separator
        .replace(/\u2029/g, '\\u2029'); // Escape paragraph separator

      return `      {
        dataUrl: '${escapedDataUrl}',
        width: ${frame.width},
        height: ${frame.height},
        index: ${frame.index}
      }`;
    });

    return `    const frames = [
${frameDataArray.join(',\n')}
    ];`;
  }

  /**
   * Generate inline CSS styles
   */
  generateStyles(config: ExportConfig): string {
    return `    <style>
      body {
        margin: 0;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #f0f0f0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      #animation-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      #animation-canvas {
        border: 1px solid #ccc;
        background: ${config.backgroundColor || 'transparent'};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      #controls {
        display: ${config.showControls ? 'flex' : 'none'};
        gap: 15px;
        align-items: center;
        padding: 15px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #007bff;
        color: white;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      }

      button:hover {
        background: #0056b3;
      }

      button:active {
        background: #004085;
      }

      .speed-control {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .speed-control label {
        font-size: 14px;
        color: #333;
      }

      .speed-control input[type="range"] {
        width: 150px;
      }

      .speed-value {
        font-size: 14px;
        color: #666;
        min-width: 40px;
      }
    </style>`;
  }

  /**
   * Generate animation playback code
   */
  generatePlaybackCode(config: ExportConfig): string {
    return `    // Animation Player Class
    class AnimationPlayer {
      constructor(frames, config) {
        this.frames = frames;
        this.config = config;
        this.currentFrameIndex = 0;
        this.isPlaying = ${config.autoplay};
        this.playbackSpeed = config.playbackSpeed;
        this.canvas = document.getElementById('animation-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.frameImages = [];
        this.loadedFrames = 0;
        this.lastFrameTime = 0;
        this.animationFrameId = null;

        // Set canvas dimensions
        this.canvas.width = config.width || frames[0].width;
        this.canvas.height = config.height || frames[0].height;

        // Load all frames
        this.loadFrames();

        // Handle visibility change (pause when tab is inactive)
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            this.pause();
          }
        });
      }

      // Load and cache all frame images
      loadFrames() {
        this.frames.forEach((frame, index) => {
          const img = new Image();
          img.onload = () => {
            this.loadedFrames++;
            if (this.loadedFrames === this.frames.length) {
              this.onAllFramesLoaded();
            }
          };
          img.onerror = (e) => {
            console.error('Failed to load frame', index, e);
          };
          img.src = frame.dataUrl;
          this.frameImages[index] = img;
        });
      }

      // Called when all frames are loaded
      onAllFramesLoaded() {
        this.renderFrame(this.currentFrameIndex);
        if (this.isPlaying) {
          this.startPlayback();
        }
      }

      // Render a specific frame
      renderFrame(index) {
        if (index < 0 || index >= this.frameImages.length) return;

        const img = this.frameImages[index];
        if (!img.complete) return;

        // Clear canvas with background color
        if (this.config.backgroundColor && this.config.backgroundColor !== 'transparent') {
          this.ctx.fillStyle = this.config.backgroundColor;
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw frame
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      }

      // Start playback loop
      startPlayback() {
        this.isPlaying = true;
        this.lastFrameTime = performance.now();
        this.playbackLoop();
      }

      // Main playback loop using requestAnimationFrame
      playbackLoop() {
        if (!this.isPlaying) return;

        const currentTime = performance.now();
        const frameDuration = (1000 / this.config.frameRate) / this.playbackSpeed;
        const elapsed = currentTime - this.lastFrameTime;

        if (elapsed >= frameDuration) {
          // Advance to next frame
          this.currentFrameIndex++;

          // Handle loop behavior
          if (this.currentFrameIndex >= this.frames.length) {
            if (this.config.loop) {
              this.currentFrameIndex = 0;
            } else {
              this.currentFrameIndex = this.frames.length - 1;
              this.pause();
              return;
            }
          }

          this.renderFrame(this.currentFrameIndex);
          this.lastFrameTime = currentTime - (elapsed % frameDuration);
        }

        this.animationFrameId = requestAnimationFrame(() => this.playbackLoop());
      }

      // Play animation
      play() {
        if (!this.isPlaying && this.loadedFrames === this.frames.length) {
          this.startPlayback();
        }
      }

      // Pause animation
      pause() {
        this.isPlaying = false;
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      }

      // Toggle play/pause
      toggle() {
        if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
      }

      // Set playback speed
      setSpeed(speed) {
        this.playbackSpeed = speed;
      }
    }`;
  }

  /**
   * Generate playback controls HTML and event handlers
   */
  private generateControlsCode(config: ExportConfig): string {
    if (!config.showControls) {
      return '';
    }

    return `
    <!-- Playback Controls -->
    <div id="controls">
      <button id="play-pause-btn">${config.autoplay ? 'Pause' : 'Play'}</button>
      <div class="speed-control">
        <label for="speed-slider">Speed:</label>
        <input type="range" id="speed-slider" min="0.25" max="2" step="0.25" value="${config.playbackSpeed}">
        <span class="speed-value" id="speed-value">${config.playbackSpeed}x</span>
      </div>
    </div>

    <script>
      // Control event handlers
      const playPauseBtn = document.getElementById('play-pause-btn');
      const speedSlider = document.getElementById('speed-slider');
      const speedValue = document.getElementById('speed-value');

      playPauseBtn.addEventListener('click', () => {
        player.toggle();
        playPauseBtn.textContent = player.isPlaying ? 'Pause' : 'Play';
      });

      speedSlider.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        player.setSpeed(speed);
        speedValue.textContent = speed + 'x';
      });
    </script>`;
  }

  /**
   * Generate complete HTML5 document structure
   */
  generateTemplate(frames: ProcessedFrame[], config: ExportConfig): string {
    // Determine canvas dimensions
    const canvasWidth = config.width || frames[0].width;
    const canvasHeight = config.height || frames[0].height;

    // Build configuration object for embedded code
    const embeddedConfig = {
      frameRate: config.frameRate,
      loop: config.loop,
      autoplay: config.autoplay,
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: config.backgroundColor,
      showControls: config.showControls,
      playbackSpeed: config.playbackSpeed
    };

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animation Export</title>
${this.generateStyles(config)}
  </head>
  <body>
    <div id="animation-container">
      <!-- Canvas element for animation rendering -->
      <canvas id="animation-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
${this.generateControlsCode(config)}
    </div>

    <script>
${this.embedFrameData(frames)}

    // Configuration
    const config = ${JSON.stringify(embeddedConfig, null, 6)};

${this.generatePlaybackCode(config)}

    // Initialize player
    const player = new AnimationPlayer(frames, config);
    </script>
  </body>
</html>`;
  }
}
