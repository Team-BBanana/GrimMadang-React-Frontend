import {ChangeEvent, FormEvent, useRef, useState} from "react";
import style from "./LoginComponent.module.css"
import Input from "@/components/InputBox/InputBox.tsx";
import Button from "@/components/Button/Button.tsx";
import { useNavigate } from "react-router-dom";
import Logo from '@/assets/imgs/textLogo.png';
import LogoImage from '@/assets/imgs/logo.svg';


interface LoginFormData {
    name: string;
    phoneNumber: string;
}

interface LoginProps {
    errormsg: string | null;
    success: string | null;
    onClickSubmit: (formData: LoginFormData) => void;
}

const LoginComponent: React.FC<LoginProps> = ({ errormsg, success, onClickSubmit }) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();


    const [formData, setFormData] = useState<LoginFormData>({
        name: '',
        phoneNumber: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const name = nameRef.current?.value || "";
        const phoneNumber = phoneNumberRef.current?.value || "";
        await onClickSubmit({ name, phoneNumber });
        if (success) {
            navigate('/canvas');
        }
    };

    const handleClick = (path: string) => {
        navigate(path);
    };

    // const handleClickGoogleLogin = (path: string) => {
    //     window.location.href = path;
    // };

    return (
        <div className={style.container}>
            <div className={style.content}>
                <img src={LogoImage} className={style.MindinCanvasImage} alt="artGround" />

                <div className={style.loginbox}>

                    <img src={Logo} alt="text logo" className={style.TextLogoImage} />


                    <div className={style.loginContainer}>
                        <form onSubmit={handleSubmit} >
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="이름"
                                value={formData.name}
                                onChange={handleChange}
                                ref={nameRef}
                                required
                            />
                            <Input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="전화번호"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                ref={phoneNumberRef}
                                required
                            />
                            <div className={style.checkboxContainer}>
                                <input type="checkbox" id="stayLoggedIn" />
                                <span className={style.checkboxLabel}>로그인 상태 유지</span>
                            </div>

                            {errormsg && <p className="error" style={{ whiteSpace: 'pre-wrap' }}>{errormsg}</p>}
                            {success && <p className="success">{success}</p>}

                            
                            <div >
                                <div className={style.buttonContainer}>
                                    <Button type="submit" className={style.loginButton} >로그인</Button>
                                </div>

                                <div className={style.signupContainer}>
                                    <div className={style.options}>
                                            <a type = "button" className={style.signupLink} onClick={() => handleClick("/signup")} >회원가입</a>
                                            <a type = "button" className={style.signupLink} onClick={() => handleClick("/signup")} >비밀번호 찾기</a>
                                    </div>

                                    {/* <div>
                                        <button
                                            type="button"
                                            onClick={() => handleClickGoogleLogin("http://127.0.0.1:8080/oauth2/authorization/google")}
                                            className = {style.googleLogin}
                                            >
                                            <GoogleSigninIcon className={style.googleLoginButton}/>
                                        </button>
                                    </div> */}
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;