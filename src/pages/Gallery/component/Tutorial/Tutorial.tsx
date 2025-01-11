import { useEffect, useState } from 'react';
import styles from './Tutorial.module.css';

interface TutorialProps {
    onClose: () => void;
}

const Tutorial = ({ onClose }: TutorialProps) => {
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsFading(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <div 
            className={`${styles.overlay} ${isFading ? styles.fadeOut : ''}`}
            onClick={handleClose}
        >
            <div className={styles.tutorialContent}>
                <p className={styles.message}>
                    마이크를 눌러
                    <br />
                    인사해주세요!
                </p>
            </div>
        </div>
    );
};

export default Tutorial; 