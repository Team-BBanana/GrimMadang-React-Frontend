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
  onFinalSave?: () => void;
}

const CanvasSection = ({ onUpload, canvasRef, onChange, feedbackData, onFinalSave }: CanvasSectionProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useAtom(canvasInstanceAtom);
  const [isDragging, setIsDragging] = useState(true);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(1);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [brushWidth, setBrushWidth] = useState(10);

  const [imageData, setImageData] = useState<any>(null);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);

  const feedbackData1 = {
    title: "피드백",
    description: "그림에서 바나나의 형태가 잘 드러나도록 곡선을 자연스럽게 표현하신 점이 인상적입니다. 특히 밝고 생동감 있는 노란색은 바나나의 신선함과 활기를 잘 전달하고 있어요.(개선점 제안) 주제를 바나나로 더 명확하게 표현하려면 다음을 고려해 보세요 끝부분 디테일: 바나나의 양 끝부분(꼭지와 끝부분)을 약간 어둡게 처리하면 실제 바나나의 느낌을 더 살릴 수 있을 것 같습니다."
  };

  const feedbackData2 = {
    title: "피드백",
    description: "그림에서 바나나의 양 끝부분(꼭지와 끝부분)을 약간 어둡게 처리하신 점이 정말 돋보입니다! 🎨 바나나의 실제감을 훌륭히 표현해 주셨고, 끝부분의 어두운 디테일이 신선한 바나나의 느낌을 더 생동감 있게 전달하고 있어요. 특히 색상의 톤 변화가 자연스러워서 그림에 깊이를 더한 점이 인상적입니다. 😊"
  };

  const playAudio = async (filename: string) => {
    const audio = new Audio(`/public/display_Mock_Image/${filename}`);
    try {
      await audio.play();
      return new Promise<void>((resolve) => {
        audio.onended = () => resolve();
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  useEffect(() => {
    const handleStepChange = async () => {
      if (step === 5) {
        setCurrentFeedback(feedbackData1);
        setIsPanelVisible(true);
        await playAudio('4.wav');
      } else if (step === 3) {
        setCurrentFeedback(feedbackData2);
        setIsPanelVisible(true);
        await playAudio('5.wav');
      } else {
        setIsPanelVisible(false);
      }
    };

    handleStepChange();
  }, [step]);

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
      description: "바나나 달콤하고 부드러운 맛을 가진 노란색의 열대 과일로, 곡선 모양의 특징적인 형태를 가지고 있습니다.",
      image : "public/MockImage/메타_목_데이터.png"
    });

    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, setCanvas]);

  const handleFinalSave = async () => {
    if (onFinalSave) {
      onFinalSave();
    }
  };

  const saveCanvasAsImage = async () => {
    if (!canvas) return;

    // 캔버스의 객체 확인
    const objects = canvas.getObjects();
    if (objects.length === 0) {
      alert("그림을 그려주세요!");
      return;
    }

    // 경계 상자를 수동으로 계산
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

    // 경계 상자를 표시하는 사각형 추가
    const rect = new fabric.Rect({
      left: boundingBox.left - 50,  // 왼쪽 마진
      top: boundingBox.top - 50,    // 위쪽 마진
      width: (boundingBox.right - boundingBox.left) + 100,   // 오른쪽 마진 포함
      height: (boundingBox.bottom - boundingBox.top) + 100,  // 아래쪽 마진 포함
      strokeWidth: 2,
      fill: 'transparent',
    });

    canvas.add(rect);
    canvas.renderAll();

    // 경계 상자 크기로 이미지 저장
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0,
      left: boundingBox.left - 50,
      top: boundingBox.top - 50,
      width: (boundingBox.right - boundingBox.left) + 100,
      height: (boundingBox.bottom - boundingBox.top) + 100,
    });

    // 사각형 제거
    canvas.remove(rect);
    canvas.renderAll();

    if (step === 1) {
      await onUpload(dataURL, step);
      setStep(5);
    } else if (step === 5) {
      setIsPanelVisible(false);
      setStep(2);
      canvas.clear();
    } else if (step === 2) {
      await onUpload(dataURL, step);
      setStep(3);
    } else if (step === 3) {
      setIsPanelVisible(false);
      await handleFinalSave();
    }
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
            <img src={imageData.image} alt="Image" />
          </div>
        )}
      {isPanelVisible && (
        <div className={`${style.slidePanel} ${isPanelVisible ? style.visible : style.hidden}`}>
          {currentFeedback && (
            <div className={style.feedback}>
              <h3>{currentFeedback.title}</h3>
              <p>{currentFeedback.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasSection;