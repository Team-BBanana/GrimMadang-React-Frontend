import { useEffect, useState } from 'react';
import styles from './Tutorial.module.css';

interface TutorialProps {
    onClose: boolean;
}

const Tutorial = ({ onClose }: TutorialProps) => {
    const [isFading, setIsFading] = useState(false);
    const [shouldUnmount, setShouldUnmount] = useState(false);

    useEffect(() => {
        if (onClose) {
            setIsFading(true);
            // 페이드아웃 애니메이션 시간(1초)이 끝난 후 언마운트 상태를 true로 설정
            const timer = setTimeout(() => {
                setShouldUnmount(true);
            }, 1000); // CSS의 fadeOut 애니메이션 시간과 동일하게 설정

            return () => clearTimeout(timer);
        }
    }, [onClose]);

    if (shouldUnmount) return null;

    return (
        <div className={`${styles.overlay} ${isFading ? styles.fadeOut : ''}`}>
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