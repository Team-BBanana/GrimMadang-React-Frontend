import React, { useState } from 'react';
import Input from '@/components/InputBox/InputBox';
import Button from '@/components/Button/Button';
import style from './SignupComponent.module.css';
import Footer from '@/components/Footer/Footer';

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
        relationship: ''  // 빈 문자열로 초기화
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'phoneNumber' || name === 'elderPhoneNumber') {
            // 숫자만 추출
            const numbers = value.replace(/[^0-9]/g, '');
            
            // 최대 11자리로 제한
            const limitedNumbers = numbers.slice(0, 11);
            
            // 하이픈 추가
            let formattedNumber = '';
            if (limitedNumbers.length <= 3) {
                formattedNumber = limitedNumbers;
            } else if (limitedNumbers.length <= 7) {
                formattedNumber = `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
            } else {
                formattedNumber = `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
            }
            
            setFormData(prev => ({
                ...prev,
                [name]: formattedNumber
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
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
                        <option value="" disabled>어르신과의 관계</option>
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
            <Footer />  
        </div>
    );
};

export default SignupComponent;
