import { fabric } from "fabric";
import { useEffect, useRef, useState} from "react";
import { useAtom } from "jotai";
import BannerSection from "@/pages/canvas/components/BannerSection.tsx";
import style from "../CanvasPage.module.css";
import ImagePanelSection from "./PanelSection";
import FeedbackSection from "./FeedbackSection";
import { makeFrame } from '../utils/makeFrame';
import Overlay from './Overlay';
import overlayAtom from '@/store/atoms/overlayAtom';
import activeToolAtom from "@/pages/canvas/components/stateActiveTool";
import { useLocation }from 'react-router-dom';
import { useSpeechCommands } from '../hooks/useSpeechCommands';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useTutorialState } from '@/hooks/useTutorialState';

interface CanvasSectionProps {
  className?: string;
  uploadCanvasImage: (dataURL: string, step: number, topic: string) => Promise<any>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handleChange: () => void;
  feedbackData: any | null;
  handleSaveCanvas: (title: string, secondfeedback: string, imageUrl: string) => Promise<void>;
}

const CanvasSection = ({ uploadCanvasImage, canvasRef, handleChange, handleSaveCanvas }: CanvasSectionProps) => {
  const {
    canvas,
    setCanvas,
    brushWidth,
    canvasContainerRef,
    handleMouseMove,
    handleMouseUp
  } = useCanvasState(canvasRef);

  const {
    tutorialStep,
    setTutorialStep,
    overlay,
    setOverlay,
    hasInitialPlayedRef,
    isFillUsedRef,
    showTitle,
    setShowTitle,
    tutorialMessages,
    activeTool
  } = useTutorialState(canvas);

  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [imageData, setImageData] = useState<any>(null);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);
  const [isImageCardCollapsed, setIsImageCardCollapsed] = useState(false);
  const [title, setTitle] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [currentStep, setCurrentStep] = useState(0);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const [secondfeedback, setSecondfeedback] = useState<string>('');

  const location = useLocation();
  const metadata = location.state?.metadata;

  const speakText = async (text: string) => {
    console.log("speakText 호출됨:", text);
    try {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }

      const response = await fetch(`${import.meta.env.VITE_UPLOAD_SERVER_URL}/synthesize-speech`, {
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
      console.log('Received metadata in CanvasSection:', metadata);
      try {
        // guidelines 파싱
        let parsedInstructions: string[] = [];
        if (metadata.guidelines) {
          const guidelinesArray = typeof metadata.guidelines === 'string' 
            ? JSON.parse(metadata.guidelines) 
            : metadata.guidelines;
          parsedInstructions = guidelinesArray.map((item: any) => item.instruction);
        }

        // topic 파싱
        const parsedTopic = metadata.topic || '';

        // title 파싱 - 직접 title 문자열 추출
        let parsedTitle: string[] = [];
        if (metadata.guidelines) {
          const guidelinesArray = typeof metadata.guidelines === 'string'
            ? JSON.parse(metadata.guidelines)
            : metadata.guidelines;
          parsedTitle = guidelinesArray.map((item: any) => item.title);
        }

        const parsedImageUrl = metadata.imageUrl || '';

        console.log('Parsed data:', {
          instructions: parsedInstructions,
          topic: parsedTopic,
          title: parsedTitle,
          imageUrl: parsedImageUrl
        });

        setInstructions(parsedInstructions);
        setTopic(parsedTopic);
        setTitle(parsedTitle);
        setImageUrl(parsedImageUrl);
      } catch (error) {
        console.error('Error parsing metadata:', error, metadata);
      }
    }
  }, [metadata]);

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

  // 캔버스 그리기 이벤트 감지
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

  // 두께 변경과 그림 그리기 감지
  useEffect(() => {
    if (!canvas) return;

    let isBrushWidthChanged = false;
    let isPathCreated = false;

    const handleBrushWidthChange = async () => {
      if (tutorialStep === 1) {
        if (isBrushWidthChanged && isPathCreated) {
          setOverlay('eraser');  // 오버레이 먼저 설정
          setTutorialStep(2);
          await speakText(tutorialMessages.eraser);
        }
      }
    };

    const checkBrushWidthChange = () => {
      if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.width !== brushWidth) {
        isBrushWidthChanged = true;
        setOverlay(null); 
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
        setOverlay('fill'); 
        setTutorialStep(3);
        await speakText(tutorialMessages.fill);
      }
    };

    const handleFillUse = async () => {
      if (tutorialStep === 3 && !isFillUsedRef.current) {
        isFillUsedRef.current = true;
        setOverlay(null);
        setTutorialStep(4);
        await speakText(tutorialMessages.startStep);
        setShowTitle(true);

        // 캔버스 초기화
        if (canvas) {
          canvas.clear();
          canvas.backgroundColor = "transparent";
          canvas.renderAll();
        }

        // 튜토리얼이 끝나고 실제 그리기 시작할 때 currentStep을 1로 설정
        setCurrentStep(1);
        setImageData({
          title: title[0],
          description: instructions[0],
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
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }
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
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 1000
        }}>
        </div>
      )}
      
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div className={style.loadingSpinner}></div>
          잠시만 기다려 주세요...
        </div>
      )}
    </div>
  );
};

export default CanvasSection;