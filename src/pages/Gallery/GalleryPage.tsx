import ElderComponent from "./component/ElderComponent";
import FamilyComponent from "./component/FamilyComponent";
import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";

import { useEffect, useState } from 'react';

const GalleryPage = ({ userRole }: { userRole: string }) => {
    const [elderName, setElderName] = useState<string>('');

    useEffect(() => {
        const fetchElderName = async () => {
            try {
                const response = await API.galleryApi.getElderName();
                if (response.status === 200) {
                    console.log(response.data);
                    setElderName(response.data.elderName);
                }
            } catch (error) {
                console.error('getElderName 실패:', error);
            }
        };

        if (userRole === 'ROLE_FAMILY') {
            fetchElderName();
        }
    }, [userRole]);

    const handleTranscriptComplete = async (transcript: string) => {
        console.log('음성 인식 결과:', transcript);

        try {
            const data = { transcript };
            const response = await API.galleryApi.voiceChat(data);

            if (response.status === 200) {
                console.log('voiceChat successful:', response.data);
            }
        } catch (error) {
            console.error('Error during voiceChat:', error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {userRole === 'ROLE_ELDER' && <ElderComponent />}
            {userRole === 'ROLE_FAMILY' && <FamilyComponent elderName={elderName} />}
            {userRole === 'ROLE_ELDER' && <SpeechButton onTranscriptComplete={handleTranscriptComplete} />}
        </div>
    );
}

export default GalleryPage;