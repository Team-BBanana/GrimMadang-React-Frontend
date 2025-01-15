import { useState, useEffect, useCallback } from 'react';
import style from "../CanvasPage.module.css";
import ColorPanel from './toolBar/ColorPanel';
import BrushWidth from './toolBar/brushWidth';
import { canvasInstanceAtom } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import Toolbar from './toolBar/Toolbar';
import Button from '@/components/Button/Button';
import { useToolPosition } from '@/context/ToolPositionContext';

interface BannerSectionProps {
    onSave: () => void;
    step: number;
}

function BannerSection({ onSave, step }: BannerSectionProps) {
    const [brushWidth, setBrushWidth] = useState(6);
    const canvas = useAtomValue(canvasInstanceAtom);
    const { updatePositions } = useToolPosition();

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

    const updateButtonPositions = useCallback(() => {
        const tools = document.querySelectorAll('[data-tool]');
        const positions: Record<string, DOMRect> = {};

        tools.forEach((tool) => {
            const toolType = tool.getAttribute('data-tool');
            if (toolType) {
                positions[toolType] = tool.getBoundingClientRect();
            }
        });

        updatePositions(positions);
    }, [updatePositions]);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updateButtonPositions);
        });

        const bannerSection = document.querySelector(`.${style.bannerSection}`);
        if (bannerSection) {
            observer.observe(bannerSection);
        }

        const timeoutId = setTimeout(updateButtonPositions, 100);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [updateButtonPositions]);

    return (
        <div className={style.bannerSection}>
            <div style={{alignSelf: 'center'}}>
                <ColorPanel className={style.colorPanel} />
            </div>
            <div>
                <BrushWidth
                    brushWidth={brushWidth}
                    onChange={(newWidth) => {
                        handleBrushWidthChange(newWidth);
                    }}
                    data-tool="brushWidth"
                />
            </div>
            <Toolbar brushWidth={brushWidth} />
            <div className={style.stepContainer}>   
                <StepIndicator currentStep={step === 5 ? 1 : step} />
                <div data-tool="save" style={{width: '100%'}}>
                    <Button 
                        type="button" 
                        className={style.stepButton} 
                        onClick={onSave}>
                        {step === 1 ? "1단계 완료" : 
                        step === 2 ? "2단계 완료" : 
                        step === 5 ? "다음 단계로" : "저장하기"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default BannerSection;