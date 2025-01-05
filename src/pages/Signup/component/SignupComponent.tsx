import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Input from "@/components/InputBox/InputBox";
import style from "./SignupComponent.module.css"; 
import Button from "@/components/Button/Button";

interface SignupFormData {
    name: string;
    phoneNumber: string;
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
        phoneNumber: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const name = formData.name;
        const phoneNumber = phoneNumberRef.current?.value || "";

        onClickSubmit({ name, phoneNumber });
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
                        ref={phoneNumberRef}
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

                    {errormsg && <p className="error">{errormsg}</p>}
                    {success && <p className="success">{success}</p>}
                    <div className={style.buttonContainer}>
                        <Button type="submit">회원가입</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupComponent;
