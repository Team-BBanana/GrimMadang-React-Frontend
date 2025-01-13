import React, { useState } from 'react';
import Input from '@/components/InputBox/InputBox';
import Button from '@/components/Button/Button';
import style from './SignupComponent.module.css';

interface SignupComponentProps {
    onSubmit: (data: {
        username: string;
        phoneNumber: string;
        elderPhoneNumber: string;
        relationship: string;
    }) => void;
    error: string | null;
}

const SignupComponent: React.FC<SignupComponentProps> = ({ onSubmit, error }) => {
    const [formData, setFormData] = useState({
        username: '',
        phoneNumber: '',
        elderPhoneNumber: '',
        relationship: 'son'  // 기본값
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={style.container}>
            <div className={style.content}>
                <h1>가족 회원가입</h1>
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
                    <Input
                        type="tel"
                        id="elderPhoneNumber"
                        name="elderPhoneNumber"
                        placeholder="어르신 전화번호"
                        value={formData.elderPhoneNumber}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        className={style.select}
                    >
                        <option value="son">아들</option>
                        <option value="daughter">딸</option>
                        <option value="grandSon">손자</option>
                        <option value="grandDaughter">손녀</option>
                        <option value="husband">남편</option>
                        <option value="wife">아내</option>
                    </select>

                    {error && <p className={style.error}>{error}</p>}

                    <Button type="submit">
                        가입하기
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SignupComponent;
