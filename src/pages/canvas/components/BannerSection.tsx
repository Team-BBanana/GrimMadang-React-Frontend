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
        setTimeout(() => {
            const tools = document.querySelectorAll('[data-tool]');
            const positions: Record<string, DOMRect> = {};

            tools.forEach((tool) => {
                const toolType = tool.getAttribute('data-tool');
                if (toolType) {
                    const rect = tool.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        positions[toolType] = rect;
                    }
                }
            });

            if (Object.keys(positions).length > 0) {
                updatePositions(positions);
            }
        }, 50);
    }, [updatePositions]);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updateButtonPositions);
        });

        const bannerSection = document.querySelector(`.${style.bannerSection}`);
        if (bannerSection) {
            observer.observe(bannerSection);
        }

        // DOM이 완전히 렌더링될 때까지 약간의 지연을 줍니다
        const timeoutId = setTimeout(updateButtonPositions, 300);

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
                
            </div>
        </div>
    );
}

export default BannerSection;