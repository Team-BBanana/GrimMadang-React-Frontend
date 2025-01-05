
import { fabric } from "fabric";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import canvasInstanceAtom from "./stateCanvasInstance";
import ColorButton, { PenColorTypes, COLOR_CODE } from "./ColorButton";

interface ColorPanelProps {
  className: string;
}

const COLORS: PenColorTypes[] = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "black"];

const ColorPanel: React.FC<ColorPanelProps> = ({ className }) => {
  const canvas = useAtomValue(canvasInstanceAtom);
  const [penColor, setPenColor] = useState<PenColorTypes>("black");

  useEffect(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.freeDrawingBrush.color = COLOR_CODE[penColor];
  }, [canvas, penColor]);

  return (
      <div className="fixed bottom-0 left-0 w-full flex justify-center items-center p-4 z-50">
        <div className={`${className} bg-white rounded-full shadow-lg p-3 flex gap-2`}>
          {COLORS.map((color) => (
              <ColorButton
                  key={color}
                  color={color}
                  penColor={penColor}
                  setPenColor={setPenColor}
              />
          ))}
        </div>
      </div>
  );
};

export default ColorPanel;
