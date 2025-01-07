import { useNavigate } from "react-router-dom";
import style from "./main-content/GalleryComponent.module.css";
import CardComponent from "./Card/CardComponent";
import { cardData } from "./Card/cardData";

const FamilyComponent = ({ elderName }: { elderName: string }) => {
    const navigate = useNavigate();

    return (
        <div className={style.container}>
            <h1 className={style.title}>{elderName}님의 그림 전시회</h1>
            <div className={style.cardGrid}>
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

export default FamilyComponent;
