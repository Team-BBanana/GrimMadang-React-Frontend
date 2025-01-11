import React from 'react';
import style from './WelcomeModal.module.css'; // Create a CSS module for styling
import Button from '@/components/Button/Button';

interface WelcomeModalProps {
    onClose: () => void; // Function to close the modal
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h2>저희 서비스를 처음 와주셨군요!</h2>
                <p>사용해보시겠어요?</p>
                <Button type="button" onClick={onClose}>
                    시작하기
                </Button>
            </div>
        </div>
    );
};

export default WelcomeModal; 