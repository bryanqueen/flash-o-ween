# Design Document: Animation Export Feature

## Overview

The Animation Export feature enables users to export animation frames as standalone HTML5 Canvas files. The system will convert a sequence of frames into a single, self-contained HTML document that includes embedded frame data, playback logic, and user controls. The exported file will function independently without external dependencies, making it ideal for sharing animations across different platforms.

The implementation will integrate with the existing Next.js/React application and leverage TypeScript for type safety. The export process will handle frame encoding, HTML generation, and file download orchestration.

## Architecture

The system follows a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    React UI Layer                        │
│  (Export Button, Progress Display, Configuration Form)  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Export Orchestrator                         │
│  (Coordinates export process, manages state)            │
└────────┬────────────────────────────┬───────────────────┘
         │                            │
         ▼                            ▼
┌──────────────────────┐    ┌──────────────────────────┐
│  Frame Processor     │    │  HTML Generator          │
│  - Format detection  │    │  - Template rendering    │
│  - Image encoding    │    │  - Code generation       │
│  - Data optimization │    │  - Minification          │
└──────────────────────┘    └────────────┬─────────────┘
                                         │
                                         ▼
                            ┌──────────────────────────┐
                            │  File Download Service   │
                            │  - Blob creation         │
                            │  - Browser download      │
                            └──────────────────────────┘
```

The generated HTML file will have this internal structure:

```
┌─────────────────────────────────────────┐
│         Standalone HTML File            │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  HTML Structure & Styles          │ │
│  │  - Canvas element                 │ │
│  │  - Control buttons                │ │
│  │  - Inline CSS                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Embedded Frame Data              │ │
│  │  - Base64 encoded images          │ │
│  │  - Frame metadata                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Animation Engine (JavaScript)    │ │
│  │  - Frame loader                   │ │
│  │  - Playback controller            │ │
│  │  - Canvas renderer                │ │
│  │  - Event handlers                 │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Frame Processor

**Purpose:** Handles frame format detection, conversion, and encoding.

**Interface:**
```typescript
interface Frame {
  data: string | HTMLCanvasElement | HTMLImageElement | ImageData;
  width: number;
  height: number;
  index: number;
}

interface ProcessedFrame {
  dataUrl: string;  // base64 encoded image
  width: number;
  height: number;
  index: number;
}

interface FrameProcessor {
  processFrame(frame: Frame): Promise<ProcessedFrame>;
  processFrames(frames: Frame[]): Promise<ProcessedFrame[]>;
  detectFormat(data: any): FrameFormat;
  validateFrame(frame: Frame): boolean;
}

enum FrameFormat {
  DATA_URL = 'data_url',
  CANVAS = 'canvas',
  IMAGE_ELEMENT = 'image_element',
  IMAGE_DATA = 'image_data',
  UNKNOWN = 'unknown'
}
```

**Responsibilities:**
- Detect input frame format (canvas, image element, data URL, ImageData)
- Convert frames to base64-encoded data URLs
- Validate frame dimensions and format compatibility
- Optimize image encoding (PNG for quality, JPEG for size)

### 2. HTML Generator

**Purpose:** Generates the standalone HTML file with embedded animation code.

**Interface:**
```typescript
interface ExportConfig {
  frameRate: number;           // FPS (default: 30)
  loop: boolean;               // Loop animation (default: true)
  autoplay: boolean;           // Start automatically (default: true)
  width?: number;              // Canvas width (default: frame width)
  height?: number;             // Canvas height (default: frame height)
  backgroundColor?: string;    // Canvas background (default: transparent)
  showControls: boolean;       // Display playback controls (default: true)
  playbackSpeed: number;       // Speed multiplier (default: 1.0)
}

interface HTMLGenerator {
  generate(frames: ProcessedFrame[], config: ExportConfig): string;
  generateTemplate(): string;
  embedFrameData(frames: ProcessedFrame[]): string;
  generatePlaybackCode(config: ExportConfig): string;
  generateStyles(config: ExportConfig): string;
}
```

**Responsibilities:**
- Generate valid HTML5 markup structure
- Embed frame data as JavaScript array
- Generate animation playback logic
- Create inline CSS for styling
- Add playback control UI elements
- Include comments for code readability

### 3. Export Orchestrator

**Purpose:** Coordinates the export process and manages state.

