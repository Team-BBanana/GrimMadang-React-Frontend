import React, { useState } from 'react';
import style from './DisplayComponent.module.css';

import CommentList from './Comments/CommentList';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        role: string;
    };
}

interface DisplayComponentProps {
    title: string;
    imageUrl: string;
    createdTime: string;
    feedback2: string;
    userRole: string;
    onCommentSubmit: (comment: string) => void;
    comments: Comment[];
}

const DisplayComponent: React.FC<DisplayComponentProps> = ({ 
    title, 
    imageUrl, 
    createdTime, 
    feedback2, 
    userRole,
    onCommentSubmit,
    comments
}) => {
    const [commentCount, setCommentCount] = useState<number>(0);

    const handleCommentCountUpdate = (count: number) => {
        setCommentCount(count);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];  // yyyy-mm-dd 형식으로 변환
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
                            <div className={style.feedbackSection}>
                                <div className={style.feedback}>
                                    <p>{feedback2}</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.titleSection}>
                            <div className={style.titleRow}>
                                <h1 className={style.title}>{title}</h1>
                                <span className={style.createdTime}>{formatDate(createdTime)}</span>
                            </div>
                            <span className={style.commentCount}>💬 {commentCount}개의 응원글</span>
                        </div>
                    </div>
                </div>
                <div className={style.bottomSection}>
                    <CommentList 
                        onCommentCountUpdate={handleCommentCountUpdate} 
                        userRole={userRole}
                        onCommentSubmit={onCommentSubmit}
                        comments={comments}
                    />
                </div>
            </div>
        </div>
    );
};

export default DisplayComponent; 