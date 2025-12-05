# Implementation Plan

- [x] 1. Set up project structure and install dependencies





  - Create directory structure for export utilities (`lib/export/`)
  - Install fast-check for property-based testing
  - Set up TypeScript interfaces and types
  - _Requirements: All_

- [x] 2. Implement Frame Processor




  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2.1 Create frame type definitions and interfaces

  - Define Frame, ProcessedFrame, FrameFormat interfaces
  - Create custom error classes (UnsupportedFrameFormatError, FrameEncodingError)
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 2.2 Implement format detection logic


  - Write detectFormat() function to identify frame data types
  - Handle data URLs, Canvas elements, Image elements, ImageData
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2.3 Implement frame validation

  - Write validateFrame() to check dimensions and format
  - Validate frame index and data integrity
  - _Requirements: 4.1, 4.5_

- [x] 2.4 Implement frame conversion to data URLs

  - Convert Canvas elements to data URLs using toDataURL()
  - Convert Image elements to data URLs via temporary canvas
  - Convert ImageData to data URLs via temporary canvas
  - Handle existing data URLs (pass through or validate)
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 2.5 Write property test for frame format acceptance


  - **Property 4: Frame format acceptance**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [x] 2.6 Write property test for unsupported format rejection

  - **Property 5: Unsupported format rejection**
  - **Validates: Requirements 4.5**

- [x] 3. Implement HTML Generator




  - _Requirements: 1.1, 1.3, 1.5, 2.3, 3.1, 3.4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3.1 Create export configuration interface and defaults


  - Define ExportConfig interface with all options
  - Implement default configuration values
  - _Requirements: 6.1_

- [x] 3.2 Implement frame data embedding

  - Write embedFrameData() to convert ProcessedFrame array to JavaScript array literal
  - Ensure proper escaping of special characters
  - _Requirements: 1.1, 5.2_


- [x] 3.3 Implement CSS generation

  - Write generateStyles() to create inline CSS for canvas and controls
  - Apply background color from configuration
  - Style playback controls (play/pause buttons, speed slider)
  - _Requirements: 5.1, 6.5_



- [x] 3.4 Implement animation playback code generation

  - Write generatePlaybackCode() to create AnimationPlayer class
  - Implement frame loading and caching logic
  - Implement requestAnimationFrame-based playback loop
  - Handle frame rate timing calculations
  - Implement loop behavior based on configuration
  - Implement autoplay behavior based on configuration
  - Add visibility API handling for tab inactive state
  - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 6.2, 6.3_




- [x] 3.5 Implement playback controls code generation

  - Generate play/pause button HTML and event handlers
  - Generate speed control slider HTML and event handlers
  - Conditionally include controls based on showControls config
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_






- [x] 3.6 Implement HTML template generation





  - Write generateTemplate() to create complete HTML5 document structure
  - Assemble all sections (styles, frame data, playback code, controls)
  - Set canvas dimensions from configuration or frame dimensions
  - Add code comments for readability
  - Ensure valid HTML5 markup


  - _Requirements: 5.1, 5.3, 5.4, 5.5, 6.4_




- [x] 3.7 Implement main generate() function





  - Orchestrate all generation steps
  - Validate configuration before generation
  - Handle generation errors with appropriate error types
  - _Requirements: 1.1, 1.5_

- [x] 3.8 Write property test for complete frame embedding


  - **Property 1: Complete frame embedding**

  - **Validates: Requirements 1.1**





- [x] 3.9 Write property test for self-contained output





  - **Property 2: Self-contained output**

  - **Validates: Requirements 1.5**






- [x] 3.10 Write property test for configuration-driven generation





  - **Property 3: Configuration-driven code generation**
  - **Validates: Requirements 1.3, 2.3, 3.1, 3.4, 6.1, 6.2, 6.3, 6.4, 6.5**





- [x] 3.11 Write property test for HTML structure consistency

  - **Property 6: HTML structure consistency**
  - **Validates: Requirements 5.1, 5.2**

