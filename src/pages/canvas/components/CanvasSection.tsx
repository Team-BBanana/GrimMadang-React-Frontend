import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import canvasInstanceAtom from "@/pages/canvas/components/stateCanvasInstance";
import BannerSection from "@/pages/canvas/components/BannerSection.tsx";
import ColorPanel from "@/pages/canvas/components/ColorPanel.tsx";
import style from "../CanvasPage.module.css";
import BrushWidth from "./brushWidth";
import API from "@/api";

interface CanvasSectionProps {
  className?: string;
  onUpload: (dataURL: string, step: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onChange: () => void;
  feedbackData: any;
}

const CanvasSection = ({ className, onUpload, canvasRef, onChange, feedbackData}: CanvasSectionProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useAtom(canvasInstanceAtom);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [brushWidth, setBrushWidth] = useState(10);
  const [step, setStep] = useState(1);
  const [isPanelVisible, setIsPanelVisible] = useState(false);


  const [imageData, setImageData] = useState<any>(null);

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

    //애는 최초 여야함 
    // const fetchImageMetaData = async () => {
    //   try {
    //     const response = await API.canvasApi.ImagemetaData({ sessionId: "your_session_id", topic: "your_topic" });
    //     setImageData(response.data);
    //   } catch (error) {
    //     console.error('Error fetching image metadata:', error);
    //   }
    // };

    // fetchImageMetaData();
    // Set mock image data


    setImageData({
      title: "Banana",
      description: "A banana is an elongated, edible fruit produced by several kinds of large herbaceous flowering plants in the genus Musa."
    });

    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, setCanvas]);

  useEffect(() => {
    if (feedbackData) {
      setIsPanelVisible(true);
      console.log("feedbackData", feedbackData); // Feedback API가 호출된 후 패널을 표시
    }
  }, [feedbackData]);

  const saveCanvasAsImage = async () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0
    });

    if (step === 1) {
      await onUpload(dataURL, step);

      setStep(5);

    } else if (step === 5) {

      setIsPanelVisible(false);
      setStep(2);

    } else if (step === 2) {

      await onUpload(dataURL, step);
      setStep(3);

    } else if (step === 3) {

      await handleFinalSave();

    }
  };


  const handleFinalSave = async () => {
    console.log("Final save to API");
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
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      setPanelPosition({ x: newX, y: newY });
    }
  };

  const handleChange = () => {
    onChange();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handleChange();
  };

  return (
    <div className={className} ref={canvasContainerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <BannerSection onSave={saveCanvasAsImage} step={step} />
      
      <canvas ref={canvasRef} className={style.canvasContainer} onTouchEnd={handleChange} id="mycanvas" />
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

      {imageData && (
        <div className={style.imageData}>
          <h3>{imageData.title}</h3>
          <p>{imageData.description}</p>
        </div>
      )}

      {isPanelVisible && (
        <div className={`${style.slidePanel} ${isPanelVisible ? style.visible : style.hidden}`}>
                {feedbackData && (
                  <div style={{ position: 'absolute', top: '60px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                    <h3>{feedbackData.title}</h3>
                    <p>{feedbackData.description}</p>
                  </div>
                )}
        </div>
      )}
    </div>
  );
};

export default CanvasSection;