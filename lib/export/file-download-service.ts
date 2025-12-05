/**
 * File Download Service
 * Handles browser file download operations
 */

import { BlobCreationError, DownloadBlockedError } from './errors';

/**
 * Service for creating and downloading files in the browser
 */
export class FileDownloadService {
  /**
   * Creates a Blob from HTML string
   * @param content - HTML content as string
   * @param mimeType - MIME type for the blob (default: 'text/html')
   * @returns Blob object
   * @throws BlobCreationError if blob creation fails
   */
  createBlob(content: string, mimeType: string = 'text/html'): Blob {
    try {
      return new Blob([content], { type: mimeType });
    } catch (error) {
      throw new BlobCreationError(
        `Failed to create blob: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Calculates the size of content in bytes
   * @param content - String content to measure
   * @returns Size in bytes
   */
  calculateSize(content: string): number {
    // Use TextEncoder to get accurate byte size (handles UTF-8 encoding)
    const encoder = new TextEncoder();
    return encoder.encode(content).length;
  }

  /**
   * Triggers a browser download of the content
   * @param content - HTML content to download
   * @param fileName - Name for the downloaded file (optional, will generate if not provided)
   * @param mimeType - MIME type (default: 'text/html')
   * @throws BlobCreationError if blob creation fails
   * @throws DownloadBlockedError if download is blocked by browser
   */
  download(content: string, fileName?: string, mimeType: string = 'text/html'): void {
    try {
      // Create blob from content
      const blob = this.createBlob(content, mimeType);
      
      // Generate filename with timestamp if not provided
      const finalFileName = fileName || this.generateFileName();
      
      // Create object URL
      const url = URL.createObjectURL(blob);
      
      // Create temporary anchor element
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = finalFileName;
      anchor.style.display = 'none';
      
      // Append to body, click, and remove
      document.body.appendChild(anchor);
      anchor.click();
      
      // Clean up
      document.body.removeChild(anchor);
      
      // Revoke object URL after a short delay to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      if (error instanceof BlobCreationError) {
        throw error;
      }
      throw new DownloadBlockedError(
        `Browser blocked file download: ${error instanceof Error ? error.message : 'Unknown error'}. Please check popup blocker settings.`
      );
    }
  }

  /**
   * Generates a filename with timestamp
   * @returns Filename string in format: animation-export-YYYYMMDD-HHMMSS.html
   */
  private generateFileName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `animation-export-${year}${month}${day}-${hours}${minutes}${seconds}.html`;
  }
}
