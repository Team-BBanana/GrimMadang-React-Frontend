import { useRef, useState } from "react";
import CanvasSection from "./components/CanvasSection";
import style from "./CanvasPage.module.css";
// import API from "@/api";

const CanvasPage = () => {
  // const shouldCreateCanvas = location.state?.createNew === true;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [s3Urls, setS3Urls] = useState<string[]>([]);

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

        return response.json();
      })
      .then(data => {

        setS3Urls(prevUrls => [...prevUrls, data.url]);

        console.log('File uploaded successfully:', data.url);

        console.log(s3Urls);

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
