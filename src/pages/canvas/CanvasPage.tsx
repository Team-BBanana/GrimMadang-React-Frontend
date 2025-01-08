import { useEffect, useRef, useState } from "react";
import CanvasSection from "./components/CanvasSection";
import style from "./CanvasPage.module.css";
import API from "@/api";
// import API from "@/api";


interface feedBackData {
  sessionId: string;
  name: string;
  topic: string;
  phase: number;
  imageData: string;
}


const CanvasPage = () => {
  // const shouldCreateCanvas = location.state?.createNew === true;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [s3Urls, setS3Urls] = useState<string[]>([]);
  const [FeedBackData, setFeedBackData] = useState<any>(null);
  const [step, setStep] = useState(1);

  const uploadCanvasImage = (dataURL: string, step: number) => {
    setStep(step);
    const blob = dataURLToBlob(dataURL);

    const formData = new FormData();
    formData.append('file', blob, `canvas-image-step-${step}.png`);

    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Network response was not ok: ${text}`);
          });
        }

        return response.json();
      })
      .then(data => {
        setS3Urls(prevUrls => [...prevUrls, data.url]); // 상태 업데이트
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  // s3Urls 상태가 업데이트될 때마다 실행
  useEffect(() => {
    if (s3Urls.length > 0) {
      console.log('Updated s3Urls:', s3Urls);
      handleFeedbackAPI(step);
    }
  }, [s3Urls]);


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


  const handleFeedbackAPI = async (step: number) => {

    const stepUrl = await s3Urls.find(url => url.includes(`step-${step}`));


    console.log( "stepUrl : "+  stepUrl);

    if (!stepUrl) {
      console.error(`URL for step ${step} not found in s3Urls.`);
      return;
    }

    setFeedBackData({
      title: "피드백",
      description: "그림에서 바나나의 형태가 잘 드러나도록 곡선을 자연스럽게 표현하신 점이 인상적입니다. 특히 밝고 생동감 있는 노란색은 바나나의 신선함과 활기를 잘 전달하고 있어요.(개선점 제안) 주제를 바나나로 더 명확하게 표현하려면 다음을 고려해 보세요 끝부분 디테일: 바나나의 양 끝부분(꼭지와 끝부분)을 약간 어둡게 처리하면 실제 바나나의 느낌을 더 살릴 수 있을 것 같습니다."
    });

    const feedbackData: feedBackData = {
      sessionId: "your_session_id",
      name: "User Name",
      topic: "Banana",
      phase: step,
      imageData: stepUrl
    };

    try {
      const response = await API.canvasApi.feedBack(feedbackData); // Call the feedback API
      return response.data;
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  return (
    <div className={style.canvasContainer}>
      <CanvasSection 
        className={style.canvasSection} 
        canvasRef={canvasRef}
        onUpload={uploadCanvasImage}
        onChange={() => {}}
        feedbackData={FeedBackData}
      />
    </div>
  );
};

export default CanvasPage;
