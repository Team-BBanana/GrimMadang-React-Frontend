import style from "../CanvasPage.module.css";

interface LoadingModalProps {
  isVisible: boolean;
}

const LoadingModal = ({ isVisible }: LoadingModalProps) => {
  if (!isVisible) return null;

  return (
    <div className={style.overlay}>
      <div className={style.overlayContent}>
        <div className={style.loadingSpinner}></div>
        <p>잠시만요! 도움말을 드릴게요😊</p>
      </div>
    </div>
  );
};

export default LoadingModal; 