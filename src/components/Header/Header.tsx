import style from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import UseHeaderButtons from '@/hooks/useHeaderButtons';

const Header = () => {
    const button = UseHeaderButtons();
    const navigate = useNavigate();

    return (
        <header className={style.header}>
            <div 
                className={style.logo}
                onClick={() => navigate('/gallery')}
                style={{ cursor: 'pointer' }}
            >
                그림마당
            </div>
            <div className={style.buttonGroup}>
                {button}
            </div>
        </header>
    );
};

export default Header;
