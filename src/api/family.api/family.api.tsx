import { CanvasClient } from '..';

const tokenGenerate = async(data : {familyId: string}) => {
    const url = `/family/generateFamilyToken`;
    return await CanvasClient.post(url,JSON.stringify(data),{
        method: "POST",
        headers: {
            "Content-Type": "application/json", // JSON 요청임을 명시
        },
        withCredentials: true,
    });
}

const familyAPI = {
    tokenGenerate
};

export default familyAPI; 