import React from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api';
import style from './LogoutButton.module.css';

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const removeTutorialCookie = () => {
        document.cookie = 'tutorialShown=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    const handleLogout = async () => {
        try {
            const response = await API.userApi.logoutUser();
            if (response.status === 200) {
                removeTutorialCookie();
                navigate('/');
            }
        } catch (error) {
            removeTutorialCookie();
            navigate('/');
        }
    };

    return (
        <button className={style.logoutButton} onClick={handleLogout}>
            <div className={style.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12H16" 
                          stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>나가기</span>
            </div>
        </button>
    );
};

export default LogoutButton; 