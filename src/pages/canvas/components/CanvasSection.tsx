import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import canvasInstanceAtom from "@/pages/canvas/components/stateCanvasInstance";
import BannerSection from "@/pages/canvas/components/BannerSection.tsx";
import style from "../CanvasPage.module.css";
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
  const [step, setStep] = useState(1);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [brushWidth, setBrushWidth] = useState(10);

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

    // 애는 최초 여야함 
    const fetchImageMetaData = async () => {
      try {
        const response = await API.canvasApi.ImagemetaData({ sessionId: "your_session_id", topic: "your_topic" });
        setImageData(response.data);
      } catch (error) {
        console.error('Error fetching image metadata:', error);
      }
    };

    fetchImageMetaData();


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

    // 캔버스의 모든 객체를 가져옵니다.
    const objects = canvas.getObjects();
    if (objects.length === 0) return;

    // 경계 상자를 수동으로 계산합니다.
    const boundingBox = objects.reduce((acc, obj) => {
        const objBoundingBox = obj.getBoundingRect();
        return {
            left: Math.min(acc.left, objBoundingBox.left),
            top: Math.min(acc.top, objBoundingBox.top),
            right: Math.max(acc.right, objBoundingBox.left + objBoundingBox.width),
            bottom: Math.max(acc.bottom, objBoundingBox.top + objBoundingBox.height),
        };
    }, {
        left: Infinity,
        top: Infinity,
        right: -Infinity,
        bottom: -Infinity,
    });

    const rect = new fabric.Rect({
        left: boundingBox.left - 50, // 왼쪽 마진
        top: boundingBox.top - 50, // 위쪽 마진
        width: (boundingBox.right - boundingBox.left) + 100, // 오른쪽 마진 + 왼쪽 마진
        height: (boundingBox.bottom - boundingBox.top) + 100, // 아래쪽 마진 + 위쪽 마진
        strokeWidth: 2,
        fill: 'transparent', // 사각형 내부 색상
    });

    canvas.add(rect); // 캔버스에 사각형 추가
    canvas.renderAll(); // 캔버스를 다시 렌더링

    // 빨간색 박스의 크기로 이미지를 저장합니다.
    const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
        left: boundingBox.left - 50,
        top: boundingBox.top - 50,
        width: (boundingBox.right - boundingBox.left) + 100,
        height: (boundingBox.bottom - boundingBox.top) + 100,
    });


    if (step === 1) {
        await onUpload(dataURL, step);
        setStep(5);
    } else if (step === 5) {
        setIsPanelVisible(false);
        setStep(2);
        canvas.clear(); // 캔버스 초기화
    } else if (step === 2) {
        await onUpload(dataURL, step);
        setStep(3);
    } else if (step === 3) {
        await handleFinalSave();
    }

    // 사각형을 캔버스에서 제거합니다.
    canvas.remove(rect);
    canvas.renderAll(); // 캔버스를 다시 렌더링
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
    <div className={style.canvasContainer} ref={canvasContainerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <BannerSection onSave={saveCanvasAsImage} step={step} />
        <canvas ref={canvasRef} className={style.canvas} onTouchEnd={handleChange} id="mycanvas"/>
        {imageData && (
          <div className={style.imageData}>
            <h3>{imageData.title}</h3>
            <p>{imageData.description}</p>
          </div>
        )}
      {isPanelVisible && (
        <div className={`${style.slidePanel} ${isPanelVisible ? style.visible : style.hidden}`}>
                {feedbackData && (
                  <div className={style.feedback}>
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