import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './HomeIcon.module.css';

const HomeIcon: React.FC = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/gallery');
    };

    return (
        <div className={style.homeIcon} onClick={handleHomeClick}>
            <div className={style.iconWrapper}>
                <svg width="40px" height="40px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z" fill="#ffffff"/>
                </svg>
                <span className={style.iconText}>나가기</span>
            </div>
        </div>
    );
};

export default HomeIcon; 