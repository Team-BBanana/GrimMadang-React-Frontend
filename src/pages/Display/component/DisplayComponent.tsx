import React, { useState } from 'react';
import style from './DisplayComponent.module.css';
import CommentList from './Comments/CommentList';

interface DisplayComponentProps {
    title: string;
    imageUrl: string;
    createdTime: string;
    aiComment: string;
}

const DisplayComponent: React.FC<DisplayComponentProps> = ({ title, imageUrl, createdTime, aiComment }) => {
    const [commentCount, setCommentCount] = useState<number>(0);
    const [isClicked, setIsClicked] = useState(false);

    const handleCommentCountUpdate = (count: number) => {
        setCommentCount(count);
    };

    const handleImageClick = () => {
        setIsClicked(!isClicked);
    };

    return (
        <div className={style.container}>
            <div className={style.headerContainer}>
                <h1 className={style.title}>{title}</h1>
                <span className={style.createdTime}>{createdTime}</span>
                {!isClicked && <div className={style.hintModal}>그림을 눌러 도우미의 조언을 들어보세요</div>}
            </div>
            <div className={style.contentWrapper}>
                <div className={style.imageSection} onClick={handleImageClick}>
                    <img src={imageUrl} alt={title} className={style.image} />
                    {isClicked && (
                        <div className={style.aiCommentOverlay}>
                            <div className={style.aiCommentText}>
                                <h3 className={style.aiCommentTitle}>도우미의 조언</h3>
                                {aiComment.split('\n').map((text, index) => (
                                    <p key={index}>{text}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className={style.commentSection}>
                    <span className={style.commentCount}>💬 {commentCount}개의 댓글</span>
                    <CommentList onCommentCountUpdate={handleCommentCountUpdate} />
                </div>
            </div>
        </div>
    );
};

export default DisplayComponent; 