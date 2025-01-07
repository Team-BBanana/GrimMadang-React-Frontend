import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComponent from './component/LoginComponent';
import API from '@/api/index';

interface FormData {
    name: string;
    phoneNumber: string;
}

const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (formData: FormData) => {
        try {
            const data = { username: formData.phoneNumber, password: formData.name };
            const response = await API.userApi.loginElder(data);

            if (response.status === 200) {
                console.log('Login successful:', response.data); // 서버 응답 로그
                setSuccess('로그인 성공!');
                setError(null);

                // 로그인 성공 시 리다이렉트
                navigate('/gallery');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
            setSuccess(null);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <LoginComponent onClickSubmit={handleSubmit} errormsg={error} success={success} />
        </div>
    );
};

export default LoginPage;
