import API from "@/api";
import { dataURLToBlob, generateRandomString } from "@/utils/imageUtils";

// 캔버스 저장 데이터 인터페이스
interface SaveCanvasData {
  description: string;    // 그림 설명
  imageUrl1: string;      // 첫 번째 이미지 URL
  imageUrl2: string;      // 두 번째 이미지 URL
  title: string;         // 그림 제목
  feedback1: string;     // 첫 번째 피드백
  feedback2: string;     // 두 번째 피드백
}

// 피드백 요청 데이터 인터페이스
interface FeedBackData {
  sessionId: string;     // 사용자 세션 ID
  topic: string;         // 그림 주제
  imageUrl: string;      // 이미지 URL
  currentStep: number;   // 현재 단계
}

export const canvasService = {
  // 캔버스 이미지를 서버에 업로드하는 함수
  uploadImage: async (dataURL: string, elderId: string) => {
    const blob = dataURLToBlob(dataURL);
    const formData = new FormData();
    const randomStr = generateRandomString();
    // 파일명 형식: canvas-image-step-{사용자ID}-{랜덤문자열}.png
    formData.append(
      'file', 
      blob, 
      `canvas-image-step-${elderId}-${randomStr}.png`
    );

    const response = await fetch(`${import.meta.env.VITE_UPLOAD_SERVER_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${await response.text()}`);
    }

    const data = await response.json();
    return data.url;
  },

  // AI 피드백을 요청하는 함수
  getFeedback: async (feedbackData: FeedBackData) => {
    const response = await API.canvasApi.feedBack(feedbackData);
    return response.data;
  },

  // 완성된 캔버스를 저장하는 함수
  saveCanvas: async (saveData: SaveCanvasData) => {
    const response = await API.canvasApi.saveCanvas(saveData);
    return response.data;
  }
}; 