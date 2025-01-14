import { fabric } from "fabric";
import { useEffect, useState } from "react";
import { useAtomValue, useAtom } from "jotai";
import { HexColorPicker } from "react-colorful";
import canvasInstanceAtom from "@/pages/canvas/components/stateCanvasInstance";
import colorAtom from "@/store/atoms/canvas/colorAtom";

interface ColorPanelProps {
  className: string;
}

function ColorPanel({ className }: ColorPanelProps) {
  const canvas = useAtomValue(canvasInstanceAtom);
  const [color, setColor] = useAtom(colorAtom);

  useEffect(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.freeDrawingBrush.color = color;
  }, [canvas, color]);

  return (
    <div className={`${className} bg-white rounded-lg shadow-lg p-3 flex flex-col items-center gap-2`} data-tool="colorPanel">
        <HexColorPicker color={color} onChange={setColor} />
        <div 
          className="w-10 h-10 rounded-full border-2 border-gray-200"
          style={{ backgroundColor: color }}
        />
    </div>
  );
};

export default ColorPanel;
