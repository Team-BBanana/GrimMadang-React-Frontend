import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './component/Card/carousel/module/embla.css'
import './component/Card/carousel/module/base.css'
import GalleryComponent from "./component/Gallery/GalleryComponent";
import Tutorial from "./component/Tutorial/Tutorial";

interface WelcomeFlowData {
    sessionId: string;
    name: string;
    userRequestWelcomeWav: string;
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

interface Drawing {
    id: number;
    user: {
        id: number;
        name: string;
    };
    title: string;
    imageUrl1: string;
    imageUrl2: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const GalleryPage = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [elderinfo, setElderinfo] = useState<ElderInfo | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isExploreMode, setIsExploreMode] = useState(false);
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [topic,setTopic] = useState<string | null>(null);

    // 3분 타이머 함수
    const startThreeMinuteTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setTimerStarted(true);
        timerRef.current = setTimeout(() => {
            console.log("3분이 경과했습니다.");
            setIsExploreMode(true);
            handleExploreChat("", true);  // 타임아웃으로 인한 요청
        }, 3 * 60 * 1000);
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
        const fetchDrawings = async () => {
            try {
                const response = await API.galleryApi.getDrawings();
                console.log('Drawings response:', response.data);
                setDrawings(response.data);
            } catch (error) {
                console.error('Fetching drawings failed:', error);
            }
        };
        fetchDrawings();
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


    const fetchVoiceChat = async (transcript: string) => {
        if (!elderinfo || isExploreMode) return;

        try {
            const data: WelcomeFlowData = {
                sessionId: elderinfo.elderId || '',
                name: elderinfo.name || '',
                userRequestWelcomeWav: transcript,
                attendanceTotal: elderinfo.attendance_total || 0,
                attendanceStreak: elderinfo.attendance_streak || 0
            };

            const response = await API.canvasApi.welcomeFlow(data);
            console.log('Voice chat response:', response.data);

            // 토픽 설정을 response 처리 전에 수행
            const newTopic = response.data.data.wantedTopic;
            setTopic(newTopic);
            console.log("설정된 topic:", newTopic); // 토픽이 제대로 설정되었는지 확인

            const responseAudioData = response.data.data.aiResponseWelcomeWav.data;
            
            if (responseAudioData) {
                const audioBlob = new Blob([new Uint8Array(responseAudioData)], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                await playAudioAndWait(audioUrl);

                if (response.data.data.choice) {
                    console.log("사용자가 그림 그리기를 원합니다.");
                    setIsExploreMode(true);
                    // topic 값을 직접 전�
                    handleExploreChat(transcript, false, newTopic);
                }
            }
        } catch (error) {
            console.error('Voice chat error:', error);
        }
    };

    const handleExploreChat = async (transcript: string, isTimeout: boolean = false, currentTopic: string | null = null) => {
        if (!elderinfo) return;

        const topicToUse = currentTopic || topic; // 전�받은 topic이 있으면 사용, 없으면 state의 topic 사용
        console.log("handleExploreChat에서 사용하는 topic:", topicToUse);

        const data: exploreCanvasData = {
            sessionId: elderinfo.elderId || '',
            name: elderinfo.name || '',
            rejectedCount: 0,
            userRequestExploreWav: topicToUse || 'first',
            isTimedOut: isTimeout ? "true" : "false"
        };

        try {
            const response = await API.canvasApi.exploreCanvas(data);
            console.log('Explore chat response:', response.data);

            const responseAudioData = response.data.aiResponseExploreWav.data;
            
            if (responseAudioData) {
                const audioBlob = new Blob([new Uint8Array(responseAudioData)], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                await playAudioAndWait(audioUrl);
            }

            if(response.data.select === "true") {
                // topic 값을 명시적으로 전달
                navigate('/canvas', { 
                    state: { 
                        topics: topicToUse || response.data.topics 
                    }
                });
            }
        } catch (error) {
            console.error('Explore chat error:', error);
        }
    };

    const handleTranscript = async (transcript: string) => {
        if (isExploreMode) {
            handleExploreChat(transcript, false);  // 일반적인 explore 모드 요청
        } else {
            fetchVoiceChat(transcript);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <GalleryComponent 
                    elderinfo={elderinfo} 
                    drawings={drawings as any} // Fixing type incompatibility issue
                />
                {elderinfo?.role === 'ROLE_ELDER' && (
                    <SpeechButton 
                        onTranscriptComplete={handleTranscript}
                        onCloseTutorial={() => setShowTutorial(false)}
                        onInitialClick={fetchWelcomeFlow}
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