**Interface:**
```typescript
interface ExportProgress {
  stage: 'processing' | 'generating' | 'downloading' | 'complete' | 'error';
  percentage: number;
  message: string;
  fileSize?: number;
}

interface ExportResult {
  success: boolean;
  fileName: string;
  fileSize: number;
  error?: string;
}

interface ExportOrchestrator {
  export(frames: Frame[], config: ExportConfig): Promise<ExportResult>;
  onProgress(callback: (progress: ExportProgress) => void): void;
  cancel(): void;
}
```

**Responsibilities:**
- Orchestrate the export workflow
- Report progress updates
- Handle errors and validation
- Calculate file size
- Trigger file download

### 4. File Download Service

**Purpose:** Handles browser file download.

**Interface:**
```typescript
interface FileDownloadService {
  download(content: string, fileName: string, mimeType: string): void;
  createBlob(content: string, mimeType: string): Blob;
  calculateSize(content: string): number;
}
```

**Responsibilities:**
- Create Blob from HTML content
- Trigger browser download
- Calculate file size
- Generate appropriate filename

### 5. React UI Components

**ExportButton Component:**
```typescript
interface ExportButtonProps {
  frames: Frame[];
  config?: Partial<ExportConfig>;
  onExportStart?: () => void;
  onExportComplete?: (result: ExportResult) => void;
  onExportError?: (error: string) => void;
}
```

**ExportConfigPanel Component:**
```typescript
interface ExportConfigPanelProps {
  config: ExportConfig;
  onChange: (config: ExportConfig) => void;
}
```

**ExportProgressDisplay Component:**
```typescript
interface ExportProgressDisplayProps {
  progress: ExportProgress;
  onCancel?: () => void;
}
```

## Data Models

### Frame Data Structure

Frames are represented as objects containing image data and metadata:

```typescript
interface Frame {
  data: string | HTMLCanvasElement | HTMLImageElement | ImageData;
  width: number;
  height: number;
  index: number;
}
```

### Processed Frame Structure

After processing, frames are normalized to a consistent format:

```typescript
interface ProcessedFrame {
  dataUrl: string;  // "data:image/png;base64,..."
  width: number;
  height: number;
  index: number;
}
```

### Export Configuration

User-configurable options for the export:

```typescript
interface ExportConfig {
  frameRate: number;           // 1-120 FPS
  loop: boolean;
  autoplay: boolean;
  width?: number;
  height?: number;
  backgroundColor?: string;    // CSS color value
  showControls: boolean;
  playbackSpeed: number;       // 0.25-2.0
}
```

### Generated HTML Structure

The generated HTML follows this template structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animation Export</title>
  <style>
    /* Inline CSS for canvas and controls */
  </style>
</head>
<body>
  <div id="animation-container">
    <canvas id="animation-canvas"></canvas>
    <div id="controls">
      <!-- Play/Pause buttons, speed control -->
    </div>
  </div>
  
  <script>
    // Frame data array
    const frames = [/* base64 encoded images */];
    
    // Configuration
    const config = {/* export settings */};
    
    // Animation engine
    class AnimationPlayer {
      // Playback logic
    }
    
    // Initialize and start
    const player = new AnimationPlayer(frames, config);
  </script>
