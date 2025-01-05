import { CanvasClient } from '..';

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

const canvasApi = {
    createCanvas,
};

export default canvasApi;