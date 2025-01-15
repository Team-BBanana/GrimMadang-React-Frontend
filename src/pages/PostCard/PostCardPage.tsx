import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCardComponent from './component/PostCardComponent';
import API from '@/api';
import style from './PostCardPage.module.css';

declare global {
    interface Window {
        Kakao: any;
    }
}

const PostCardPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string>('');

    useEffect(() => {
        const fetchDrawing = async () => {
            try {
                if (!id) throw new Error('이미지 ID가 없습니다.');

                const response = await API.galleryApi.getDrawing(id);
                setBackgroundImage(response.data.imageUrl1);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : '이미지를 불러오는데 실패했습니다.');
            } 
        };

        fetchDrawing();
    }, [id]);

    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
    }, []);

    const handleShare = async (imageBlob: string) => {
        try {
            const url = '/gallery/' + id;
            console.log(imageBlob);
            window.Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '내 그림을 보러 오세요!',
                    description: '전시회에 방문해서 방명록을 남겨주세요😊',
                    imageUrl: backgroundImage, // s3 URL로 변경 필요
                    link: {
                        webUrl: url,
                    },
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : '엽서 공유에 실패했습니다.');
        }
    };

    if (error) {
        return (
            <div className={style.errorContainer}>
                <p className={style.errorMessage}>{error}</p>
                <button onClick={() => navigate('/gallery')} className={style.backButton}>
                    갤러리로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <PostCardComponent
            backgroundImage={backgroundImage}
            onShare={handleShare}
        />
    );
};

export default PostCardPage;
