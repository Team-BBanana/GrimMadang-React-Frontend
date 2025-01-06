import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Input from "@/components/InputBox/InputBox";
import style from "./SignupComponent.module.css"; 
import Button from "@/components/Button/Button";

interface SignupFormData {
    name: string;
    phoneNumber: string;
    phoneNumberConfirm: string;
}

interface SignupProps {
    errormsg: string | null;
    success: string | null;
    onClickSubmit: (formData: SignupFormData) => void;
}

const SignupComponent: React.FC<SignupProps> = ({ errormsg, success, onClickSubmit }) => {
    const phoneNumberRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        phoneNumber: '',
        phoneNumberConfirm: ''
    });

    const [phoneNumberError, setPhoneNumberError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (name === 'phoneNumberConfirm' || name === 'phoneNumber') {
            if (formData.phoneNumber !== value && name === 'phoneNumberConfirm') {
                setPhoneNumberError('전화번호가 일치하지 않습니다');
            } else {
                setPhoneNumberError('');
            }
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData.phoneNumber !== formData.phoneNumberConfirm) {
            setPhoneNumberError('전화번호가 일치하지 않습니다');
            return;
        }
        onClickSubmit({ name: formData.name, phoneNumber: formData.phoneNumber, phoneNumberConfirm: formData.phoneNumberConfirm });
    };

    return (
        <div className={style.container}>
            <div className={style.content}>
                <form onSubmit={handleSubmit} className={style.formContainer}>
                    <h1>회원가입</h1>
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
                        ref={phoneNumberRef}
                        required
                    />
                    <Input
                        type="text"
                        id="phoneNumberConfirm"
                        name="phoneNumberConfirm"
                        placeholder="전화번호 확인"
                        value={formData.phoneNumberConfirm}
                        onChange={handleChange}
                        required
                    />
                    {phoneNumberError && <p className={style.error}>{phoneNumberError}</p>}
                    <div className={style.buttonContainer}>
                        <Button type="submit">회원가입</Button>
                    </div>
                </form>
            </div>
            {errormsg && <p className="error">{errormsg}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default SignupComponent;
