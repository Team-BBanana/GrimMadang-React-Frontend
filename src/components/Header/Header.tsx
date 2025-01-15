import style from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className={style.header}>
            <div className={style.logoContainer}>
                <img src={logo} alt="logo" className={style.logo} onClick={() => navigate('/')} />
            </div>
        </header>
    );
};

export default Header;
