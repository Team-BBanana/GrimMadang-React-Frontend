import React from 'react';
import style from './brushWidth.module.css';

interface BrushWidthProps {
    brushWidth: number;
    onChange: (width: number) => void;
}

const BrushWidth: React.FC<BrushWidthProps> = ({ brushWidth, onChange }) => {
    const handleBrushWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(event.target.value, 10));
    };

    return (
        <div className={style.container}>
            <label htmlFor="brushWidth" className={style.label}>펜 두께</label>
            <input
                id="brushWidth"
                type="range"
                min="1"
                max="50"
                value={brushWidth}
                onChange={handleBrushWidthChange}
                className={style.slider}
            />
            <span className={style.value}>{brushWidth}px</span>
        </div>
    );
};

export default BrushWidth;
