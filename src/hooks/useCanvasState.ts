import { useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { fabric } from 'fabric';
import canvasInstanceAtom from "@/pages/canvas/components/stateCanvasInstance";

interface CanvasState {
  canvas: fabric.Canvas | null;
  isDragging: boolean;
  offset: { x: number; y: number };
  panelPosition: { x: number; y: number };
  brushWidth: number;
}

export const useCanvasState = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [canvas, setCanvas] = useAtom(canvasInstanceAtom);
  const [isDragging, setIsDragging] = useState(true);
  const [offset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [brushWidth] = useState(10);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      setPanelPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = (handleChange: () => void) => {
    setIsDragging(false);
    handleChange();
  };

  return {
    canvas,
    setCanvas,
    isDragging,
    setIsDragging,
    offset,
    panelPosition,
    setPanelPosition,
    brushWidth,
    canvasContainerRef,
    handleMouseMove,
    handleMouseUp
  };
}; 