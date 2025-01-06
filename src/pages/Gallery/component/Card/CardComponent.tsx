import React from "react";
import style from "./CardComponent.module.css";

interface CardComponentProps {
    imageUrl?: string;
    title?: string;
    onClick: () => void;
    isAddButton?: boolean;
    commentCount?: number;
}

const CardComponent: React.FC<CardComponentProps> = ({
    imageUrl,
    title,
    onClick,
    isAddButton,
    commentCount = 0
}) => {
    return (
        <div className={style.card} onClick={onClick}>
            {isAddButton ? (
                <>
                    <div className={style.addButton}>+</div>
                    <div className={style.cardFooter}>
                        <h2 className={style.title}>새로 그려요🎨</h2>
                    </div>
                </>
            ) : (
                <>
                    <img src={imageUrl} alt={title} className={style.image} />
                    <div className={style.cardFooter}>
                        <h2 className={style.title}>{title}</h2>
                        <div className={style.stats}>
                            <span>🗨️ {commentCount}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CardComponent; 