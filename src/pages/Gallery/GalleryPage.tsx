import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

import './component/Card/carousel/module/embla.css'
import './component/Card/carousel/module/base.css'
import GalleryComponent from "./component/Gallery/GalleryComponent";
import Tutorial from "./component/Tutorial/Tutorial";
import style from './GalleryPage.module.css';

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
    elder_id: string;
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
    const [elderinfo, setElderinfo] = useState<ElderInfo | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isExploreMode, setIsExploreMode] = useState(false);
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [topic,setTopic] = useState<string | null>(null);
    const [isFirstExplore, setIsFirstExplore] = useState(true);
    const [isFading, setIsFading] = useState(false);

    const { speakText, isPlaying } = useSpeechSynthesis();

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
                    // ROLE_ELDER이고 현재 세션에서 첫 방문인 경우에만 튜토리얼 표시
                    if (elderData.role === 'ROLE_ELDER' && !document.cookie.includes('tutorialShown=true')) {
                        setShowTutorial(true);
                        // document.cookie = 'tutorialShown=true; path=/; max-age=3600';
                    }
                }

            } catch (error) {
                console.error('getElderName 실패:', error);
            }
        };

        fetchElderName();
    }, []);


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

            const textToSpeak = response.data.data.aiResponseWelcomeWav;
            if (textToSpeak) {
                setIsFading(true);
                await speakText(textToSpeak);
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
            
            const newTopic = response.data.data.wantedTopic;
            const textToSpeak = response.data.data.aiResponseWelcomeWav;

            if (textToSpeak) {
                await speakText(textToSpeak);
                // 음성 출력이 완료된 후에만 다음 단계로 진행
                if (newTopic) {
                    console.log("그림 그리기 주제가 선택됨:", newTopic);
                    setTopic(newTopic);
                    setIsExploreMode(true);
                    setTimeout(async () => {
                        await handleExploreChat(transcript, false, newTopic);
                    }, 500); // 약간의 딜레이를 주어 상태 업데이트가 완료되도록 함
                }
            }

        } catch (error) {
            console.error('Voice chat error:', error);
        }
    };

    const handleExploreChat = async (_transcript: string, isTimeout: boolean = false, currentTopic: string | null = null) => {
        if (!elderinfo) return;

        // 첫 번째 호출에서는 topic을 사용하고, 이후에는 transcript를 사용
        const userRequest = isFirstExplore ? (currentTopic || topic) : _transcript;
        console.log("handleExploreChat에서 사용하는 request:", userRequest);

        const data: exploreCanvasData = {
            sessionId: elderinfo.elderId || '',
            name: elderinfo.name || '',
            rejectedCount: 0,
            userRequestExploreWav: userRequest || 'first',
            isTimedOut: isTimeout ? "true" : "false"
        };

        try {
            const response = await API.canvasApi.exploreCanvas(data);
            console.log('Explore chat response:', response.data);

            const textToSpeak = response.data.aiResponseExploreWav;
            if (textToSpeak) {
                await speakText(textToSpeak);
            }

            if (response.data.select === "true") {
                navigate('/canvas', { 
                    state: { 
                        metadata: response.data.metadata 
                    } 
                });
            }

            // 첫 번째 호출이 끝나면 isFirstExplore를 false로 설정
            if (isFirstExplore) {
                setIsFirstExplore(false);
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
                        onInitialClick={fetchWelcomeFlow}
                    />
                )}
            </div>
            {showTutorial && elderinfo?.role === 'ROLE_ELDER' && (
                <Tutorial 
                    onClose={isFading} 
                />
            )}
            {isPlaying && <div className={style.disableInteraction} />}
        </>
    );
}

export default GalleryPage;