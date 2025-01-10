import React from 'react';
import style from './module/brushWidth.module.css';

interface BrushWidthProps {
    brushWidth: number;
    onChange: (width: number) => void;
}

function BrushWidth({ brushWidth, onChange }: BrushWidthProps) {
    const handleBrushWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(event.target.value, 10));
    };

    return (
        <div className={style.container}>
            <label htmlFor="brushWidth" className={style.label}>붓 두께: {brushWidth}</label>
            <input
                id="brushWidth"
                type="range"
                min="1"
                max="50"
                value={brushWidth}
                onChange={handleBrushWidthChange}
                className={style.slider}
            />
        </div>
    );
}

export default BrushWidth;
