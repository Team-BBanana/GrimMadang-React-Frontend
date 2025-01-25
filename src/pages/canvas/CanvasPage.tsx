import { useEffect, useRef, useState } from "react";
import CanvasSection from "./components/CanvasSection";
import style from "./CanvasPage.module.css";
import API from "@/api";
import { ToolPositionProvider } from '@/context/ToolPositionContext';
import bgmAudio from '/canvasTutorial/bgm.mp3';
import { useNavigate } from "react-router-dom";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { canvasService } from "@/services/canvasService";

// 어르신 정보 인터페이스
interface ElderInfo {
  elderId: string;           // 어르신 ID
  name: string;              // 이름
  phoneNumber: string;       // 전화번호
  role: string;             // 역할
  attendance_streak: number; // 연속 출석 일수
  attendance_total: number;  // 총 출석 일수
}

const CanvasPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elderinfo, setElderinfo] = useState<ElderInfo | null>(null);
  const [feedbackData, setFeedbackData] = useState<{ feedback: string } | null>(null);

  // 배경음악 재생을 위한 커스텀 훅 사용
  const helloAudioRef = useBackgroundMusic(bgmAudio);

  // 초기 오디오 재생 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      helloAudioRef.current?.play().catch(error => console.error('Audio play error:', error));
    }, 1000);

    return () => {
      clearTimeout(timer);
      helloAudioRef.current?.pause();
      helloAudioRef.current = null;
    };
  }, []);

  // 어르신 정보 가져오기
  useEffect(() => {
    const fetchElderName = async () => {
        try {
            const response = await API.userApi.getElderInfo();
            if (response.status === 200) {
                const elderData = response.data as ElderInfo;
                console.log('elderData:', elderData);
                setElderinfo(elderData);
            }
        } catch (error) {
            console.error('getElderName 실패:', error);
        }
    };

    fetchElderName();
  }, []);

  // 캔버스 이미지 업로드 및 피드백 요청 함수
  const uploadCanvasImage = async (dataURL: string, step: number, topic: string) => {
    try {
      const imageUrl = await canvasService.uploadImage(dataURL, elderinfo?.elderId || "");

      if(step === 3) {
        return imageUrl;
      }

      const feedbackResponse = await canvasService.getFeedback({
        sessionId: elderinfo?.elderId || "",
        topic,
        imageUrl,
        currentStep: step
      });

      setFeedbackData(feedbackResponse);
      return feedbackResponse;
    } catch (error) {
      console.error('Error in uploadCanvasImage:', error);
      throw error;
    }
  };

  // 최종 캔버스 저장 함수
  const handleSaveCanvas = async (title: string, secondfeedback: string, imageUrl: string) => {
    try {
      const saveData = {
        description: secondfeedback || "",
        imageUrl1: "none",
        imageUrl2: imageUrl || "",
        title: title || "",
        feedback1: feedbackData?.feedback || "",
        feedback2: feedbackData?.feedback || ""
      };

      const response = await canvasService.saveCanvas(saveData);
      console.log('Canvas saved successfully:', response);
      navigate(`/gallery/${response}`);
    } catch (error) {
      console.error("Error saving canvas:", error);
    }
  };

  return (
    <ToolPositionProvider>
        <div className={style.canvasContainer}>
          <CanvasSection 
            className={style.canvasSection} 
            canvasRef={canvasRef}
            onUpload={uploadCanvasImage}
            onChange={() => {}}
            onFinalSave={handleSaveCanvas}
            feedbackData={feedbackData}
          />
        </div>
    </ToolPositionProvider>
  );
};

export default CanvasPage;
