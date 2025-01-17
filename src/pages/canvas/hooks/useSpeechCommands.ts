import { useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface UseSpeechCommandsProps {
  currentStep: number;
  onFinishDrawing: () => void;
}

export const useSpeechCommands = ({ currentStep, onFinishDrawing }: UseSpeechCommandsProps) => {
  const commands = [
    {
      command: ['다 그렸어', '다 그렸어요', '다그려써', '다그렸어', '나 다그렸는데', '다 그렸는데', '다했는데', '다 했어', '다했어', '다했다', '다해따'],
      callback: () => {
        console.log('다 그렸어 명령 감지, currentStep:', currentStep);
        if (currentStep >= 1) {
          onFinishDrawing();
        }
      }
    }
  ];

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  const startListening = useCallback(async () => {
    if (!browserSupportsSpeechRecognition) {
      console.error('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('마이크 권한 획득');
      
      // 기존 인스턴스 중지
      SpeechRecognition.stopListening();
      
      // 약간의 지연 후 새로운 인스턴스 시작
      setTimeout(() => {
        SpeechRecognition.startListening({ 
          continuous: true,
          language: 'ko-KR'
        }).then(() => {
          console.log('음성 인식이 성공적으로 시작되었습니다.');
        }).catch((error) => {
          console.error('음성 인식 시작 실패:', error);
        });
      }, 100);
    } catch (error) {
      console.error('마이크 권한 획득 실패:', error);
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (currentStep >= 1 && !listening) {
      startListening();
    }

    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [currentStep, listening, startListening]);

  // 음성 인식 상태 모니터링
  useEffect(() => {
    console.log('음성 인식 상태:', {
      isListening: listening,
      transcriptText: transcript,
      step: currentStep
    });
  }, [listening, transcript, currentStep]);

  return {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  };
}; 