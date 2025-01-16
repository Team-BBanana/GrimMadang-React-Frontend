import { useEffect, useRef, useState } from "react";
import CanvasSection from "./components/CanvasSection";
import style from "./CanvasPage.module.css";
import API from "@/api";
import { ToolPositionProvider } from '@/context/ToolPositionContext';
import bgmAudio from '/canvasTutorial/bgm.mp3';

interface saveCanvasData {
  description: string;
  imageUrl1: string;
  imageUrl2: string;
  title: string;
  feedback1: string;
  feedback2: string;
}

interface ElderInfo {
  elderId: string;
  name: string;
  phoneNumber: string;
  role: string;
  attendance_streak: number;
  attendance_total: number;
}

interface LocationState {
  topics: string;
}

interface feedBackData {
  sessionId: string;
  topic: string;
  imageUrl: string;
  currentStep: number;
}

const CanvasPage = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [s3Urls, setS3Urls] = useState<string>();
  const [elderinfo, setElderinfo] = useState<ElderInfo | null>(null);

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const helloAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const audio = new Audio();
      audio.src = bgmAudio;
      audio.loop = true;
      audio.volume = 0.3;
      bgmRef.current = audio;

      const playBGM = () => {
        bgmRef.current?.play().catch(error => {
          console.error('BGM play error:', error);
        });
      };

      document.addEventListener('click', playBGM, { once: true });

      return () => {
        bgmRef.current?.pause();
        bgmRef.current = null;
      };
    } catch (error) {
      console.error('Audio initialization error:', error);
    }
  }, []);

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

  useEffect(() => {
    // Fetch elder information and set user role
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



  const uploadCanvasImage = async (dataURL: string, step: number, topic: string) => {
    try {
      const blob = dataURLToBlob(dataURL);
      const formData = new FormData();
      formData.append(
        'file', 
        blob, 
        `canvas-image-${elderinfo?.elderId}.png`
      );

      const uploadResponse = await fetch(`${import.meta.env.VITE_UPLOAD_SERVER_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Network response was not ok: ${await uploadResponse.text()}`);
      }

      const data = await uploadResponse.json();
      setS3Urls(data.url);
      
      // handleFeedbackAPI 호출하고 응답 반환
      const feedbackResponse = await handleFeedbackAPI(step, data.url, topic);
      return feedbackResponse;  // 이 응답이 CanvasSection으로 전달됨
    } catch (error) {
      console.error('Error in uploadCanvasImage:', error);
      throw error;
    }
  };

  const dataURLToBlob = (dataURL: string) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleFeedbackAPI = async (step: number, s3Urls: string, topic: string) => {
    const stepUrl = s3Urls;

    console.log("stepUrl : " + stepUrl);
    console.log("topic : " + topic);
    console.log("step : " + step);

    if (!stepUrl) {
      console.error(`URL for step ${step} not found in s3Urls.`);
      return null;
    }

    const feedbackData: feedBackData = {
      sessionId: elderinfo?.elderId || "",
      topic: topic,
      imageUrl: stepUrl,
      currentStep: step + 1
    };

    console.log("feedbackData : " + feedbackData);

    try {
      const response = await API.canvasApi.feedBack(feedbackData);
      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error sending feedback:", error);
      throw error;
    }
  };

  const handleSaveCanvas = async () => {
    // const data: saveCanvasData = {
    //   description: elderinfo?.name + "님의" + topic + "에 대한 그림 입니다.",
    //   imageUrl1: s3Urls[0] || "",
    //   imageUrl2: s3Urls[1] || "",
    //   title: topics || "",
    //   feedback1: "그림에서 바나나의 형태가 잘 드러나도록 곡선을 자연스럽게 표현하신 점이 인상적입니다. 특히 밝고 생동감 있는 노란색은 바나나의 신선함과 활기를 잘 전달하고 있어요.(개선점 제안) 주제를 바나나로 더 명확하게 표현하려면 다음을 고려해 보세요 끝부분 디테일: 바나나의 양 끝부분(꼭지와 끝부분)을 약간 어둡게 처리하면 실제 바나나의 느낌을 더 살릴 수 있을 것 같습니다.",
    //   feedback2: "그림에서 바나나의 양 끝부분(꼭지와 끝부분)을 약간 어둡게 처리하신 점이 정말 돋보입니다! 🎨 바나나의 실제감을 훌륭히 표현해 주셨고, 끝부분의 어두운 디테일이 신선한 바나나의 느낌을 더 생동감 있게 전달하고 있어요. 특히 색상의 톤 변화가 자연스러워서 그림에 깊이를 더한 점이 인상적입니다. 😊"
    // };

    // try {
    //   const response = await API.canvasApi.saveCanvas(data);
    //   console.log(response.data);
    //   navigate('/gallery');
    // } catch (error) {
    //   console.error("Error saving canvas:", error);
    // }
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
            feedbackData={null}
          />
        </div>
    </ToolPositionProvider>
  );
};

export default CanvasPage;
