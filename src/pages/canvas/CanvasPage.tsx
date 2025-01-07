import { useRef, useState } from "react";
import CanvasSection from "./components/CanvasSection";
import style from "./CanvasPage.module.css";
// import API from "@/api";

const CanvasPage = () => {
  // const shouldCreateCanvas = location.state?.createNew === true;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [s3Urls, setS3Urls] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [canvasId, setCanvasId] = useState<string>("");
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const initializeCanvas = async () => {
  //     try {
  //       if (shouldCreateCanvas) {
  //         const response = await API.canvasApi.createCanvas({ title: "임시 제목" });
  //         const redirectUrl = response.data.redirect_url;
  //         if (redirectUrl) {
  //           const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
  //           const newCanvasId = urlParams.get('canvas_id') || '';
            
  //           sessionStorage.setItem('canvasId', newCanvasId);
  //           setCanvasId(newCanvasId);
  //         }
  //       } else { 
  //         const existingCanvasId = sessionStorage.getItem('canvasId') || '';
  //         if (!existingCanvasId) {
  //           console.warn('No existing canvasId found. Redirecting to main page.');
  //           navigate('/');
  //           return;
  //         }
  //         setCanvasId(existingCanvasId);
  //       }
  //     } catch (error) {
  //       console.error('Error creating canvas:', error);
  //     }
  //   };

  //   initializeCanvas();
  // }, [shouldCreateCanvas, navigate]);

  const uploadCanvasImage = (dataURL: string, step: number) => {
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
        setS3Urls(prevUrls => [...prevUrls, response.url]);
        return response.json();
      })
      .then(data => {
        console.log('File uploaded successfully:', data.url);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
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

  return (
    <div className={style.canvasContainer}>
      <CanvasSection 
        className={style.canvasSection} 
        canvasRef={canvasRef}
        onUpload={uploadCanvasImage}
        onChange={() => {}}
      />
    </div>
  );
};

export default CanvasPage;
