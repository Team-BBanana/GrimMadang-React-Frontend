import React, { useState, useEffect } from 'react';
import style from './Overlay.module.css';
import { useToolPosition } from '@/context/ToolPositionContext';

interface OverlayProps {
  type: string;
  isVisible: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ type, isVisible }) => {
  const { positions } = useToolPosition();
  const position = positions[type];
  const [isOverlayVisible, setIsOverlayVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsOverlayVisible(true);
    } else {
      const timer = setTimeout(() => setIsOverlayVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!position) {
    console.log('Position not found for type:', type);
    return null;
  }

  return (
    isOverlayVisible && (
      <div className={`${style.overlay} ${!isVisible ? style.fadeOut : ''}`}>
        <div 
          className={style.highlight}
          style={{
            top: position.top - 5,
            left: position.left - 5,
            width: position.width + 10,
            height: position.height + 10,
          }}
        />
      </div>
    )
  );
};

export default Overlay; 