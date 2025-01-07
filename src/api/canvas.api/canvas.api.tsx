import { CanvasClient } from '..';


interface welcomeFlowData {
    sessionId: string;
    name: string;
    userRequestWelcomeWav: string;
    attendanceTotal: string;
    attendanceStreak: string;
}

interface exploreCanvasData {
    sessionId: string;
    name: string;
    rejectedCount: number;
    userRequestWav: string;
    isTimedOut: string;
}

interface metaData {
    sessionId: string;
    topic: string;
}

interface feedBackData {
    sessionId: string;
    name: string;
    topic: string;
    phase: number;
    imageData: string;
}

const createCanvas = async(data: {title: string}) => {
    const url = `/canvas/createCanvas`;

    return await CanvasClient.post(url,JSON.stringify(data),{
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

const exploreCanvas = async(data: exploreCanvasData) => {
    const url = `/api/conversation/exploreCanvas`;

    return await CanvasClient.post(url,JSON.stringify(data),{
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

const welcomeFlow = async(data: welcomeFlowData) => {
    const url = `/api/conversation/welcomeFlow`;

    return await CanvasClient.post(url,JSON.stringify(data),{
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

const ImagemetaData = async(data: metaData) => {
    const url = `/api/image/metadata`;

    return await CanvasClient.post(url,JSON.stringify(data),{
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

const feedBack = async(data: feedBackData) => {
    const url = `/api/image/feedback`;

    return await CanvasClient.post(url,JSON.stringify(data),{
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}


const canvasApi = {
    exploreCanvas,
    createCanvas,
    welcomeFlow,
    ImagemetaData,
    feedBack,
};

export default canvasApi;