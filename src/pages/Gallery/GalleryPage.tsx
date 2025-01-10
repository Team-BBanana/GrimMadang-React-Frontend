import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";
import { useUserRole } from '@/hooks/UserContext';
import { useEffect } from 'react';

import './component/Card/carousel/module/embla.css'
import './component/Card/carousel/module/base.css'
import GalleryComponent from "./component/main-content/GalleryComponent";

interface WelcomeFlowData {
    sessionId: string;
    name: string;
    userRequestWavWelcome: string;
    attendanceTotal: number;
    attendanceStreak: number;
}


const GalleryPage = () => {
    const { userRole } = useUserRole();

    useEffect(() => {
        const fetchWelcomeFlow = async () => {
            try {
                const data = {
                    sessionId: "abc123",
                    name: "김영희",
                    userRequestWavWelcome: "first",
                    attendanceTotal: 10,
                    attendanceStreak: 5
                };
                const response = await API.canvasApi.welcomeFlow(data);
                console.log('Welcome flow response:', response.data);

                const audioData = response.data.aiResponseWelcomeWav;
                console.log('audioData:', audioData);

                if (audioData) {
                    playAudio(audioData);
                } else {
                    console.error('audioData is undefined or not available in the response.');
                }
            } catch (error) {
                console.error('Error during welcome flow:', error);
            }
        };

        fetchWelcomeFlow();
    }, []);

    const playAudio = (audioData: string) => {
        const base64Data = audioData.split(',')[1];

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    };

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