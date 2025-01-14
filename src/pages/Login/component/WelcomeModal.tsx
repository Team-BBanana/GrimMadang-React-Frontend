import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button/Button';
import style from './WelcomeModal.module.css';

interface WelcomeModalProps {
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [isFamily, setIsFamily] = useState(false);

    const handleStart = () => {
        if (isFamily) {
            navigate('/signup');
        } else {
            onClose();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={style.modalOverlay} onClick={handleOverlayClick}>
            <div className={style.modalContent}>
                <h2>처음 방문해주셨네요!</h2>
                <div className={style.checkboxWrapper}>
                    <label className={style.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={isFamily}
                            onChange={(e) => setIsFamily(e.target.checked)}
                            className={style.checkbox}
                        />
                        우리 가족의 그림을 보러 왔어요!
                    </label>
                </div>
                <Button type="button" onClick={handleStart}>
                    시작하기
                </Button>
            </div>
        </div>
    );
};

export default WelcomeModal; 