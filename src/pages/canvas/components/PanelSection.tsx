import style from "../CanvasPage.module.css";

interface ImagePanelProps {
  imageData: {
    title: string;
    description: string;
    image: string;
  };
  isImageCardCollapsed: boolean;
  toggleImageCard: (e: React.MouseEvent) => void;
}

const ChevronIcon = () => (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
    >
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

const ImagePanelSection = ({ imageData, isImageCardCollapsed, toggleImageCard }: ImagePanelProps) => {
  return (
    <div 
        className={`${style.imageData}`}
        onClick={toggleImageCard}
    >
        <div className={`${style.imageDataContent} ${isImageCardCollapsed ? style.collapsed : ''}`}>
            <div className={style.imageRow}>
                <img src={imageData.image} alt={imageData.description} />
                <div className={`${style.toggleIcon} ${isImageCardCollapsed ? style.toggleIconRotated : ''}`}>
                    <ChevronIcon />
                </div>
            </div>
            <div className={style.description}>
                <h3>주제: {imageData.title}</h3>
                <p>{imageData.description}</p>
            </div>
        </div>
    </div>
  );
};

export default ImagePanelSection;