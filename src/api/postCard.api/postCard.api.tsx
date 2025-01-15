import { CanvasClient } from '..';

interface SharePostCardRequest {
    imageId: string;
    title: string;
    content: string;
}
const sharePostCard = async (data: SharePostCardRequest) => {
    try {
        const response = await CanvasClient.post('/api/postcard/share', data);
        return response.data;
    } catch (error) {
        throw new Error('엽서 공유에 실패했습니다.');
    }
};

const postCardApi = {
    sharePostCard
};

export default postCardApi;