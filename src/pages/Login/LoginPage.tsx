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
            const response = await API.userApi.loginUser({
                name: formData.name,
                phoneNumber: formData.phoneNumber
            });
            if (response.status === 200) {
                console.log('Login successful:', response.data); // 성공적인 로그인 데이터 출력
                // 서버에서 보낸 데이터가 JWT라면 로컬 저장소에 저장할 수 있습니다.
                // 예시: localStorage.setItem("jwt", response.data.token);
                navigate('/gallery'); // React Router를 사용하여 리다이렉션
                setSuccess("로그인 성공!");
                setError(null);
            }
        } catch (error) {
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
            setSuccess(null);
            console.error('Error during login:', error);
        }
    };
    

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <LoginComponent onClickSubmit={handleSubmit} errormsg={error} success={success} />
        </div>
    );
};

export default LoginPage;