- [x] 3.12 Write property test for canvas dimension matching

  - **Property 7: Canvas dimension matching**


  - **Validates: Requirements 5.4, 6.4**



- [x] 3.13 Write property test for valid HTML5 output





  - **Property 8: Valid HTML5 output**
  - **Validates: Requirements 5.5**

- [x] 4. Implement File Download Service





  - _Requirements: 7.3, 7.5_

- [x] 4.1 Create FileDownloadService class


  - Implement createBlob() to create Blob from HTML string
  - Implement calculateSize() to compute file size in bytes
  - Implement download() to trigger browser download
  - Generate appropriate filename with timestamp
  - _Requirements: 7.3, 7.5_

- [x] 4.2 Write property test for file size reporting


  - **Property 11: File size reporting**
  - **Validates: Requirements 7.5**

- [x] 5. Implement Export Orchestrator





  - _Requirements: 1.4, 7.1, 7.2, 7.3, 7.4_

- [x] 5.1 Create ExportOrchestrator class


  - Define ExportProgress and ExportResult interfaces
  - Implement progress callback mechanism
  - Implement cancellation support
  - _Requirements: 7.1, 7.2_

- [x] 5.2 Implement main export() workflow

  - Validate input frames
  - Process frames with progress updates (0-50%)
  - Generate HTML with progress updates (50-80%)
  - Calculate file size with progress update (80-90%)
  - Trigger download with progress update (90-100%)
  - Return ExportResult with success status and file info
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 5.3 Implement error handling

  - Catch and wrap errors from Frame Processor
  - Catch and wrap errors from HTML Generator
  - Catch and wrap errors from File Download Service
  - Report errors via progress callback and ExportResult
  - _Requirements: 7.4_

- [x] 5.4 Implement frame data optimization


  - Detect when total frame size exceeds threshold
  - Apply JPEG encoding for large frames
  - Apply quality reduction for optimization
  - Track optimization savings
  - _Requirements: 1.4_

- [x] 5.5 Write property test for progress reporting completeness


  - **Property 9: Progress reporting completeness**
  - **Validates: Requirements 7.1, 7.2, 7.3**

- [x] 5.6 Write property test for error reporting clarity

  - **Property 10: Error reporting clarity**
  - **Validates: Requirements 7.4**

- [x] 5.7 Write property test for frame data optimization

  - **Property 12: Frame data optimization**
  - **Validates: Requirements 1.4**

- [x] 6. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Create React UI Components





  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7.1 Create ExportButton component


  - Implement button with loading state
  - Wire up to ExportOrchestrator
  - Handle export start, complete, and error callbacks
  - Display basic export status
  - _Requirements: 7.1, 7.3_

- [x] 7.2 Create ExportConfigPanel component


  - Create form inputs for all configuration options
  - Implement frame rate slider (1-120 FPS)
  - Implement playback speed slider (0.25x-2.0x)
  - Implement toggle switches for loop, autoplay, showControls
  - Implement optional canvas dimension inputs
  - Implement background color picker
  - Validate and update configuration on change
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_


- [x] 7.3 Create ExportProgressDisplay component

  - Display current export stage
  - Display progress percentage with progress bar
  - Display progress message
  - Display estimated/actual file size
  - Implement cancel button
  - _Requirements: 7.1, 7.2, 7.5_


- [x] 7.4 Create error display component

  - Display error messages clearly
  - Provide retry option
  - Provide alternative download methods if applicable
  - _Requirements: 7.4_

- [x] 7.5 Integrate components into main application


  - Add export functionality to existing animation interface
  - Wire up frame data from animation state
  - Test end-to-end export flow
  - _Requirements: All_


- [x] 7.6 Write unit tests for React components

  - Test ExportButton rendering and interactions
  - Test ExportConfigPanel form validation
  - Test ExportProgressDisplay updates
  - Test error display component

- [x] 8. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
