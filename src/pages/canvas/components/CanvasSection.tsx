import { fabric } from "fabric";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAtom } from "jotai";
import canvasInstanceAtom from "@/pages/canvas/components/stateCanvasInstance";
import BannerSection from "@/pages/canvas/components/BannerSection.tsx";
import style from "../CanvasPage.module.css";
import ImagePanelSection from "./PanelSection";
import FeedbackSection from "./FeedbackSection";
import { makeFrame } from '../utils/makeFrame';
import debounce from 'lodash/debounce';
import Overlay from './Overlay';
import overlayAtom from '@/store/atoms/overlayAtom';
import activeToolAtom from "@/pages/canvas/components/stateActiveTool";
import { useLocation } from 'react-router-dom';

interface CanvasSectionProps {
  className?: string;
  onUpload: (dataURL: string, step: number, topic: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onChange: () => void;
  feedbackData: any | null;
  onFinalSave?: () => void;
}

const CanvasSection = ({ onUpload, canvasRef, onChange, onFinalSave}: CanvasSectionProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useAtom(canvasInstanceAtom);
  const [isDragging, setIsDragging] = useState(true);
  const [offset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(1);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [brushWidth] = useState(10);

  const [imageData, setImageData] = useState<any>(null);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [isImageCardCollapsed, setIsImageCardCollapsed] = useState(false);
  const [isFeedbackCardCollapsed, setIsFeedbackCardCollapsed] = useState(false);
  const [overlay, setOverlay] = useAtom(overlayAtom);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [activeTool] = useAtom(activeToolAtom);


  const [title, setTitle] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();

  const hasInitialPlayedRef = useRef(false);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const isFillUsedRef = useRef(false);

  const location = useLocation();
  const metadata = location.state?.metadata;

  const [currentStep, setCurrentStep] = useState(0);

  const [feedbackTimer, setFeedbackTimer] = useState<NodeJS.Timeout | null>(null);

  const tutorialMessages = {
    canvasHello: "안녕하세요 저는 오늘 그림그리기를 도와줄 마당이라고 해요 차근차근 같이 멋진 작품 만들어 봐요 우리 그리기 버튼을 눌러 동그라미를 하나 그려볼까요?",
    brushWidth: "더큰 동그라미를 선택해서 굵은 선을 그릴 수도 있어요",
    eraser: "지우개 버튼을 눌러 마음에 안드는 부분을 지워볼까요",
    fill: "채우기 버튼 을 눌러주세요 그린그림을 눌르면 넓은 면을 색칠 할 수 있어요",
    startStep: "지금까지 그림판의 사용법을 알아보았어요 이제 그림을 그리러 가볼까요?",
    nextStep: "이번 단계 는 어떠셨나요 ? 이제 다음 단계 로 가볼까요 ?"
  };

  const speakText = async (text: string) => {
    console.log("speakText 호출됨:", text);
    try {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }

      const response = await fetch('http://localhost:4174/synthesize-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Speech synthesis failed');
      }

      const data = await response.json();
      
      const audioData = atob(data.audioContent);
      const arrayBuffer = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        arrayBuffer[i] = audioData.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      return new Promise<void>((resolve) => {
        const audio = new Audio(url);
        currentAudio.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          currentAudio.current = null;
          resolve();
        };
        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          URL.revokeObjectURL(url);
          currentAudio.current = null;
          resolve();
        };
        audio.play();
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  useEffect(() => {
    if (metadata) {

      const parsedInstructions = JSON.parse(metadata.guidelines).map((item: any) => item.instruction);
      const parsedTopic = JSON.parse(metadata.topic);
      const parsedTitle = JSON.parse(metadata.title).map((item: any) => item.instruction);
      const parsedImageUrl = metadata.imageUrl;

      setInstructions(parsedInstructions);
      setTopic(parsedTopic);
      setTitle(parsedTitle);
      setImageUrl(parsedImageUrl);


    }
  }, [metadata]);

  // 첫 튜토리얼 메시지는 한 번만 재생
  useEffect(() => {
    const playInitialTutorial = async () => {
      if (!hasInitialPlayedRef.current) {
        hasInitialPlayedRef.current = true;
        await speakText(tutorialMessages.canvasHello);
        setOverlay('pen');  // 음성이 끝난 후 그리기 버튼 하이라이트
      }
    };
    playInitialTutorial();
  }, []);

  // 캔버스 그리기 이벤트 감지
  useEffect(() => {
    if (!canvas) return;

    const handlePathCreated = async () => {
      if (tutorialStep === 0) {
        setOverlay(null);  // 그리기 시작하면 오버레이 제거
        setTutorialStep(1);
        await speakText(tutorialMessages.brushWidth);
        setOverlay('brushWidth');  // 음성이 끝난 후 두께 변경 요소 하이라이트
      }
    };

    canvas.on('path:created', handlePathCreated);

    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, tutorialStep]);

  // 두께 변경과 그림 그리기 감지
  useEffect(() => {
    if (!canvas) return;

    let isBrushWidthChanged = false;
    let isPathCreated = false;

    const handleBrushWidthChange = async () => {
      if (tutorialStep === 1) {
        setOverlay(null);  // 두께 변경 시 오버레이 해제
        if (isBrushWidthChanged && isPathCreated) {
          setTutorialStep(2);
          await speakText(tutorialMessages.eraser);
          setOverlay('eraser');  // 음성이 끝난 후 지우개 버튼 하이라이트
        }
      }
    };

    const checkBrushWidthChange = () => {
      if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.width !== brushWidth) {
        isBrushWidthChanged = true;
        handleBrushWidthChange();
      }
    };

    const handlePathCreated = () => {
      isPathCreated = true;
      handleBrushWidthChange();
    };

    // 두께 변경 요소에 오버레이가 걸리도록 설정
    const brushWidthElement = document.querySelector('[data-tool="brushWidth"]');
    if (brushWidthElement) {
      brushWidthElement.addEventListener('click', checkBrushWidthChange);
    }

    canvas.on('path:created', handlePathCreated);

    return () => {
      if (brushWidthElement) {
        brushWidthElement.removeEventListener('click', checkBrushWidthChange);
      }
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, tutorialStep, brushWidth]);


  // 도구 선택 및 사용 감지
  useEffect(() => {
    if (!canvas) return;

    const handleEraserUse = async () => {
      if (tutorialStep === 2) {
        setOverlay(null);
        setTutorialStep(3);
        await speakText(tutorialMessages.fill);
        setOverlay('fill');
      }
    };

    const handleFillUse = async () => {
      if (tutorialStep === 3 && !isFillUsedRef.current) {
        isFillUsedRef.current = true;
        setOverlay(null);
        setTutorialStep(4);
        await speakText(tutorialMessages.startStep);

        // 캔버스 초기화
        if (canvas) {
          canvas.clear();
          canvas.backgroundColor = "transparent";
          canvas.renderAll();
        }

        setCurrentStep(1);

        setImageData({
          title: title[currentStep],
          description: instructions[currentStep],
          image: imageUrl
        });

      }
    };

    const handlePathCreated = (e: fabric.IEvent) => {
      if (activeTool === 'eraser') {
        handleEraserUse();
      }
    };

    // fill 도구 사용 시 모든 캔버스 변화 감지
    const handleCanvasChange = () => {
      if (activeTool === 'fill') {
        handleFillUse();
      }
    };

    canvas.on('path:created', handlePathCreated);
    canvas.on('object:modified', handleCanvasChange);
    canvas.on('object:added', handleCanvasChange);
    canvas.on('object:removed', handleCanvasChange);
    canvas.on('mouse:up', handleCanvasChange);

    return () => {
      canvas.off('path:created', handlePathCreated);
      canvas.off('object:modified', handleCanvasChange);
      canvas.off('object:added', handleCanvasChange);
      canvas.off('object:removed', handleCanvasChange);
      canvas.off('mouse:up', handleCanvasChange);
    };
  }, [canvas, tutorialStep, activeTool]);

  const handleBrushWidthChange = useCallback(async () => {
    if (tutorialStep === 1) {
      setOverlay(null);
      setTutorialStep(2);
      await speakText(tutorialMessages.eraser);
      setOverlay('eraser');
    }
  }, [tutorialStep, speakText, setOverlay]);

  const handleEraserUse = useCallback(async () => {
    if (tutorialStep === 2) {
      setOverlay(null);
      setTutorialStep(3);
      await speakText(tutorialMessages.fill);
      setOverlay('fill');
    }
  }, [tutorialStep, speakText, setOverlay]);


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

  const handleFinalSave = async () => {
    // if (onFinalSave) {
    //   onFinalSave();
    // }
  };

  const saveImageAndFeedback = async () => {
    if (!canvas) return;

    const dataURL = makeFrame(canvas);
    const responese =  await onUpload(dataURL, step, topic || "");
    console.log(responese);
    setStep(step + 1);
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      setPanelPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handleChange();
  };

  const toggleImageCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageCardCollapsed(!isImageCardCollapsed);
  };

  const toggleFeedbackCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFeedbackCardCollapsed(!isFeedbackCardCollapsed);
  };

