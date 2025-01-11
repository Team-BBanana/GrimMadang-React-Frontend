import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";
import { useEffect, useState } from 'react';

import './component/Card/carousel/module/embla.css'
import './component/Card/carousel/module/base.css'
import GalleryComponent from "./component/Gallery/GalleryComponent";
import Tutorial from "./component/Tutorial/Tutorial";

interface WelcomeFlowData {
    sessionId: string;
    name: string;
    userRequestWavWelcome: string;
    attendanceTotal: number;
    attendanceStreak: number;
}

interface ElderInfo {
    elderId: string;
    name: string;
    phoneNumber: string;
    role: string;
    attendance_streak: number;
    attendance_total: number;
}

const GalleryPage = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [elderinfo, setElderinfo] = useState<ElderInfo | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        //role 
        const fetchElderName = async () => {
            try {
                const response = await API.userApi.getElderInfo();
                if (response.status === 200) {
                    const elderData = response.data as ElderInfo;
                    setUserRole(elderData.role);
                    setElderinfo(elderData);
                    
                    // ROLE_ELDER이고 현재 세션에서 첫 방문인 경우에만 튜토리얼 표시
                    if (elderData.role === 'ROLE_ELDER' && !document.cookie.includes('tutorialShown=true')) {
                        setShowTutorial(true);
                        document.cookie = 'tutorialShown=true; path=/; max-age=3600';
                    }
                }
            } catch (error) {
                console.error('getElderName 실패:', error);
            }
        };

        fetchElderName();

        const fetchWelcomeFlow = async () => {
            if (!elderinfo) return;

            try {
                const data: WelcomeFlowData = {
                    sessionId: elderinfo.elderId,
                    name: elderinfo.name,
                    userRequestWavWelcome: "first",
                    attendanceTotal: elderinfo.attendance_total,
                    attendanceStreak: elderinfo.attendance_streak
                };
                const response = await API.canvasApi.welcomeFlow(data);
                console.log('Welcome flow response:', response.data);

                const audioData = response.data.data.aiResponseWelcomeWav.data;
                console.log('audioData:', audioData);

                if (audioData) {
                    const audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    console.log('Generated audio URL:', audioUrl);

                    setAudioUrl(audioUrl);
                } else {
                    console.error('audioData가 정의되지 않았거나 응답에 없습니다.');
                }
            } catch (error) {
                console.error('환영 흐름 중 오류 발생:', error);
            }
        };

        fetchWelcomeFlow();
    }, []);

    const playAudio = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(error => {
                console.error('오디오 재생 중 오류 발생:', error);
            });
        } else {
            console.error('재생할 오디오 URL이 없습니다.');
        }
    };

    const handleTranscriptComplete = async (transcript: string) => {
        console.log('음성 인식 결과:', transcript);

        try {
            const data = { transcript };
            const response = await API.galleryApi.voiceChat(data);

            if (response.status === 200) {
                console.log('음성 채팅 성공:', response.data);
            }
        } catch (error) {
            console.error('음성 채팅 중 오류 발생:', error);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <GalleryComponent elderinfo={elderinfo} />
                {elderinfo?.role === 'ROLE_ELDER' && (
                    <SpeechButton 
                        onTranscriptComplete={handleTranscriptComplete} 
                        onCloseTutorial={() => setShowTutorial(false)}
                    />
                )}
            </div>
            {showTutorial && elderinfo?.role === 'ROLE_ELDER' && (
                <Tutorial onClose={() => setShowTutorial(false)} />
            )}
        </>
    );
}

export default GalleryPage;