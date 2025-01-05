import style from './Header.module.css';
import ReportIcon from '@/assets/imgs/report.svg';
import { useNavigate } from 'react-router-dom';
import API from '@/api';
import { AxiosError } from 'axios';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await API.userApi.logoutUser();
            console.log(response.data);
            if (response.status === 200) {
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response && error.response.status === 401) {
                console.error('Unauthorized: Redirecting to login');
                navigate('/login');
            } else {
                console.error('Error during logout:', error);
            }
        }
    };

    return (
        <header className={style.header}>
            <div 
                className={style.logo}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            >
                그림마당
            </div>
            <div className={style.buttonGroup}>
                <button className={style.settingsButton} onClick={() => navigate('/report')}>
                    <img src={ReportIcon} alt="settings" height="40" />
                </button>
                <button className={style.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
