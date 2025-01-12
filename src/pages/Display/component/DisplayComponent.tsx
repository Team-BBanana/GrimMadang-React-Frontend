import React, { useState } from 'react';
import style from './DisplayComponent.module.css';

import CommentList from './Comments/CommentList';
interface DisplayComponentProps {
    title: string;
    imageUrl: string;
    createdTime: string;
    aiComment: string;
    userRole?: string;
}

const DisplayComponent: React.FC<DisplayComponentProps> = ({ 
    title, 
    imageUrl, 
    createdTime, 
    aiComment,
    userRole = 'ROLE_FAMILY'
}) => {
    const [commentCount, setCommentCount] = useState<number>(0);

    const handleCommentCountUpdate = (count: number) => {
        setCommentCount(count);
    };

    return (
        <div className={style.container}>
            <div className={style.contentWrapper}>
                <div className={style.topSection}>
                    <div className={style.imageSection}>
                        <div className={style.frameWrapper}>
                            <img src={imageUrl} alt={title} className={style.image} />
                            <div className={style.frameOverlay}></div>
                        </div>
                    </div>
                    <div className={style.rightInfo}>
                        <div className={style.aiCommentSection}>
                            <h2 className={style.title}>작품 설명</h2>
                            <div className={style.scrollableContent}>
                                <p>{aiComment}</p>
                            </div>
                        </div>
                        <div className={style.titleSection}>
                            <div className={style.titleRow}>
                                <h1 className={style.title}>{title}</h1>
                                <span className={style.createdTime}>{createdTime}</span>
                            </div>
                            <span className={style.commentCount}>💬 {commentCount}개의 응원글</span>
                        </div>
                    </div>
                </div>
                <div className={style.bottomSection}>
                    <CommentList onCommentCountUpdate={handleCommentCountUpdate} userRole={userRole} />
                </div>
            </div>
        </div>
    );
};

export default DisplayComponent; 