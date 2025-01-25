import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import overlayAtom from '@/store/atoms/overlayAtom';
import activeToolAtom from "@/pages/canvas/components/stateActiveTool";

interface TutorialMessages {
  canvasHello: string;
  draw: string;
  brushWidth: string;
  eraser: string;
  fill: string;
  startStep: string;
  nextStep: string;
  finalStep: string;
}

export const useTutorialState = (canvas: fabric.Canvas | null) => {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [overlay, setOverlay] = useAtom(overlayAtom);
  const [activeTool] = useAtom(activeToolAtom);
  const hasInitialPlayedRef = useRef(false);
  const isFillUsedRef = useRef(false);
  const [showTitle, setShowTitle] = useState(false);

  const tutorialMessages: TutorialMessages = {
    canvasHello: "안녕하세요, 저는 오늘 그림그리기를 도와줄, 마당이라고 해요. 차근차근, 같이 멋진 작품 만들어 봐요.",
    draw: "그리기 버튼을 눌러, 동그라미를 하나 그려볼까요?",
    brushWidth: "더 큰 동그라미를 선택해서, 굵은 선을 그릴 수도 있어요.",
    eraser: "지우개 버튼을 눌러, 마음에 안드는 부분을 지워볼까요?",
    fill: "채우기 버튼을 눌러주세요. 그린 그림을 누르면, 넓은 면을 색칠 할 수 있어요.",
    startStep: "지금까지, 그림판의 사용법을 알아보았어요 이제, 그림을 그리러 가볼까요?",
    nextStep: "이제, 다음 단계로 가볼까요?",
    finalStep: "완료되었어요! 이제 저장해볼까요?"
  };

  // 캔버스 이벤트 핸들러
  useEffect(() => {
    if (!canvas) return;

    const handleEraserUse = async () => {
      if (tutorialStep === 2) {
        setOverlay('fill'); 
        setTutorialStep(3);
      }
    };

    const handleFillUse = async () => {
      if (tutorialStep === 3 && !isFillUsedRef.current) {
        isFillUsedRef.current = true;
        setOverlay(null);
        setTutorialStep(4);
        setShowTitle(true);

        // 캔버스 초기화
        if (canvas) {
          canvas.clear();
          canvas.backgroundColor = "transparent";
          canvas.renderAll();
        }
      }
    };

    const handlePathCreated = (e: fabric.IEvent) => {
      if (activeTool === 'eraser') {
        handleEraserUse();
      }
    };

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

  return {
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
  };
}; 