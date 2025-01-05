import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "@/components/recycleComponent/Button/Button.tsx";
import Toolbar from "@/pages/Canvas/components/Toolbar.tsx";

import style from "../CanvasPage.module.css"

interface BannerSectionProps {
    onSave: () => void;
}

const BannerSection: React.FC<BannerSectionProps> = ({ onSave }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/'); // Navigate to the root path
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
                저장
            </Button>
        </div>
    );
};

export default BannerSection;