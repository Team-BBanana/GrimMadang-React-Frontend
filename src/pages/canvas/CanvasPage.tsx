import { useRef } from "react";
import CanvasSection from "./components/CanvasSection";
import style from "./CanvasPage.module.css";
// import API from "@/api";

const CanvasPage = () => {
  // const shouldCreateCanvas = location.state?.createNew === true;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  return (
    <div className={style.canvasContainer}>
      <CanvasSection 
        className={style.canvasSection} 
        canvasRef={canvasRef}
        onUpload={() => {}}
        onChange={() => {}}
      />
    </div>
  );
};

export default CanvasPage;
