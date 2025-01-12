import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";
import { useEffect, useState, useRef } from 'react';

import './component/Card/carousel/module/embla.css'
import './component/Card/carousel/module/base.css'
import GalleryComponent from "./component/Gallery/GalleryComponent";
import Tutorial from "./component/Tutorial/Tutorial";

interface WelcomeFlowData {
    sessionId: string;
    name: string;
    userRequestWelcomeWav: string | number[];
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

interface exploreCanvasData {
    sessionId: string;
    name: string;
    rejectedCount: number;
    userRequestExploreWav: string;
    isTimedOut: string;
}

const GalleryPage = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [elderinfo, setElderinfo] = useState<ElderInfo | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 3분 타이머 함수
    const startThreeMinuteTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setTimerStarted(true);
        timerRef.current = setTimeout(() => {
            console.log("3분이 경과했습니다.");
            // 여기에 3분 후 실행할 로직 추가
            // 예: 다음 프로세스로 이동
        }, 3 * 60 * 1000); // 3분을 밀리초로 변환
    };

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        // Fetch elder information and set user role
        const fetchElderName = async () => {
            try {
                const response = await API.userApi.getElderInfo();
                if (response.status === 200) {
                    const elderData = response.data as ElderInfo;
                    console.log('elderData:', elderData);
                    setElderinfo(elderData);
                    setUserRole(elderData.role);
                    
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
    }, []);

    const playAudioAndWait = async (audioUrl: string): Promise<void> => {
        const audio = new Audio(audioUrl);
        await audio.play();
        
        return new Promise<void>((resolve) => {
            audio.onended = () => resolve();
        });
    };

    const fetchWelcomeFlow = async () => {
        if (!elderinfo) return;

        try {
            const data: WelcomeFlowData = {
                sessionId: elderinfo.elderId || '',
                name: elderinfo.name || '',
                userRequestWelcomeWav: "first",
                attendanceTotal: elderinfo.attendance_total || 0,
                attendanceStreak: elderinfo.attendance_streak || 0
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
                
                // 오디오 재생 및 타이머 시작
                await playAudioAndWait(audioUrl);
                if (!timerStarted) {
                    startThreeMinuteTimer();  // 첫 음성 재생 후 타이머 시작
                }
            } else {
                console.error('audioData가 정의되지 않았거나 응답에 없습니다.');
            }
        } catch (error) {
            console.error('환영 흐름 중 오류 발생:', error);
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

    const fetchVoiceChat = async (audioBlob: Blob) => {
        if (!elderinfo) return;

        try {
            // WAV 형식으로 변환
            const wavBlob = new Blob([audioBlob], { type: 'audio/wav' });
            console.log('wavBlob:', wavBlob);

            // Blob을 바이너리 데이터로 변환
            const arrayBuffer = await wavBlob.arrayBuffer();
            const binaryData = new Uint8Array(arrayBuffer);
            console.log('binaryData:', binaryData);

            const data: WelcomeFlowData = {
                sessionId: elderinfo.elderId || '',
                name: elderinfo.name || '',
                userRequestWelcomeWav: Array.from(binaryData),  // 바이너리 데이터를 배열로 변환하여 전송
                attendanceTotal: elderinfo.attendance_total || 0,
                attendanceStreak: elderinfo.attendance_streak || 0
            };

            const response = await API.canvasApi.welcomeFlow(data);
            console.log('Voice chat response:', response.data);

            const responseAudioData = response.data.data.aiResponseWelcomeWav.data;
            
            if (responseAudioData) {
                const audioBlob = new Blob([new Uint8Array(responseAudioData)], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                
                await playAudioAndWait(audioUrl);

                if (response.data.data.choice) {
                    console.log("사용자가 그림 그리기를 원합니다.");
                }
            }
        } catch (error) {
            console.error('Voice chat error:', error);
        }
    };

    const handleTopicChat = async () => {
        if (!elderinfo) return;

        const data: exploreCanvasData = {
            sessionId: elderinfo.elderId || '',
            name: elderinfo.name || '',
            rejectedCount: 0,
            userRequestExploreWav: "first",
            isTimedOut: "false"
        };

        try {
            const response = await API.canvasApi.exploreCanvas(data);

            console.log('Topic chat response:', response.data);
        } catch (error) {
            console.error('Topic chat error:', error);
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
                        onInitialClick={fetchWelcomeFlow}
                        onAudioComplete={fetchVoiceChat}
                    />
                )}
            </div>
            {showTutorial && elderinfo?.role === 'ROLE_ELDER' && (
                <Tutorial onClose={() => setShowTutorial(true)} />
            )}
        </>
    );
}

export default GalleryPage;