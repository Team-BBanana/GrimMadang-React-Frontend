import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";
import { useUserRole } from '@/hooks/UserContext';
import { useEffect, useState } from 'react';

import './component/Card/carousel/module/embla.css'
import './component/Card/carousel/module/base.css'
import GalleryComponent from "./component/Gallery/GalleryComponent";

interface WelcomeFlowData {
    sessionId: string;
    name: string;
    userRequestWavWelcome: string;
    attendanceTotal: number;
    attendanceStreak: number;
}


const GalleryPage = () => {
    const { userRole } = useUserRole();
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);


    useEffect(() => {
        const fetchWelcomeFlow = async () => {
            try {
                const data: WelcomeFlowData = {
                    sessionId: "abc123",
                    name: "김영희",
                    userRequestWavWelcome: "first",
                    attendanceTotal: 10,
                    attendanceStreak: 5
                };
                const response = await API.canvasApi.welcomeFlow(data);
                console.log('Welcome flow response:', response.data);

                const audioData = response.data.data.aiResponseWelcomeWav.data; // WAV 데이터
                console.log('audioData:', audioData);

                if (audioData) {
                    // WAV 데이터로 Blob 생성
                    const audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    console.log('Generated audio URL:', audioUrl);  // 생성된 URL 로그

                    setAudioUrl(audioUrl); // 오디오 URL 상태 업데이트
                } else {
                    console.error('audioData가 정의되지 않았거나 응답에 없습니다.');
                }
            } catch (error) {
                console.error('환영 흐름 중 오류 발생:', error);
            }
        };

        fetchWelcomeFlow();  // 초기화 시 호출
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
            {audioUrl && (
                <audio controls>
                    <source src={audioUrl} type="audio/wav" />
                    브라우저가 오디오 요소를 지원하지 않습니다.
                </audio>
            )}
            <button onClick={playAudio}>Play Welcome Audio</button>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <GalleryComponent />
                {userRole === 'ROLE_ELDER' && (
                    <>
                        <SpeechButton onTranscriptComplete={handleTranscriptComplete} />
                    </>
                )}
            </div>
        </>
    );
}

export default GalleryPage;