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

const galleryApi = {
    voiceChat,
};

export default galleryApi;
    