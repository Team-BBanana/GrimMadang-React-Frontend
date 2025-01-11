import { useState } from 'react';
import style from "../CanvasPage.module.css";
import ColorPanel from './toolBar/ColorPanel';
import BrushWidth from './toolBar/brushWidth';
import { canvasInstanceAtom } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import Toolbar from './toolBar/Toolbar';

interface BannerSectionProps {
    onSave: () => void;
    step: number;
}

function BannerSection({ onSave, step }: BannerSectionProps) {
    const [brushWidth, setBrushWidth] = useState(10);
    const canvas = useAtomValue(canvasInstanceAtom);

    const handleBrushWidthChange = (width: number) => {
        setBrushWidth(width);
        if (canvas) {
            canvas.freeDrawingBrush.width = width;
            canvas.renderAll();
        }
      };
    
    return (
        <div className={style.bannerSection}>
            <ColorPanel className={style.colorPanel} />
            <div>
                <BrushWidth
                    brushWidth={brushWidth}
                    onChange={handleBrushWidthChange}
                />
            </div>
            <Toolbar brushWidth={brushWidth}/>
            <button className={style.stepButton} onClick={onSave}>
                {step === 1 ? "첫 번째 단계 완료하기" : 
                 step === 2 ? "두 번째 단계 완료하기" : 
                 step === 5 ? "다음 단계로 가기" : "저장하기"}
            </button>
        </div>
    );
}

export default BannerSection;