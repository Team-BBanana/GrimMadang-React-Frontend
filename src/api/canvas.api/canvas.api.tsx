import { CanvasClient, AIClient } from '..';

interface WelcomeFlowData {
    sessionId: string | undefined;
    name: string | undefined;
    userRequestWelcomeWav: string | number[];
    attendanceTotal: number | undefined;
    attendanceStreak: number | undefined;
}

interface exploreCanvasData {
    sessionId: string;
    name: string;
    rejectedCount: number;
    userRequestExploreWav: string;
    isTimedOut: string;
}

interface metaData {
    sessionId: string;
    topic: string;
}

interface feedBackData {
    sessionId: string;
    topic: string;
    imageUrl: string;
    currentStep: number;
}

interface saveCanvasData {
    description: string;
    imageUrl1: string;
    imageUrl2: string;
    title: string;
    feedback1: string;
    feedback2: string;
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
    const url = `/api/topics/explore`;

    return await AIClient.post(url,JSON.stringify(data),{
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

const welcomeFlow = async(data: WelcomeFlowData) => {
    const url = `/api/conversation/welcomeFlow`;

    return await AIClient.post(url,JSON.stringify(data),{
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
    const url = `/api/drawings/submit`;

    return await AIClient.post(url,JSON.stringify(data),{
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

const saveCanvas = async(data: saveCanvasData) => {
    const url = `/api/drawings/save`;

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
    saveCanvas
};

export default canvasApi;