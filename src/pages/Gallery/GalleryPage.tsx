import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";
import { useUserRole } from '@/hooks/UserContext';

import './component/Card/carousel/module/embla.css'
import './component/Card/carousel/module/base.css'
import GalleryComponent from "./component/main-content/GalleryComponent";

const GalleryPage = () => {
    const { userRole } = useUserRole();

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
            <GalleryComponent />
            {userRole === 'ROLE_ELDER' && <SpeechButton onTranscriptComplete={handleTranscriptComplete} />}
        </div>
    );
}

export default GalleryPage;