import { CanvasClient } from "..";

// 응답 타입 정의
interface ApiResponse<T = unknown> {
    status: number;
    data: T;
    message?: string;
}

// 사용자 데이터 타입 정의
interface UserData {
    name?: string;
    phoneNumber?: string;
}

export async function getUserInfo(): Promise<ApiResponse> {
    const url = `/user/auth/`;
    return await CanvasClient.get(url);
}

// 로그인
export async function loginUser(data: { name: string; phoneNumber: string }): Promise<ApiResponse> {
    const formDataToSend = new FormData();
    formDataToSend.append('name', data.name);
    formDataToSend.append('phoneNumber', data.phoneNumber); 

    const response = await CanvasClient.post('/auth/login', formDataToSend, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        maxRedirects: 0,
        withCredentials: true // 인증 정보 포함 (쿠키)
    });

    return response;
}

// 로그아웃
export async function logoutUser(): Promise<ApiResponse> {
    const response = await CanvasClient.post('/auth/logout', null, {
        withCredentials: true,
    });

    return response;
}

// 토큰 갱신
export async function refreshToken(data: UserData): Promise<ApiResponse> {
    const url = `/user/auth/refresh/`;
    return await CanvasClient.post(url, data);
}

// 회원 가입
export async function signupUser(data: UserData): Promise<ApiResponse> {
    const url = `/users/signup`;

    const requestData = {
        name: data.name,
        phoneNumber: data.phoneNumber,
    };

    return await CanvasClient.post(url, JSON.stringify(requestData), {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

const userAPI = {
    getUserInfo,
    loginUser,
    logoutUser,
    refreshToken,
    signupUser,
};

export default userAPI;