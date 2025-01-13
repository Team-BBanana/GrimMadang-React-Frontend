import { useState } from 'react';
import style from "../CanvasPage.module.css";
import ColorPanel from './toolBar/ColorPanel';
import BrushWidth from './toolBar/brushWidth';
import { canvasInstanceAtom } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import Toolbar from './toolBar/Toolbar';
import Button from '@/components/Button/Button';

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
    
    const StepIndicator = ({ currentStep }: { currentStep: number }) => {
        return (
            <div className={style.stepIndicator}>
                <div className={style.stepTitle}><h3>현재 단계</h3></div>
                <div className={`${style.step} ${currentStep === 1 ? style.active : ''}`}>
                    <div className={style.stepNumber}>1</div>
                </div>
                <div className={`${style.step} ${currentStep === 2 ? style.active : ''}`}>
                    <div className={style.stepNumber}>2</div>
                </div>
            </div>
        );
    };

    return (
        <div className={style.bannerSection}>
            <div style={{alignSelf: 'center'}}>
                <ColorPanel className={style.colorPanel} />
            </div>
            <div>
                <BrushWidth
                    brushWidth={brushWidth}
                    onChange={handleBrushWidthChange}
                />
            </div>
            <Toolbar brushWidth={brushWidth}/>
            <StepIndicator currentStep={step === 5 ? 1 : step} />
            <Button type="button" className={style.stepButton} onClick={onSave}>
                {step === 1 ? "1단계 완료하기" : 
                 step === 2 ? "2단계 완료하기" : 
                 step === 5 ? "다음 단계로" : "저장하기"}
            </Button>
        </div>
    );
}

export default BannerSection;