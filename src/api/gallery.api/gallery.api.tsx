import { CanvasClient } from '..';

const voiceChat = async(data: {transcript: string}) => {
    const url = `/gallery/voiceChat`;
    return await CanvasClient.post(url, data, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
}

const getElderName = async() => {
    const url = `/gallery/getElderName`;
    return await CanvasClient.get(url, {
        withCredentials: true,
    });
}

const galleryApi = {
    voiceChat,
    getElderName
};

export default galleryApi;
    