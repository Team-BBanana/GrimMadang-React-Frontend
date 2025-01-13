import { useState } from 'react';
import style from './module/brushWidth.module.css';

interface BrushWidthProps {
    brushWidth: number;
    onChange: (width: number) => void;
}

const brushSizes = [5, 13, 21, 29, 37, 45];

function BrushWidth({ onChange }: BrushWidthProps) {
    const [selectedBrushWidth, setSelectedBrushWidth] = useState(brushSizes[1]);

    const handleCircleClick = (size: number) => {
        setSelectedBrushWidth(size);
        onChange(size);
    };

    return (
        <div className={style.container}>
            <div className={style.circleContainer}>
                {brushSizes.map(size => (
                    <div
                        key={size}
                        className={`${style.circle} ${selectedBrushWidth === size ? style.active : ''}`}
                        data-size={size}
                        onClick={() => handleCircleClick(size)}
                    />
                ))}
            </div>
        </div>
    );
}

export default BrushWidth;
