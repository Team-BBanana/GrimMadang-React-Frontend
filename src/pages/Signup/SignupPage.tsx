import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api';
import SignupComponent from './component/SignupComponent';
import axios from 'axios';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (formData: {
        username: string;
        phoneNumber: string;
        elderPhoneNumber: string;
        relationship: string;
    }) => {
        try {
            const response = await API.userApi.signupFamily(formData);
            
            if (response.status === 200) {
                navigate('/');
            } else {
                setError(response.data as string);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data);
            } else {
                setError('회원가입 중 오류가 발생했습니다.');
            }
            console.error('Signup error:', error);
        }
    };

    return (
        <SignupComponent 
            onSubmit={handleSignup}
            error={error}
        />
    );
};

export default SignupPage;