import style from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import useHeaderButtons from '@/hooks/useHeaderButtons';

const Header = () => {
    const button = useHeaderButtons();
    const navigate = useNavigate();

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
                {button}
            </div>
        </header>
    );
};

export default Header;
