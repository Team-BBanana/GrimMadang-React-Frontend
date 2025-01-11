import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComponent from './component/LoginComponent';
import API from '@/api/index';
import WelcomeModal from './component/WelcomeModal';

interface FormData {
    username: string;
    phoneNumber: string;
}

interface elderInfo {
    name: string;
    phoneNumber: string;
}

const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isWelcomeModalVisible, setIsWelcomeModalVisible] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({ username: '', phoneNumber: '' });

    const handleSubmit = async (data: FormData) => {
        setFormData(data);

        try {
            const apiData = { username: data.phoneNumber, password: data.username, role: "ROLE_ELDER" };
            const response = await API.userApi.loginElder(apiData);

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
            setIsWelcomeModalVisible(true);
        }
    };

    const handleCloseWelcomeModal = async () => {
        console.log('formData:', formData);

        try {
            const response = await API.userApi.signupElder({ username: formData.username, phoneNumber: formData.phoneNumber });

            if (response.status === 200) {
                setIsWelcomeModalVisible(false);
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <LoginComponent onClickSubmit={handleSubmit} errormsg={error} success={success} />
            {isWelcomeModalVisible && (
                <WelcomeModal onClose={handleCloseWelcomeModal} />
            )}
        </div>
    );
};

export default LoginPage;
