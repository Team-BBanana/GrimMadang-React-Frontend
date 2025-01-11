import { CanvasClient } from "..";

// 응답 타입 정의
interface ApiResponse<T = unknown> {
    status: number;
    data: T;
    message?: string;
}

// 사용자 데이터 타입 정의
interface UserData {
    username: string;
    phoneNumber: string;
}

export async function getUserInfo(): Promise<ApiResponse> {
    const url = `/user/auth/`;
    return await CanvasClient.get(url);
}

// 로그인
export async function loginElder(data: { username: string; password: string; role: string; }): Promise<ApiResponse> {

    const url = `/auth/login`;
    const response = await CanvasClient.post(url, JSON.stringify(data), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        maxRedirects: 0,
        withCredentials: true, // 인증 정보 포함 (쿠키)
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
export async function signupElder(data: UserData): Promise<ApiResponse> {

    const url = `/api/users/register/elder`;
    console.log('dataㅇㄹ호ㅎㄹㅇㄹㅎㄹㅇ:', data);

    return await CanvasClient.post(url, JSON.stringify(data), {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

export async function getElderInfo(): Promise<ApiResponse> {
    const url = `/api/users/getelderinfo`;

    return await CanvasClient.get(url);

}


const userAPI = {
    getUserInfo,
    loginElder,
    logoutUser,
    refreshToken,
    signupElder,
    getElderInfo
};

export default userAPI;