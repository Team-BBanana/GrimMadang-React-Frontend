import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DisplayComponent from './component/DisplayComponent';
import API from '@/api';
import HomeIcon from '@/components/HomeIcon/HomeIcon';
import { useElderInfo } from '@/hooks/useElderInfo';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

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
    const [comments, setComments] = useState<Comment[]>([]);
    const { elderInfo, isLoading, error } = useElderInfo();
    const { speakText, cleanup } = useSpeechSynthesis();


    useEffect(() => {
        if (elderInfo) {
            const message = elderInfo.role === 'ROLE_ELDER'
                ? "그림을 눌러 가족에게 보낼 엽서를 만들어 보세요"
                : "응원의 한마디를 남겨보세요";
            
            const timer = setTimeout(() => {
                speakText(message);
            }, elderInfo.role === 'ROLE_ELDER' ? 4000 : 1000); // ROLE_ELDER는 기존 오디오 후에 재생

            return () => {
                clearTimeout(timer);
                cleanup();
            };
        }
    }, [elderInfo]);

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

    if (!imageData || !feedback || !elderInfo || isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>에러가 발생했습니다: {error.message}</div>;
    }

    return (
        <>
            <HomeIcon />
            <DisplayComponent 
                id={id || ''}
                title={imageData.title} 
                imageUrl={imageData.imageUrl2} 
                createdTime={imageData.createdAt} 
                feedback2={feedback.feedback2}
                userRole={elderInfo.role}
                onCommentSubmit={handleCommentSubmit}
                comments={comments}
            />
        </>
    );
};

export default DisplayPage; 