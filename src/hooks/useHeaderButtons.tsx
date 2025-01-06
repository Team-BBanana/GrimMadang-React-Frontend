import API from '@/api';
import { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/Button/Button';


const useHeaderButtons = (): React.ReactNode => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const response = await API.userApi.logoutUser();
            console.log(response.data);
            if (response.status === 200) {
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response && error.response.status === 401) {
                console.error('Unauthorized: Redirecting to login');
                navigate('/login');
            } else {
                console.error('Error during logout:', error);
            }
        }
    };

    const handleContinue = () => {
        navigate('/canvas', { state: { imageUrl: location.state?.imageUrl } });
    };

    const handleBack = () => {
        navigate('/gallery');
    };

    const getButton = () => {
        console.log(location.pathname);
        
        if (location.pathname === '/') {
            return (
                <Button type='button' onClick={() => navigate('/signup')}>
                    회원가입
                </Button>
            );
        } else if (/^\/gallery\/\d+$/.test(location.pathname)) {
            return (
                <>
                    <Button type='button' onClick={handleContinue}>
                        수정하기
                    </Button>
                    <Button type='button' onClick={handleBack}>
                        전시회
                    </Button>
                </>
            );
        } else if (location.pathname === '/signup') {
            return (
                <Button type='button' onClick={() => navigate('/')}>
                    로그인
                </Button>
            );
        } else {
            return (
                <Button type='button' onClick={handleLogout}>
                    로그아웃
                </Button>
            );
        }
    };

    return getButton();
};

export default useHeaderButtons;