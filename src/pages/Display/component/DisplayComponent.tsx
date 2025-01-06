import React from 'react';
import style from './DisplayComponent.module.css';
import Button from '@/components/Button/Button';
import { useNavigate } from 'react-router-dom';

interface DisplayComponentProps {
    title: string;
    imageUrl: string;
}

const DisplayComponent: React.FC<DisplayComponentProps> = ({ title, imageUrl }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    const handleContinue = () => {
        navigate('/canvas', { state: { imageUrl } });
    };

    return (
        <div className={style.container}>
            <div className={style.buttonContainer}>
                <Button type="button" onClick={handleBack}>뒤로가기</Button>
                <Button type="button" onClick={handleContinue}>친구만들기</Button>
            </div>
            <h1 className={style.title}>{title}</h1>
            <div className={style.imageContainer}>
                <img src={imageUrl} alt={title} className={style.backgroundImage} />
            </div>
            <div className={style.infoContainer}>
                <span>❤️ 12명이 좋아합니다.</span>
                <span>👁️ 293</span>
            </div>
        </div>
    );
};

export default DisplayComponent; 