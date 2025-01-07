import { useNavigate } from "react-router-dom";
import style from "./GalleryComponent.module.css";
import CardComponent from "../Card/CardComponent";
import { cardData } from "../Card/cardData";

const GalleryComponent: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateNewCanvas = () => {
        navigate('/canvas', { state: { createNew: true } });
    };

    return (
        <div className={style.container}>
            <h1 className={style.title}>내 그림 모아보기</h1>
            <div className={style.cardGrid}>
                <CardComponent
                    isAddButton={true}
                    onClick={handleCreateNewCanvas}
                />
                {cardData.map((card, index) => (
                    <CardComponent
                        key={index}
                        imageUrl={card.imageUrl}
                        title={card.title}
                        onClick={() => navigate(`/gallery/${index + 1}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GalleryComponent;