</body>
</html>
```

## Correc
tness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After reviewing the acceptance criteria, several can be consolidated to eliminate redundancy. Properties about generated code containing specific elements (autoplay, loop, controls) can be combined into configuration-driven generation properties. Properties about runtime behavior verification can be grouped as they all test that generated code includes necessary logic.

### Property 1: Complete frame embedding
*For any* collection of valid frames, the generated HTML SHALL contain data for all frames in the collection with no frames missing or duplicated.
**Validates: Requirements 1.1**

### Property 2: Self-contained output
*For any* generated HTML file, parsing the document SHALL reveal no external dependencies (no external script sources, stylesheets, or image URLs).
**Validates: Requirements 1.5**

### Property 3: Configuration-driven code generation
*For any* export configuration, the generated HTML SHALL include code and elements that match the configuration settings (autoplay behavior, loop behavior, control visibility, canvas dimensions, background color).
**Validates: Requirements 1.3, 2.3, 3.1, 3.4, 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 4: Frame format acceptance
*For any* frame provided in a supported format (PNG data URL, JPEG data URL, WebP data URL, Canvas element, ImageData), the frame processor SHALL successfully convert it to a base64-encoded data URL.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 5: Unsupported format rejection
*For any* frame in an unsupported format, the frame processor SHALL reject the frame and throw an error with a descriptive message.
**Validates: Requirements 4.5**

### Property 6: HTML structure consistency
*For any* generated HTML, parsing the document SHALL reveal distinct sections for styles (style tag), frame data (script with frames array), and animation logic (script with player class).
**Validates: Requirements 5.1, 5.2**

### Property 7: Canvas dimension matching
*For any* set of frames with consistent dimensions, when no custom dimensions are specified, the generated canvas element SHALL have width and height attributes matching the frame dimensions.
**Validates: Requirements 5.4, 6.4**

### Property 8: Valid HTML5 output
*For any* generated HTML, validating the markup against HTML5 standards SHALL pass without errors.
**Validates: Requirements 5.5**

### Property 9: Progress reporting completeness
*For any* export operation, the progress callbacks SHALL be invoked with stages in order (processing → generating → downloading → complete) and percentage values SHALL increase monotonically from 0 to 100.
**Validates: Requirements 7.1, 7.2, 7.3**

### Property 10: Error reporting clarity
*For any* export operation that fails, the error result SHALL contain a non-empty error message describing the failure cause.
**Validates: Requirements 7.4**

### Property 11: File size reporting
*For any* successful export, the result SHALL include the calculated file size in bytes.
**Validates: Requirements 7.5**

### Property 12: Frame data optimization
*For any* collection of frames exceeding a size threshold, the generated HTML file size SHALL be smaller than the sum of unoptimized frame sizes.
**Validates: Requirements 1.4**

## Error Handling

The system will implement comprehensive error handling at each layer:

### Frame Processing Errors

**Invalid Frame Format:**
- Error: `UnsupportedFrameFormatError`
- Message: "Frame at index {n} has unsupported format. Supported formats: PNG, JPEG, WebP data URLs, Canvas elements, ImageData"
- Recovery: Reject the frame, report error to user

**Frame Dimension Mismatch:**
- Error: `FrameDimensionMismatchError`
- Message: "Frame at index {n} has dimensions {w}x{h}, expected {expectedW}x{expectedH}"
- Recovery: Either reject the frame or resize to match (based on configuration)

**Encoding Failure:**
- Error: `FrameEncodingError`
- Message: "Failed to encode frame at index {n}: {reason}"
- Recovery: Retry with different encoding format, or skip frame with warning

### HTML Generation Errors

**Template Rendering Failure:**
- Error: `TemplateRenderError`
- Message: "Failed to generate HTML template: {reason}"
- Recovery: Log error, attempt with fallback template

**Invalid Configuration:**
- Error: `InvalidConfigError`
- Message: "Invalid export configuration: {field} must be {constraint}"
- Recovery: Use default values for invalid fields, warn user

### File Download Errors

**Blob Creation Failure:**
- Error: `BlobCreationError`
- Message: "Failed to create downloadable file: {reason}"
- Recovery: Retry once, then report error to user

**Browser Download Blocked:**
- Error: `DownloadBlockedError`
- Message: "Browser blocked file download. Please check popup blocker settings."
- Recovery: Provide alternative download method (copy to clipboard, display in new tab)

### General Error Handling Strategy

1. **Validation First:** Validate all inputs before processing
2. **Fail Fast:** Detect errors early in the pipeline
3. **Clear Messages:** Provide actionable error messages with context
4. **Graceful Degradation:** Use fallbacks where possible
5. **User Feedback:** Always inform user of errors with recovery options
6. **Logging:** Log all errors for debugging purposes

## Testing Strategy

The animation export feature will be tested using a dual approach combining unit tests and property-based tests to ensure comprehensive coverage.

### Unit Testing Approach

Unit tests will verify specific examples, edge cases, and integration points:

**Frame Processor Tests:**
- Test conversion of each supported format (PNG, JPEG, WebP, Canvas, ImageData)
- Test handling of empty frame arrays
- Test handling of single-frame animations
- Test error handling for unsupported formats

**HTML Generator Tests:**
- Test generation with default configuration
- Test generation with custom configuration values
- Test proper escaping of special characters in embedded data
- Test HTML structure contains required elements

**Export Orchestrator Tests:**
- Test successful export flow
- Test progress callback invocation
- Test error propagation
- Test cancellation handling

**File Download Service Tests:**
- Test blob creation from HTML string
- Test file size calculation accuracy
- Test filename generation

### Property-Based Testing Approach

Property-based tests will verify universal properties across many randomly generated inputs. We will use **fast-check** as the property-based testing library for TypeScript/JavaScript.

**Configuration:**
- Each property-based test MUST run a minimum of 100 iterations
- Each test MUST be tagged with a comment referencing the correctness property from this design document
- Tag format: `// Feature: animation-export, Property {number}: {property_text}`

