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
import { useLocation, useNavigate } from 'react-router-dom';

interface CanvasSectionProps {
  className?: string;
  onUpload: (dataURL: string, step: number, topic: string) => Promise<any>;
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
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);
  const [isImageCardCollapsed, setIsImageCardCollapsed] = useState(false);
  const [overlay, setOverlay] = useAtom(overlayAtom);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [activeTool] = useAtom(activeToolAtom);

  const [title, setTitle] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();

  const [currentStep, setCurrentStep] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [lastCanvasChange, setLastCanvasChange] = useState<number>(Date.now());

  const hasInitialPlayedRef = useRef(false);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const isFillUsedRef = useRef(false);

  const navigate = useNavigate();

  // 임시 데이터
  const tempData = {
    sessionId: "3cb9399e-8ac8-4e84-a102-4869770f184d",
    topic: "사과",
    imageUrl: "https://bbanana.s3.ap-northeast-2.amazonaws.com/topics/사과/1736933477570.png",
    steps: [
      {
        step: 1,
        title: "사과의 큰 윤곽 그리기",
        instruction: "먼저, 종이 가운데에 동그랗게 살짝 찌그러진 큰 타원을 그려봐요. 너무 완벽할 필요 없어요, 그냥 사과 모양을 떠올리면 돼요!"
      },
      {
        step: 2,
        title: "사과 꼭지 그리기",
        instruction: "타원의 윗부분 가운데에 꼭지 자리를 만들어봐요. 작고 얇은 막대를 그리듯이 위로 쭉 그려주세요."
      },
      {
        step: 3,
        title: "잎사귀 추가하기",
        instruction: "이제 꼭지 옆에 작은 잎사귀를 하나 붙여볼까요? 꼭지 옆에서 시작해 물방울 모양처럼 부드럽게 그리면 돼요."
      }
    ],
    evaluation: {
      score: 30,
      feedback: "이렇게 해보시면 어떨까요? 형태가 너무 동그랗네요. 타원의 모양으로 찌그러뜨려 보세요. 사과를 더 닮게 될 거예요!"
    }
  };

  const location = useLocation();
  const metadata = location.state?.metadata;

  useEffect(() => {
    // 임시 데이터 설정
    setInstructions(tempData.steps.map(step => step.instruction));
    setTitle(tempData.steps.map(step => step.title));
    setTopic(tempData.topic);
    setImageUrl(tempData.imageUrl);
  }, []);

  const tutorialMessages = {
    canvasHello: "안녕하세요 저는 오늘 그림그리기를 도와줄 마당이라고 해요 차근차근 같이 멋진 작품 만들어 봐요 우리 그리기 버튼을 눌러 동그라미를 하나 그려볼까요?",
    brushWidth: "더큰 동그라미를 선택해서 굵은 선을 그릴 수도 있어요",
    eraser: "지우개 버튼을 눌러 마음에 안드는 부분을 지워볼까요",
    fill: "채우기 버튼 을 눌러주세요 그린그림을 눌르면 넓은 면을 색칠 할 수 있어요",
    startStep: "지금까지 그림판의 사용법을 알아보았어요 이제 그림을 그리러 가볼까요",
    nextStep: "이번 단계 는 어떠셨나요  이제 다음 단계 로 가볼까요 "
  };

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

        // setInstructions(parsedInstructions);
        // setTopic(parsedTopic);
        // setTitle(parsedTitle);
        // setImageUrl(parsedImageUrl);
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
        // DOM이 완전히 렌더링될 때까지 기다린 후 오버레이 설정
        setTimeout(() => {
          setOverlay('pen');  // 음성이 끝난 후 그리기 버튼 하이라이트
        }, 1000);
      }
    };

    // 컴포넌트 마운트 후 약간의 지연을 두고 튜토리얼 시작
    const timeoutId = setTimeout(() => {
      playInitialTutorial();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // 캔버스 그리기 이벤트 감지
  useEffect(() => {
    if (!canvas) return;

    const handlePathCreated = async () => {
      if (tutorialStep === 0) {
        setOverlay(null);  // 그리기 시작하면 오버레이 제거
        setTutorialStep(1);
        await speakText(tutorialMessages.brushWidth);
        // DOM이 완전히 렌더링될 때까지 기다린 후 오버레이 설정
        setTimeout(() => {
          setOverlay('brushWidth');  // 음성이 끝난 후 두께 변경 요소 하이라이트
        }, 500);
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
        setShowTitle(true);  // startStep 음성 재생 후 title 표시

        // 캔버스 초기화
        if (canvas) {
          canvas.clear();
          canvas.backgroundColor = "transparent";
          canvas.renderAll();
        }

        // 튜토리얼 단계에서는 currentStep을 0으로 유지
        setCurrentStep(0);
        setImageData({
          title: title[0],  // 항상 첫 번째 title 사용
          description: instructions[0],  // 항상 첫 번째 instruction 사용
          image: imageUrl
        });

        // startStep 음성이 끝난 후 첫 그리기 시작을 기다림
        setLastCanvasChange(0); // 초기값을 0으로 설정하여 첫 그리기를 기다림
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

  const handleFinalSave = async () => {
    // if (onFinalSave) {
    //   onFinalSave();
    // }
  };

  const saveImageAndFeedback = async () => {
    if (!canvas) return;

    // currentStep이 3일 때 (마지막 단계)
    if (currentStep === 3) {
      // 저장 중 메시지 표시
      setOverlay('saving');  // Overlay 컴포넌트에 'saving' 타입 추가 필요
      
      // 마지막 이미지 저장
      const dataURL = makeFrame(canvas);
      await onUpload(dataURL, currentStep, topic || "");
      
      // 갤러리 페이지로 이동
      setTimeout(() => {
        navigate('/gallery');
      }, 2000);  // 2초 후 이동
      
      return;
    }

    // 기존 피드백 로직
    const dataURL = makeFrame(canvas);
    const response = await onUpload(dataURL, currentStep, topic || "");
    console.log("Response from server:", response);

    if (response && response.feedback) {
      setCurrentFeedback(response.feedback);
      setIsPanelVisible(true);
      await speakText(response.feedback);
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
      await speakText(tutorialMessages.nextStep);
    }
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

  return (
    <div 
      className={style.canvasContainer} 
      ref={canvasContainerRef} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
    >
      <BannerSection
        onSave={saveImageAndFeedback}
        step={step}
      />
      <canvas 
        ref={canvasRef} 
        className={style.canvas} 
        id="mycanvas"
      />
      {showTitle && <div className={style.bannerSectiontitle}>{instructions[currentStep]}</div>}
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
          저장중이에요...
        </div>
      )}
      
      <button 
        onClick={saveImageAndFeedback} 
        style={{ 
          position: 'fixed',
          bottom: '20px',
          left: '280px',
          padding: '10px 20px',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        {currentStep === 3 ? '완료하기' : '피드백 요청하기'}
      </button>
    </div>
  );
};

export default CanvasSection;