import React, { useState } from 'react';
import style from './DisplayComponent.module.css';
import CommentList from './Comments/CommentList';

interface DisplayComponentProps {
    title: string;
    imageUrl: string;
    createdTime: string;
}

const DisplayComponent: React.FC<DisplayComponentProps> = ({ title, imageUrl, createdTime }) => {
    const [commentCount, setCommentCount] = useState<number>(0);

    const handleCommentCountUpdate = (count: number) => {
        setCommentCount(count);
    };

    return (
        <div className={style.container}>
            <div className={style.headerContainer}>
                <h1 className={style.title}>{title}</h1>
                <span className={style.createdTime}>{createdTime}</span>
            </div>
            <div className={style.contentWrapper}>
                <div className={style.imageSection}>
                    <img src={imageUrl} alt={title} className={style.image} />
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