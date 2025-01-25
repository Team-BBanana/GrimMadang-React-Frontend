import React, { useEffect } from 'react';

interface TutorialProps {
    onClose: () => boolean;
    isFading: boolean;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose, isFading }) => {
    useEffect(() => {
        if (isFading) {
            // 페이드 아웃 효과나 다른 동작 수행
        }
    }, [isFading]);

    // ... 나머지 코드
};

export default Tutorial; 