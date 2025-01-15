import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DisplayComponent from './component/DisplayComponent';
import API from '@/api';
import postCardAudio from "/canvasTutorial/postCardAudio.wav"

interface Drawing {
    id: string;
    user: {
        id: string;
        name: string;
    };
    title: string;
    imageUrl1: string;
    imageUrl2: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface Feedback {
    id: string;  // UUID
    drawing: {
        id: string;
    };
    feedback1: string;
    feedback2: string;
    createdAt: string;
    updatedAt: string;
}

interface ElderInfo {
    elderId: string;
    name: string;
    phoneNumber: string;
    role: string;
    attendance_streak: number;
    attendance_total: number;
}

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

const DisplayPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [imageData, setImageData] = useState<Drawing | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [elderinfo, setElderinfo] = useState<ElderInfo | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const audio = new Audio(postCardAudio);
        const timer = setTimeout(() => {
            audio.play();
        }, 2000); 

        return () => {
            clearTimeout(timer); 
            audio.pause();
            audio.currentTime = 0; 
        };
    }, []);

    const fetchComments = async () => {
        try {
            if (!id) return;
            const response = await API.galleryApi.getComments(id);
            if (response.status === 200) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;
                
                // 그림 정보 가져오기
                const drawingResponse = await API.galleryApi.getDrawing(id);
                setImageData(drawingResponse.data);

                // 피드백 가져오기
                const feedbackResponse = await API.galleryApi.getFeedbacks(id);
                setFeedback(feedbackResponse.data);

                // elderinfo 가져오기
                const elderResponse = await API.userApi.getElderInfo();
                if (elderResponse.status === 200) {
                    const elderData = elderResponse.data as ElderInfo;
                    setElderinfo(elderData);
                }

                // 댓글 가져오기
                await fetchComments();

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleCommentSubmit = async (comment: string) => {
        try {
            if (!id) return;
            
            const response = await API.galleryApi.createComment({
                drawingId: id,
                content: comment
            });

            if (response.status === 200) {
                console.log('Comment saved successfully');
                // 댓글 목록 새로고침
                await fetchComments();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    if (!imageData || !feedback || !elderinfo) {
        return <div>로딩 중...</div>;
    }

    return (
        <>
            <DisplayComponent 
                id={id || ''}
                title={imageData.title} 
                imageUrl={imageData.imageUrl2} 
                createdTime={imageData.createdAt} 
                feedback2={feedback.feedback2}
                userRole={elderinfo.role}
                onCommentSubmit={handleCommentSubmit}
                comments={comments}
            />
        </>
    );
};

export default DisplayPage; 