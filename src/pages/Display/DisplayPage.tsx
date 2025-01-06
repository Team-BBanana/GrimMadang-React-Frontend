import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DisplayComponent from './component/DisplayComponent';

interface ImageData {
    imageUrl: string;
    title: string;
    createdTime: string;
    aiComment: string;
}

const mockImageData: ImageData = {
    imageUrl: '/display_Mock_Image/tiger.png',
    title: "호랭쓰",
    createdTime: "2025-01-06",
    aiComment: `김먕먕 할머니의 "호랭쓰"는 참 따뜻하고 사랑스러운 그림이에요.
                주황색과 검정 줄무늬가 어우러진 호랭이 캐릭터가 귀엽고 독특하게 표현되어 있네요. 길쭉한 목과 귀여운 귀, 뾰족한 발톱이 특히 눈에 띄고, 할머니의 창의력이 가득 담긴 모습이에요.
                푸른 초록 배경 위에 서 있는 모습이 마치 자연 속에서 편안하게 노는 호랭이 같아 마음을 편안하게 해줘요. 크레용의 따스한 질감 덕분에 그림이 더욱 포근하고 정감 있게 다가옵니다.
                이 그림을 통해 할머니의 따뜻한 마음과 손주를 향한 사랑이 느껴져서 참 기분이 좋아지네요.`
}

const DisplayPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [imageData, setImageData] = useState<ImageData | null>(null);

    useEffect(() => {
        setImageData(mockImageData);
    }, [id]);
    
    if (!imageData) {
        return <div>로딩 중...</div>;
    }
    return (
        <>
            <DisplayComponent title={imageData.title} imageUrl={imageData.imageUrl} createdTime={imageData.createdTime} aiComment={imageData.aiComment} />
        </>
    );
};

export default DisplayPage; 