import style from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import UseHeaderButtons from '@/hooks/useHeaderButtons';
import logo from '@/assets/logo.png'; // 로고를 JS 변수로 임포트

const Header = () => {
    const button = UseHeaderButtons();
    const navigate = useNavigate();

    return (
        <header className={style.header}>
            <div className={style.logoContainer}>
                <img src={logo} alt="logo" className={style.logo} onClick={() => navigate('/')} /> {/* 동적으로 로고 렌더링 */}
            </div>
        </header>
    );
};

export default Header;