**Property Test Cases:**

1. **Complete Frame Embedding Property**
   - Generate: Random arrays of frames (varying lengths, dimensions, formats)
   - Test: All frames appear in generated HTML, no duplicates
   - Tag: `// Feature: animation-export, Property 1: Complete frame embedding`

2. **Self-Contained Output Property**
   - Generate: Random frame collections and configurations
   - Test: Generated HTML contains no external URLs
   - Tag: `// Feature: animation-export, Property 2: Self-contained output`

3. **Configuration-Driven Generation Property**
   - Generate: Random export configurations
   - Test: Generated HTML reflects all configuration settings
   - Tag: `// Feature: animation-export, Property 3: Configuration-driven code generation`

4. **Frame Format Acceptance Property**
   - Generate: Frames in all supported formats
   - Test: All are successfully processed
   - Tag: `// Feature: animation-export, Property 4: Frame format acceptance`

5. **Unsupported Format Rejection Property**
   - Generate: Invalid frame formats
   - Test: All are rejected with errors
   - Tag: `// Feature: animation-export, Property 5: Unsupported format rejection`

6. **HTML Structure Consistency Property**
   - Generate: Random frame and configuration combinations
   - Test: Generated HTML has required sections
   - Tag: `// Feature: animation-export, Property 6: HTML structure consistency`

7. **Canvas Dimension Matching Property**
   - Generate: Frames with various dimensions
   - Test: Canvas dimensions match frame dimensions
   - Tag: `// Feature: animation-export, Property 7: Canvas dimension matching`

8. **Valid HTML5 Output Property**
   - Generate: Random valid inputs
   - Test: Generated HTML passes HTML5 validation
   - Tag: `// Feature: animation-export, Property 8: Valid HTML5 output`

9. **Progress Reporting Completeness Property**
   - Generate: Random frame collections
   - Test: Progress callbacks follow correct sequence and monotonic increase
   - Tag: `// Feature: animation-export, Property 9: Progress reporting completeness`

10. **Error Reporting Clarity Property**
    - Generate: Inputs that trigger various errors
    - Test: All errors include descriptive messages
    - Tag: `// Feature: animation-export, Property 10: Error reporting clarity`

11. **File Size Reporting Property**
    - Generate: Random valid inputs
    - Test: Result includes accurate file size
    - Tag: `// Feature: animation-export, Property 11: File size reporting`

12. **Frame Data Optimization Property**
    - Generate: Large frame collections
    - Test: Output size is smaller than unoptimized total
    - Tag: `// Feature: animation-export, Property 12: Frame data optimization`

### Test Utilities

**Frame Generators:**
- `generateRandomFrame()`: Creates frames with random dimensions and data
- `generateFrameSequence(count)`: Creates sequence of related frames
- `generateCanvasFrame()`: Creates HTMLCanvasElement with test pattern
- `generateDataURLFrame(format)`: Creates data URL in specified format

**Assertion Helpers:**
- `assertHTMLContainsFrames(html, frames)`: Verifies all frames are embedded
- `assertNoExternalDependencies(html)`: Checks for external URLs
- `assertValidHTML5(html)`: Validates HTML5 compliance
- `assertConfigurationApplied(html, config)`: Verifies config in generated code

### Integration Testing

While the focus is on unit and property tests, key integration points should be verified:

- End-to-end export flow with real frame data
- Browser download functionality (may require manual testing)
- Generated HTML playback in actual browser environment

### Test Coverage Goals

- Minimum 90% code coverage for core export logic
- 100% coverage of error handling paths
- All 12 correctness properties implemented as property-based tests
- All edge cases covered by unit tests
