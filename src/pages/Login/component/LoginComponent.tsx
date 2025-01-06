import {ChangeEvent, FormEvent, useRef, useState} from "react";
import style from "./LoginComponent.module.css"
import Input from "@/components/InputBox/InputBox.tsx";
import Button from "@/components/Button/Button.tsx";
import { useNavigate } from "react-router-dom";
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, redirectPath: string) => {
        e.preventDefault();
        const name = nameRef.current?.value || "";
        const phoneNumber = phoneNumberRef.current?.value || "";
        await onClickSubmit({ name, phoneNumber });
        if (success) {
            navigate(redirectPath);
        }
    };
    
    return (
        <div className={style.content}>
            <img src={LogoImage} className={style.MindinCanvasImage} alt="artGround" />

            <div className={style.loginbox}>
                <div className={style.loginContainer}>
                    <form onSubmit={(e) => handleSubmit(e, "/canvas")}>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="이름"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="전화번호"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        <div className={style.checkboxContainer}>
                            <input type="checkbox" id="stayLoggedIn" />
                            <span className={style.checkboxLabel}>로그인 상태 유지</span>
                        </div>

                        <div>
                            <div className={style.buttonContainer}>
                                <Button type="submit" className={style.loginButton}>로그인</Button>
                            </div>

                            {errormsg && <p className="error" style={{ whiteSpace: 'pre-wrap' }}>{errormsg}</p>}
                            {success && <p className="success">{success}</p>}


                            <div className={style.signupContainer}>
                                 <span
                                    className={style.loginFamily}
                                    onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>, "/family")}
                                >
                                    우리 가족의 그림을 보러 왔어요!
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;