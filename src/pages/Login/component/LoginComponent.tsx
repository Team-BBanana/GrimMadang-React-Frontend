import { ChangeEvent, FormEvent, useState } from 'react';
import style from './LoginComponent.module.css';
import Input from '@/components/InputBox/InputBox.tsx';
import Button from '@/components/Button/Button.tsx';
import LogoImage from '@/assets/imgs/logo.svg';
import RoleSelectionModal from './RoleSelectionModal';
import Footer from '@/components/Footer/Footer';

interface LoginFormData {
    username: string;
    phoneNumber: string;
}

interface LoginProps {
    errormsg: string | null;
    success: string | null;
    onClickSubmit: (formData: LoginFormData) => void;
}

const LoginComponent: React.FC<LoginProps> = ({ errormsg, success, onClickSubmit }) => {
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        phoneNumber: '',
    });
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onClickSubmit(formData);
    };

    return (
        <div className={style.container}>
            <div className={style.content}>
                <div className={style.logoSection}>
                    <img src={LogoImage} className={style.MindinCanvasImage} alt="artGround" />
                    <p>나만의 전시회를 만들어보세요</p>
                    <h1>그림마당</h1>
                </div>
                <div className={style.loginSection}>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="이름"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="전화번호"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        <div className={style.checkboxContainer}>
                            <input type="checkbox" id="stayLoggedIn" />
                            <label htmlFor="stayLoggedIn" className={style.checkboxLabel}>
                                로그인 상태 유지
                            </label>
                        </div>

                        <div className={style.buttonContainer}>
                            <Button type="submit" className={style.loginButton}>
                                그림 그리기
                            </Button>
                        </div>

                        {errormsg && <p className="error" style={{ color: '#ff6b6b', marginTop: '10px' }}>{errormsg}</p>}
                        {success && <p className="success" style={{ color: '#a8d5ba', marginTop: '10px' }}>{success}</p>}

                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginComponent;
