import { CanvasClient } from '..';


interface CommentCreateRequest {
    drawingId: string;
    content: string;
}


const getElderName = async() => {
    const url = `/gallery/getElderName`;
    return await CanvasClient.get(url, {
        withCredentials: true,
    });
}

const getDrawings = async() => {
    const url = `/api/drawings/getDrawings`;
    return await CanvasClient.get(url, {
        withCredentials: true,
    });
}

const getDrawing = async(drawingId: string) => {
    const url = `/api/drawings/${drawingId}`;
    return await CanvasClient.get(url, {
        withCredentials: true,
    });
}


const getFeedbacks = async(drawingId: string) => {
    const url = `/api/drawings/${drawingId}/getfeedbacks`;
    return await CanvasClient.get(url, {
        withCredentials: true,
    });
}

const createComment = async(data: CommentCreateRequest) => {
    const url = `/api/drawings/${data.drawingId}/comment`;
    return await CanvasClient.post(url, data, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
}

const getComments = async(drawingId: string) => {
    const url = `/api/drawings/${drawingId}/comments`;
    return await CanvasClient.get(url, {
        withCredentials: true,
    });
}

const galleryApi = {
    getElderName,
    getDrawings,
    getDrawing,
    getFeedbacks,
    createComment,
    getComments
};

export default galleryApi;
    