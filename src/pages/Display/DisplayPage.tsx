import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DisplayComponent from './component/DisplayComponent';

interface ImageData {
    imageUrl: string;
    title: string;
    createdTime: string;
}

const mockImageData: ImageData = {
    imageUrl: '/display_Mock_Image/tiger.png',
    title: "호랭쓰",
    createdTime: "2025-01-06"
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
            <DisplayComponent title={imageData.title} imageUrl={imageData.imageUrl} createdTime={imageData.createdTime} />
        </>
    );
};

export default DisplayPage; 