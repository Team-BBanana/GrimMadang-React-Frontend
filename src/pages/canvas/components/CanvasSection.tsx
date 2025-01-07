import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";

import canvasInstanceAtom from "@/pages/canvas/components/stateCanvasInstance";
import BannerSection from "@/pages/canvas/components/BannerSection.tsx";
import ColorPanel from "@/pages/canvas/components/ColorPanel.tsx";
import style from "../CanvasPage.module.css";
import BrushWidth from "./brushWidth";

interface CanvasSectionProps {
  className?: string;
  onUpload: (dataURL: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onChange: () => void;
}

const CanvasSection = ({ className, onUpload, canvasRef, onChange }: CanvasSectionProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useAtom(canvasInstanceAtom);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 }); 
  const [brushWidth, setBrushWidth] = useState(10);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  useEffect(() => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.outerWidth,
      height: window.outerHeight,
      backgroundColor: "transparent"
    });

    setCanvas(newCanvas);

    newCanvas.freeDrawingBrush.width = brushWidth;
    newCanvas.isDrawingMode = true;
    newCanvas.renderAll();

    const handleResize = () => {
      newCanvas.setWidth(window.innerWidth);
      newCanvas.setHeight(window.innerHeight);
      newCanvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    // 팔레트의 초기 위치 설정 (좌측 중앙)
    setPanelPosition({ x: 30, y: 150 });

    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, setCanvas]);

  const saveCanvasAsImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0
    });
    onUpload(dataURL);
  };

  const handleBrushWidthChange = (width: number) => {
    setBrushWidth(width);
    if (canvas) {
      canvas.freeDrawingBrush.width = width;
      canvas.renderAll();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const colorPanel = document.getElementById("color-panel");
    if (colorPanel) {
      const rect = colorPanel.getBoundingClientRect();
      setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - offset.x; // 클릭한 위치를 기준으로 X 좌표 계산
      const newY = e.clientY - offset.y; // 클릭한 위치를 기준으로 Y 좌표 계산
      setPanelPosition({ x: newX, y: newY }); // 팔레트의 위치 상태 업데이트
    }
  };
  
  const handleChange = () => {
    onChange();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handleChange();
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className={className} ref={canvasContainerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <BannerSection onSave={() => { saveCanvasAsImage(); togglePanel(); }} />
      <canvas ref={canvasRef} className={style.canvasContainer} onTouchEnd={handleChange} id="mycanvas"/>
      <div
        id="color-panel"
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsDragging(false)}
        style={{ 
          cursor: isDragging ? "grabbing" : "grab", 
          position: "absolute", 
          top: `${panelPosition.y}px`,
          left: `${panelPosition.x}px`,
        }}
      >
        <ColorPanel className={style.colorPanel} />
      </div>
      <div className={style.keyword}>
        그리기 키워드
      </div>
      <div>
        <BrushWidth 
          brushWidth={brushWidth} 
          onChange={handleBrushWidthChange} 
        />
      </div>

      <div className={`${style.slidePanel} ${isPanelVisible ? style.visible : style.hidden}`}>
      </div>
    </div>
  );
};

export default CanvasSection;