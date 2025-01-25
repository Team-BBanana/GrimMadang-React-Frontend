import SpeechButton from "./component/SpeechButton/SpeechButton";
import API from "@/api";
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useElderInfo } from '@/hooks/useElderInfo';

import './component/Card/carousel/module/embla.css'
import './component/Card/carousel/module/base.css'
import GalleryComponent from "./component/Gallery/GalleryComponent";
import Tutorial from "./component/Tutorial/Tutorial";
import style from './GalleryPage.module.css';
import LogoutButton from '@/components/LogoutButton/LogoutButton';

interface WelcomeFlowData {
    sessionId: string;
    name: string;
    userRequestWelcomeWav: string;
    attendanceTotal: number;
    attendanceStreak: number;
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
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isExploreMode, setIsExploreMode] = useState(false);
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [topic,setTopic] = useState<string | null>(null);
    const [isFirstExplore, setIsFirstExplore] = useState(true);
    const [isFading, setIsFading] = useState(false);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [isInitial, setIsInitial] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const { speakText, isPlaying } = useSpeechSynthesis();
    const { elderInfo} = useElderInfo();


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

    // 튜토리얼 표시 여부 체크
    useEffect(() => {
        if (elderInfo?.role === 'ROLE_ELDER' && !document.cookie.includes('tutorialShown=true')) {
            setShowTutorial(true);
            document.cookie = 'tutorialShown=true; path=/; max-age=3600';
            setIsInitial(true);
        }
    }, [elderInfo]);

    const fetchWelcomeFlow = async () => {
        if (!elderInfo) return;

        try {
            setIsLoadingResponse(true);  // 로딩 시작
            const data: WelcomeFlowData = {
                sessionId: elderInfo.elderId || '',
                name: elderInfo.name || '',
                userRequestWelcomeWav: "first",
                attendanceTotal: elderInfo.attendance_total || 0,
                attendanceStreak: elderInfo.attendance_streak || 0
            };
            const response = await API.canvasApi.welcomeFlow(data);
            
            const textToSpeak = response.data.data.aiResponseWelcomeWav;
            if (textToSpeak) {
                setIsFading(true);
                setIsLoadingResponse(false);  // 로딩 종료
                await speakText(textToSpeak);
                setIsInitial(false);
            }
        } catch (error) {
            console.error('환영 흐름 중 오류 발생:', error);
            setIsLoadingResponse(false);  // 에러 시 로딩 종료
        }
    };

    const fetchVoiceChat = async (transcript: string) => {
        if (!elderInfo || isExploreMode) return;

        try {
            setIsLoadingResponse(true);  // 로딩 시작
            const data: WelcomeFlowData = {
                sessionId: elderInfo.elderId || '',
                name: elderInfo.name || '',
                userRequestWelcomeWav: transcript,
                attendanceTotal: elderInfo.attendance_total || 0,
                attendanceStreak: elderInfo.attendance_streak || 0
            };

            const response = await API.canvasApi.welcomeFlow(data);
            
            const newTopic = response.data.data.wantedTopic;
            const textToSpeak = response.data.data.aiResponseWelcomeWav;

            if (textToSpeak) {
                setIsLoadingResponse(false);  // 로딩 종료
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
            setIsLoadingResponse(false);  // 에러 시 로딩 종료
        }
    };

    const handleExploreChat = async (_transcript: string, isTimeout: boolean = false, currentTopic: string | null = null) => {
        if (!elderInfo) return;

        // 첫 번째 호출에서는 topic을 사용하고, 이후에는 transcript를 사용
        const userRequest = isFirstExplore ? (currentTopic || topic) : _transcript;
        console.log("handleExploreChat에서 사용하는 request:", userRequest);

        const data: exploreCanvasData = {
            sessionId: elderInfo.elderId || '',
            name: elderInfo.name || '',
            rejectedCount: 0,
            userRequestExploreWav: userRequest || 'first',
            isTimedOut: isTimeout ? "true" : "false"
        };

        try {
            setIsLoadingResponse(true);  // 로딩 시작
            const response = await API.canvasApi.exploreCanvas(data);
            
            const textToSpeak = response.data.aiResponseExploreWav;
            if (textToSpeak) {
                setIsLoadingResponse(false);  // 로딩 종료
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
            setIsLoadingResponse(false);  // 에러 시 로딩 종료
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
                    elderinfo={elderInfo} 
                    drawings={drawings as any}
                />
                <LogoutButton />
                {elderInfo?.role === 'ROLE_ELDER' && (
                    isPlaying ? (
                        <div className={style.speakingIcon}>
                            <svg width="80px" height="80px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="6" r="4" stroke="#347050" strokeWidth="1.5"/>
                                <path d="M19 2C19 2 21 3.2 21 6C21 8.8 19 10 19 10" stroke="#347050" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M17 4C17 4 18 4.6 18 6C18 7.4 17 8 17 8" stroke="#347050" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M17.9975 18C18 17.8358 18 17.669 18 17.5C18 15.0147 14.4183 13 10 13C5.58172 13 2 15.0147 2 17.5C2 19.9853 2 22 10 22C12.231 22 13.8398 21.8433 15 21.5634" stroke="#347050" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                    ) : (
                        <SpeechButton 
                            onTranscriptComplete={handleTranscript}
                            onInitialClick={fetchWelcomeFlow}
                            isLoading={isLoadingResponse}
                            isInitial={isInitial}
                            onListeningChange={setIsListening}
                        />
                    )
                )}
            </div>
            {showTutorial && elderInfo?.role === 'ROLE_ELDER' && (
                <Tutorial 
                    onClose={isFading} 
                />
            )}
            {(isPlaying || isLoadingResponse || isListening) && <div className={style.disableInteraction} />}
        </>
    );
}

export default GalleryPage;