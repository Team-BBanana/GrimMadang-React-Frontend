import { useEffect, useState } from 'react';
import styles from './Tutorial.module.css';

interface TutorialProps {
    onClose : boolean;
}

const Tutorial = ({ onClose }: TutorialProps) => {

    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        setIsFading(onClose);
    }, [onClose]);


    return (
        <div 
            className={`${styles.overlay} ${isFading ? styles.fadeOut : ''}`}
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