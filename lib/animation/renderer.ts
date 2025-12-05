/**
 * Animation Renderer - Applies generated animations to Fabric canvas
 */

import { Canvas, FabricText } from 'fabric';
import { GeneratedFrame, CanvasObject } from './types';

export class AnimationRenderer {
  /**
   * Apply generated animation frames to canvas frames
   */
  async applyToCanvas(
    fabricCanvas: Canvas,
    generatedFrames: GeneratedFrame[],
    startFrameIndex: number,
    existingFrames: any[]
  ): Promise<any[]> {
    const updatedFrames = [...existingFrames];
    
    // Ensure we have enough frames
    while (updatedFrames.length < startFrameIndex + generatedFrames.length) {
      updatedFrames.push({
        id: updatedFrames.length,
        thumbnail: '',
        data: ''
      });
    }
    
    // Create temporary canvas for rendering
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = fabricCanvas.width;
    tempCanvas.height = fabricCanvas.height;
    
    const tempFabricCanvas = new Canvas(tempCanvas, {
      width: fabricCanvas.width,
      height: fabricCanvas.height,
      backgroundColor: '#1a1a1a'
    });
    
    // Render each frame
    for (let i = 0; i < generatedFrames.length; i++) {
      const frameIndex = startFrameIndex + i;
      const generatedFrame = generatedFrames[i];
      
      // Clear canvas
      tempFabricCanvas.clear();
      tempFabricCanvas.backgroundColor = '#1a1a1a';
      
      // Load existing frame data if any
      if (updatedFrames[frameIndex]?.data) {
        try {
          await tempFabricCanvas.loadFromJSON(updatedFrames[frameIndex].data);
        } catch (e) {
          // If loading fails, start with empty canvas
          tempFabricCanvas.clear();
          tempFabricCanvas.backgroundColor = '#1a1a1a';
        }
      }
      
      // Add generated objects
      for (const obj of generatedFrame.objects) {
        const fabricObj = this.createFabricObject(obj);
        if (fabricObj) {
          tempFabricCanvas.add(fabricObj);
        }
      }
      
      // Render and save
      tempFabricCanvas.renderAll();
      
      // Small delay to ensure rendering completes
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const json = JSON.stringify(tempFabricCanvas.toJSON());
      const thumbnail = tempCanvas.toDataURL('image/png', 0.3);
      
      updatedFrames[frameIndex] = {
        id: frameIndex,
        data: json,
        thumbnail: thumbnail
      };
    }
    
    // Cleanup
    tempFabricCanvas.dispose();
    
    return updatedFrames;
  }
  
  /**
   * Create a Fabric object from a canvas object definition
   */
  private createFabricObject(obj: CanvasObject): any {
    const baseProps = {
      left: obj.x,
      top: obj.y,
      selectable: true,
      hasControls: true
    };
    
    if (obj.type === 'text' || obj.type === 'emoji') {
      const text = new FabricText(obj.content, {
        ...baseProps,
        fontSize: obj.fontSize,
        fill: obj.color || '#ffffff',
        angle: obj.rotation || 0,
        scaleX: obj.scale || 1,
        scaleY: obj.scale || 1,
        opacity: obj.opacity ?? 1
      });
      
      return text;
    }
    
    return null;
  }
}
