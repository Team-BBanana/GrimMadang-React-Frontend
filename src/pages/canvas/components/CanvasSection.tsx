import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import canvasInstanceAtom from "@/pages/canvas/components/stateCanvasInstance";
import BannerSection from "@/pages/canvas/components/BannerSection.tsx";
import style from "../CanvasPage.module.css";
import API from "@/api";
import ImagePanelSection from "./PanelSection";
import FeedbackSection from "./FeedbackSection";
import { makeFrame } from '../utils/makeFrame';
import debounce from 'lodash/debounce';
import { useAudio } from '@/context/AudioContext';
import Overlay from './Overlay';

interface CanvasSectionProps {
  className?: string;
  onUpload: (dataURL: string, step: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onChange: () => void;
  feedbackData: any;
  onFinalSave?: () => void;
}

const CanvasSection = ({ onUpload, canvasRef, onChange, onFinalSave }: CanvasSectionProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useAtom(canvasInstanceAtom);
  const [isDragging, setIsDragging] = useState(true);
  const [step, setStep] = useState(1);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [brushWidth] = useState(10);

  const [imageData, setImageData] = useState<any>(null);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [isImageCardCollapsed, setIsImageCardCollapsed] = useState(false);
  const [isFeedbackCardCollapsed, setIsFeedbackCardCollapsed] = useState(false);

  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [playedAudios, setPlayedAudios] = useState<Set<number>>(new Set());
  const { dispatch, state } = useAudio();
  const { isPlaying } = state;

  const [overlay, setOverlay] = useState<string | null>(null);

  const [currentPlayingFile, setCurrentPlayingFile] = useState<string | null>(null);

  const feedbackData1 = {
    title: "도움말",
    description: "그림에서 바나나의 형태가 잘 드러나도록 곡선을 자연스럽게 표현하신 점이 인상적입니다. 주제를 바나나로 더 명확하게 표현하려면 다음을 고려해 보세요 바나나의 양 끝부분(꼭지와 끝부분)을 약간 어둡게 처리하면 실제 바나나의 느낌을 더 살릴 수 있을 것 같습니다."
  };

  const feedbackData2 = {
    title: "도움말",
    description: "그림에서 바나나의 양 끝부분(꼭지와 끝부분)을 약간 어둡게 처리하신 점이 정말 돋보입니다! 🎨 바나나의 실제감을 훌륭히 표현해 주셨고, 끝부분의 어두운 디테일이 신선한 바나나의 느낌을 더 생동감 있게 전달하고 있어요. 특히 색상의 톤 변화가 자연스러워서 그림에 깊이를 더한 점이 인상적입니다. 😊"
  };

  const audioFiles = [
    '/canvasTutorial/eraser.wav',
    '/canvasTutorial/brushWidth.wav',
    '/canvasTutorial/colorPanel.wav',
    '/canvasTutorial/stepOne.wav',
    '/canvasTutorial/acceptFeedback.wav',
    '/canvasTutorial/fill.wav',
    '/canvasTutorial/specificDraw.wav',
    '/canvasTutorial/stepTwo.wav',
    '/canvasTutorial/acceptFeedback2.wav',
    '/canvasTutorial/save.wav',
  ];

  const playAudio = (index: number) => {
    console.log("index: ", index);
    if (playedAudios.has(index) || index >= audioFiles.length) return;
    
    dispatch({ type: 'ADD_TO_QUEUE', payload: audioFiles[index] });
    setPlayedAudios(prev => new Set([...prev, index]));
    const nextIndex = index + 1;
    setCurrentAudioIndex(nextIndex);
};

  const debouncedAudioPlay = useRef(
    debounce((currentIndex: number) => {
        playAudio(currentIndex);
    }, 5000)
  ).current;

  const handleChange = () => {
    onChange();
    debouncedAudioPlay(currentAudioIndex);
  };

  useEffect(() => {
    return () => {
      debouncedAudioPlay.cancel();
    };
  }, [debouncedAudioPlay]);

  useEffect(() => {
    const handleStepChange = async () => {
      if (step === 2) {
        setCurrentFeedback(feedbackData1);
        setIsPanelVisible(true);
        // await playAudio('4.wav');
      } else if (step === 3) {
        setCurrentFeedback(feedbackData2);
        setIsPanelVisible(true);
        // await playAudio('5.wav');
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
      title: "바나나",
      description: "달콤하고 부드러운 맛을 가진 노란색의 열대 과일로, 곡선 모양의 특징적인 형태를 가지고 있습니다.",
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

    const dataURL = makeFrame(canvas);

    if (step === 1) {
      await onUpload(dataURL, step);
      setStep(2);
      setIsPanelVisible(true);
    } else if (step === 2) {
      await onUpload(dataURL, step);
      setStep(3);
    } else if (step === 3) {
      setIsPanelVisible(false);
      await handleFinalSave();
    }
  };
  
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

  useEffect(() => {
    if (!isPlaying) {
      setOverlay(null);
      return;
    }

    const audioFileName = state.queue[0]?.split('/').pop()?.replace('.wav', '');
    setCurrentPlayingFile(audioFileName || null);

    switch (audioFileName) {
      case 'eraser':
        setOverlay('eraser');
        break;
      case 'brushWidth':
        setOverlay('brushWidth');
        break;
      case 'colorPanel':
        setOverlay('colorPanel');
        break;
      case 'stepOne':
        setOverlay('save');
        break;
      case 'fill':
        setOverlay('fill');
        break;
      case 'stepTwo':
        setOverlay('save');
        break;
      case 'save':
        setOverlay('save');
        break;
      default:
        setOverlay(null);
    }
  }, [isPlaying, state.queue]);

  useEffect(() => {
    console.log('Audio State:', {
      isPlaying,
      currentPlayingFile,
      overlay,
      queue: state.queue
    });
  }, [isPlaying, currentPlayingFile, overlay, state.queue]);

  return (
    <div 
      className={style.canvasContainer} 
      ref={canvasContainerRef} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
    >
      <BannerSection onSave={saveCanvasAsImage} step={step} />
      <canvas ref={canvasRef} className={style.canvas} onTouchEnd={handleChange} id="mycanvas"/>
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
      {isPlaying && overlay && <Overlay type={overlay} isVisible={true} />}
    </div>
  );
};

export default CanvasSection;