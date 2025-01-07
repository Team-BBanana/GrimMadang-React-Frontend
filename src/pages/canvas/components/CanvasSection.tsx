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
}

interface feedBackData {
  sessionId: string;
  name: string;
  topic: string;
  phase: number;
  imageData: string;
}

const CanvasSection = ({ className, onUpload, canvasRef, onChange }: CanvasSectionProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useAtom(canvasInstanceAtom);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [brushWidth, setBrushWidth] = useState(10);
  const [step, setStep] = useState(1);
  const [isPanelVisible, setIsPanelVisible] = useState(false);


  const [imageData, setImageData] = useState<any>(null);

  const [FeedBackData, setFeedBackData] = useState<any>(null);

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


    setFeedBackData({
      title: "피드백",
      description: "그림에서 바나나의 형태가 잘 드러나도록 곡선을 자연스럽게 표현하신 점이 인상적입니다. 특히 밝고 생동감 있는 노란색은 바나나의 신선함과 활기를 잘 전달하고 있어요.(개선점 제안) 주제를 바나나로 더 명확하게 표현하려면 다음을 고려해 보세요 끝부분 디테일: 바나나의 양 끝부분(꼭지와 끝부분)을 약간 어둡게 처리하면 실제 바나나의 느낌을 더 살릴 수 있을 것 같습니다."
    });

    setImageData({
      title: "Banana",
      description: "A banana is an elongated, edible fruit produced by several kinds of large herbaceous flowering plants in the genus Musa."
    });

    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, setCanvas]);

  const saveCanvasAsImage = async () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0
    });

    if (step === 1) {
      await onUpload(dataURL, step);
      setStep(5);
      await handleFeedbackAPI();
      setIsPanelVisible(true); // Call feedback API after upload
    } else if (step === 5) {
      setIsPanelVisible(false);
      setStep(2);
    } else if (step === 2) {
      await onUpload(dataURL, step);
      setIsPanelVisible(true);
      setStep(3);
      await handleFeedbackAPI(); // Call feedback API after upload
    } else if (step === 3) {
      await handleFinalSave();
    }
  };

  const handleFeedbackAPI = async () => {
    const feedbackData: FeedbackData = {
      sessionId: "your_session_id",
      name: "User Name",
      topic: "Banana",
      phase: step,
      imageData: "data:image/png;base64," + canvas.toDataURL() // Example of image data
    };

    try {
      const response = await API.canvasApi.feedBack(feedbackData); // Call the feedback API
      setFeedBackData(response.data); // Store the response in state
      console.log("Feedback received:", response.data);
    } catch (error) {
      console.error("Error sending feedback:", error);
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
        <div style={{ position: 'absolute', top: '60px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
          <h3>{imageData.title}</h3>
          <p>{imageData.description}</p>
        </div>
      )}

      {isPanelVisible && (
        <div className={`${style.slidePanel} ${isPanelVisible ? style.visible : style.hidden}`}>
                {FeedBackData && (
                  <div style={{ position: 'absolute', top: '60px', right: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                    <h3>{FeedBackData.title}</h3>
                    <p>{FeedBackData.description}</p>
                  </div>
                )}
        </div>
      )}
    </div>
  );
};

export default CanvasSection;