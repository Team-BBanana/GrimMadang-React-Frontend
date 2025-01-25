import { fabric } from "fabric";
import { useEffect, useRef, useState, useCallback } from "react";
import BannerSection from "@/pages/canvas/components/BannerSection.tsx";
import style from "../CanvasPage.module.css";
import ImagePanelSection from "./PanelSection";
import FeedbackSection from "./FeedbackSection";
import { makeFrame } from '../utils/makeFrame';
import Overlay from './Overlay';
import { useLocation } from 'react-router-dom';
import { useSpeechCommands } from '../hooks/useSpeechCommands';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useTutorialState } from '@/hooks/useTutorialState';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useMetadataParser } from '@/hooks/useMetadataParser';

interface CanvasSectionProps {
  className?: string;
  uploadCanvasImage: (dataURL: string, step: number, topic: string) => Promise<any>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handleChange: () => void;
  feedbackData: any | null;
  handleSaveCanvas: (title: string, secondfeedback: string, imageUrl: string) => Promise<void>;
}

const CanvasSection = ({ uploadCanvasImage, canvasRef, handleChange, handleSaveCanvas }: CanvasSectionProps) => {
  // 1. 기본 상태들 먼저 선언
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [imageData, setImageData] = useState<any>(null);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);
  const [isImageCardCollapsed, setIsImageCardCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [secondfeedback, setSecondfeedback] = useState<string>('');

  // 2. 음성 합성 훅 사용
  const { speakText, cleanup: cleanupSpeech, isPlaying } = useSpeechSynthesis();

  // 3. 캔버스 상태 관리
  const {
    canvas,
    setCanvas,
    brushWidth,
    canvasContainerRef,
    handleMouseMove,
    handleMouseUp
  } = useCanvasState(canvasRef);

  // 4. 메타데이터 파싱 훅 사용
  const location = useLocation();
  const metadata = location.state?.metadata;
  
  const {
    instructions,
    topic,
    title,
    imageUrl
  } = useMetadataParser(metadata);

  // 5. 튜토리얼 완료 핸들러
  const handleTutorialComplete = useCallback(() => {
    setCurrentStep(1);
    setImageData({
      title: title[0],
      description: instructions[0],
      image: imageUrl
    });
  }, [title, instructions, imageUrl]);

  // 6. 튜토리얼 상태 관리
  const {
    tutorialStep,
    setTutorialStep, 
    overlay,
    setOverlay,
    hasInitialPlayedRef,
    showTitle,
    tutorialMessages
  } = useTutorialState(canvas, handleTutorialComplete, brushWidth, speakText);

  // 첫 튜토리얼 메시지는 한 번만 재생
  useEffect(() => {
    const playInitialTutorial = async () => {
      if (!hasInitialPlayedRef.current) {
        hasInitialPlayedRef.current = true;
        await speakText(tutorialMessages.canvasHello);
        setOverlay('pen');  // 음성 재생 후에 오버레이 설정
        speakText(tutorialMessages.draw);
      }
    };

    const timeoutId = setTimeout(() => {
      playInitialTutorial();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // 캔버스 진입시 그리기 버튼 오버레이및 음성 
  useEffect(() => {
    if (!canvas) return;

    const handlePathCreated = async () => {
      if (tutorialStep === 0) {
        setOverlay('brushWidth');  // 오버레이 먼저 설정
        setTutorialStep(1);
        await speakText(tutorialMessages.brushWidth);
      }
    };

    canvas.on('path:created', handlePathCreated);

    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, tutorialStep]);

  //캔버스 초기상태 설정
  useEffect(() => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.outerWidth,
      height: window.outerHeight,
      backgroundColor: "transparent"
    });

    setCanvas(newCanvas);

    // 초기 상태에서는 그리기 모드 비활성화
    newCanvas.isDrawingMode = false;
    newCanvas.selection = false;
    newCanvas.renderAll();

    const handleResize = () => {
      newCanvas.setWidth(window.innerWidth);
      newCanvas.setHeight(window.innerHeight);
      newCanvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

  
    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, setCanvas]);

  const [isLoading, setIsLoading] = useState(false);

  const saveImageAndFeedback = async () => {
    if (!canvas) return;

    // currentStep이 3이 아닐 때만 로딩 모달 표시
    if (currentStep !== 3) {
      setIsLoading(true);
    }

    setIsLoading(true);

    try {
      const dataURL = makeFrame(canvas);
      const response = await uploadCanvasImage(dataURL, currentStep, topic || "");
      console.log("Response from server:", response);

      if (response && response.feedback) {
        if (currentStep === 2) {
          setSecondfeedback(response.feedback);
        }

        setCurrentFeedback(response.feedback);
        setIsPanelVisible(true);
        setIsLoading(false);
        await speakText(response.feedback);
      }

      if (currentStep === 3) {
        await speakText(tutorialMessages.finalStep);
        setOverlay('saving');

        const dataURL = makeFrame(canvas);
        const imageUrl = await uploadCanvasImage(dataURL, currentStep, topic || "");

        handleSaveCanvas(topic || "", secondfeedback, imageUrl);
        return;
      }

      if (response) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setImageData({
          title: title[nextStep],
          description: instructions[nextStep],
          image: imageUrl
        });

        setIsPanelVisible(false);
        setOverlay(null);
      }
    } finally {
    }
  };
  
  const toggleImageCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageCardCollapsed(!isImageCardCollapsed);
  };

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      cleanupSpeech();
    };
  }, []);

  const { transcript: _transcript, listening: _listening } = useSpeechCommands({
    currentStep,
    onFinishDrawing: saveImageAndFeedback
  });

  useEffect(() => {
    const speakInstruction = async () => {
      if (currentStep >= 1 && instructions[currentStep-1]) {
        await speakText(instructions[currentStep-1]);
      }
    };
    
    speakInstruction();
  }, [currentStep, instructions]);

  return (
    <div 
      className={style.canvasContainer} 
      ref={canvasContainerRef} 
      onMouseMove={handleMouseMove} 
      onMouseUp={() => handleMouseUp(handleChange)}
    >
      <BannerSection
        onSave={saveImageAndFeedback}
        step={currentStep}
      />
      <canvas 
        ref={canvasRef} 
        className={style.canvas} 
        id="mycanvas"
      />
      {showTitle && <div className={style.bannerSectiontitle}>{instructions[currentStep-1]}</div>}
      {imageData && (
        <ImagePanelSection 
          imageData={imageData}
          isImageCardCollapsed={isImageCardCollapsed}
          toggleImageCard={toggleImageCard}
        />
      )}
      {currentFeedback && isPanelVisible && (
        <FeedbackSection 
          currentFeedback={currentFeedback || ""}
        />
      )}
      {overlay && <Overlay type={overlay} isVisible={true} />}
      
      {overlay === 'saving' && (
        <div className={style.savingOverlay} />
      )}
      
      {isLoading && (
        <div className={style.loadingContainer}>
          <div className={style.loadingSpinner} />
          잠시만 기다려 주세요...
        </div>
      )}
      
      {isPlaying && <div className={style.disableInteraction} />}
    </div>
  );
};

export default CanvasSection;