  const handleChange = () => {
    onChange();
  };

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }
    };
  }, []);


  // 사용자 활동 감지 및 피드백 타이머 설정
  const handleUserActivity = useCallback(() => {
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }

    if (currentStep > 0) {  // 튜토리얼이 끝나고 실제 그리기 단계일 때만
      const timer = setTimeout(() => {
        saveImageAndFeedback();
      }, 5000);  // 5초 타이머
      
      setFeedbackTimer(timer);
    }
  }, [currentStep, feedbackTimer]);

  // 사용자 활동 감지를 위한 이벤트 리스너
  useEffect(() => {
    if (!canvas) return;

    const handleCanvasActivity = () => {
      handleUserActivity();
    };

    canvas.on('mouse:down', handleCanvasActivity);
    canvas.on('mouse:up', handleCanvasActivity);
    canvas.on('path:created', handleCanvasActivity);
    canvas.on('object:modified', handleCanvasActivity);

    return () => {
      canvas.off('mouse:down', handleCanvasActivity);
      canvas.off('mouse:up', handleCanvasActivity);
      canvas.off('path:created', handleCanvasActivity);
      canvas.off('object:modified', handleCanvasActivity);
    };
  }, [canvas, handleUserActivity]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (feedbackTimer) {
        clearTimeout(feedbackTimer);
      }
    };
  }, [feedbackTimer]);

  return (
    <div 
      className={style.canvasContainer} 
      ref={canvasContainerRef} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
    >
      <canvas 
        ref={canvasRef} 
        className={style.canvas} 
        id="mycanvas"
      />
      {imageData && (
        <div className={style.instructions}>
          <h3 className={style.instructionTitle}>{imageData.title}</h3>
          <p className={style.instructionText}>{imageData.description}</p>
        </div>
      )}
      {imageData && (
        <ImagePanelSection 
          imageData={imageData}
          isImageCardCollapsed={isImageCardCollapsed}
          toggleImageCard={toggleImageCard}
        />
      )}
      {currentFeedback && isPanelVisible && (
        <FeedbackSection 
          currentFeedback={currentFeedback}
          isFeedbackCardCollapsed={isFeedbackCardCollapsed}
          toggleFeedbackCard={toggleFeedbackCard}
        />
      )}
      {overlay && <Overlay type={overlay} isVisible={true} />}
      {instructions.length > 0 && (
        <div className={style.instructions}>
          {instructions.map((instruction, index) => (
            <div key={index} className={style.instruction}>
              {instruction}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CanvasSection;