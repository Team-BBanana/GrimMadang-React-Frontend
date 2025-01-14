import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCardComponent from './component/PostCardComponent';
import API from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import style from './PostCardPage.module.css';

interface PostCardData {
    imageUrl: string;
    title: string;
    content: string;
}

const PostCardPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string>('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (!id) throw new Error('이미지 ID가 없습니다.');
                
                setLoading(true);
                const imageData = await API.galleryApi.getDrawing(id);
                setBackgroundImage(imageData.data.imageUrl);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : '이미지를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [id]);

    const handleShare = async (title: string, content: string) => {
        try {
            if (!id) throw new Error('이미지 ID가 없습니다.');
            
            setLoading(true);
            await API.postCardApi.sharePostCard({
                imageId: id,
                title,
                content
            });
            
            // 공유 성공 후 갤러리 페이지로 이동
            navigate('/gallery');
        } catch (err) {
            setError(err instanceof Error ? err.message : '엽서 공유에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={style.loadingContainer}>
                <LoadingSpinner />
            </div>
        );
    }

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
