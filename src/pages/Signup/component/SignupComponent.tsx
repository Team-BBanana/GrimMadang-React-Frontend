import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Input from "@/components/InputBox/InputBox";
import style from "./SignupComponent.module.css"; 
import Button from "@/components/Button/Button";

interface SignupFormData {
    name: string;
    phoneNumber: string;
    phoneNumberConfirm: string;
    role: 'ROLE_FAMILY' | 'ROLE_ELDER' | null;
    relation?: string;
}

interface SignupProps {
    errormsg: string | null;
    success: string | null;
    onClickSubmit: (formData: SignupFormData) => void;
}

const SignupComponent: React.FC<SignupProps> = ({ errormsg, success, onClickSubmit }) => {
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(true);
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        phoneNumber: '',
        phoneNumberConfirm: '',
        role: null,
        relation: ''
    });

    const [phoneNumberError, setPhoneNumberError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const handleRoleSelect = (role: 'ROLE_FAMILY' | 'ROLE_ELDER') => {
        setFormData(prev => ({ ...prev, role }));
        setShowModal(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData.phoneNumber !== formData.phoneNumberConfirm) {
            setPhoneNumberError('전화번호가 일치하지 않습니다');
            return;
        }
        if (!formData.role) {
            return;
        }
        onClickSubmit({ ...formData });
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
                    {formData.role === 'ROLE_FAMILY' && (
                        <select
                            name="relation"
                            value={formData.relation}
                            onChange={handleChange}
                            className={style.select}
                            required
                        >
                            <option value="" disabled>당신은 누구신가요?</option>
                            <option value="daughter">딸</option>
                            <option value="son">아들</option>
                            <option value="wife">아내</option>
                            <option value="husband">남편</option>
                            <option value="sibling">형제/자매</option>
                            <option value="granddaughter">손녀</option>
                            <option value="grandson">손자</option>
                        </select>
                    )}
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
