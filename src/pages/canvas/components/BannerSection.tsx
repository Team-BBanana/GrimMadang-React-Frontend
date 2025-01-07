import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "@/components/Button/Button.tsx";
import Toolbar from "@/pages/canvas/components/Toolbar.tsx";

import style from "../CanvasPage.module.css"

interface BannerSectionProps {
    onSave: () => void;
    step: number;
}

const BannerSection: React.FC<BannerSectionProps> = ({ onSave, step }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/gallery'); // Navigate to the root path
    };

    return (
        <div className={style.bannerSection}>
            <Button type="button" className={style.bannerButton} onClick={handleBack}>
                뒤로
            </Button>

            <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Toolbar />
            </div>

            <Button type="button" className={style.bannerButton} onClick={onSave}>
                {step === 1 ? "1단계 완료" : step === 2 ? "2단계 완료" : "저장"}
            </Button>
        </div>
    );
};

export default BannerSection;