import style from "./PanelSection.module.css";

interface ImagePanelProps {
  imageData: {
    title: string;
    description: string;
    image: string;
  };
}

const ImagePanelSection = ({ imageData }: ImagePanelProps) => {
  return (
    <div 
        className={style.imageData}
    >
        <div className={style.imageDataContent}>
            <img src={imageData.image} alt={imageData.description} />
            <div className={style.title}>{imageData.title}</div>
        </div>
    </div>
  );
};

export default ImagePanelSection;