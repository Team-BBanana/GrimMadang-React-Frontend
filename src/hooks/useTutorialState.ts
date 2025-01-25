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

export const useTutorialState = (
  canvas: fabric.Canvas | null,
  onTutorialComplete: () => void,
  brushWidth: number,
  speakText: (text: string) => Promise<void>
) => {
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

  // 초기 튜토리얼 메시지 재생
  useEffect(() => {
    const playInitialTutorial = async () => {
      if (!hasInitialPlayedRef.current) {
        hasInitialPlayedRef.current = true;
        await speakText(tutorialMessages.canvasHello);
        setOverlay('pen');
        speakText(tutorialMessages.draw);
      }
    };

    const timeoutId = setTimeout(() => {
      playInitialTutorial();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // 캔버스 이벤트 핸들러
  useEffect(() => {
    if (!canvas) return;

    let isBrushWidthChanged = false;
    let isPathCreated = false;

    // 브러시 두께 변경 감지
    const handleBrushWidthChange = async () => {
      if (tutorialStep === 1) {
        if (isBrushWidthChanged && isPathCreated) {
          setOverlay('eraser');
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

    // 지우개 사용 감지
    const handleEraserUse = async () => {
      if (tutorialStep === 2) {
        setOverlay('fill');
        setTutorialStep(3);
        await speakText(tutorialMessages.fill);
      }
    };

    // 채우기 도구 사용 감지
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

        // 튜토리얼 완료 콜백 호출
        onTutorialComplete();
      }
    };

    // 통합된 path:created 핸들러
    const handlePathCreated = async () => {
      if (tutorialStep === 0) {
        setOverlay('brushWidth');
        setTutorialStep(1);
        await speakText(tutorialMessages.brushWidth);
      } else if (activeTool === 'eraser') {
        handleEraserUse();
      }
      isPathCreated = true;
      handleBrushWidthChange();
    };

    const handleCanvasChange = () => {
      if (activeTool === 'fill') {
        handleFillUse();
      }
    };

    // 이벤트 리스너 등록
    const brushWidthElement = document.querySelector('[data-tool="brushWidth"]');
    if (brushWidthElement) {
      brushWidthElement.addEventListener('click', checkBrushWidthChange);
    }

    canvas.on('path:created', handlePathCreated);
    canvas.on('object:modified', handleCanvasChange);
    canvas.on('object:added', handleCanvasChange);
    canvas.on('object:removed', handleCanvasChange);
    canvas.on('mouse:up', handleCanvasChange);

    // 클린업
    return () => {
      if (brushWidthElement) {
        brushWidthElement.removeEventListener('click', checkBrushWidthChange);
      }
      canvas.off('path:created', handlePathCreated);
      canvas.off('object:modified', handleCanvasChange);
      canvas.off('object:added', handleCanvasChange);
      canvas.off('object:removed', handleCanvasChange);
      canvas.off('mouse:up', handleCanvasChange);
    };
  }, [canvas, tutorialStep, activeTool, brushWidth, speakText]);

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