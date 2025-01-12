import { useState, useEffect, useRef } from 'react';
import Button from '@/components/Button/Button';
import style from './SpeechButton.module.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface SpeechButtonProps {
    onTranscriptComplete: (transcript: string) => void;
    onAudioComplete?: (audioBlob: Blob) => void;
    onCloseTutorial: () => void;
    onInitialClick: () => void;
}

const SpeechButton = ({ onTranscriptComplete, onAudioComplete, onInitialClick }: SpeechButtonProps) => {
    const [isListening, setIsListening] = useState(false);
    const [isInitial, setIsInitial] = useState(true);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    
    let silenceTimeout: NodeJS.Timeout | null = null;

    const sendAudioToServer = async (audioBlob: Blob) => {
        try {
            if (onAudioComplete) {
                onAudioComplete(audioBlob);
            }
        } catch (error) {
            console.error('Error sending audio:', error);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
                setAudioBlob(audioBlob);
                await sendAudioToServer(audioBlob);
            };

            mediaRecorder.current.start();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const startListening = async () => {
        try {
            setIsListening(true);
            setIsInitial(false);
            resetTranscript();
            await startRecording();
            console.log("startListening");
            SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
        } catch (error) {
            console.error('Error starting recording:', error);
            setIsListening(false);
        }
    };

    const stopListening = () => {
        setIsListening(false);
        console.log("stopListening");
        SpeechRecognition.stopListening();
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
        if (transcript) {
            onTranscriptComplete(transcript);
        }
    };

    useEffect(() => {
        if (isListening) {
            if (silenceTimeout) {
                clearTimeout(silenceTimeout);
            }
            silenceTimeout = setTimeout(() => {
                stopListening();
            }, 3000);
        }
        return () => {
            if (silenceTimeout) {
                clearTimeout(silenceTimeout);
            }
            if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
                mediaRecorder.current.stop();
                mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [transcript, isListening]);

    const handleInitialClick = async () => {
        try {
            await onInitialClick();
            setIsInitial(false);
        } catch (error) {
            console.error('Error in handleInitialClick:', error);
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    return (
        <div className={style.container}>
            {isInitial ? (
                <Button 
                    type="button" 
                    className={`${style.speechButton} ${isListening ? style.listening : ''}`}
                    onClick={handleInitialClick}
                >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.78355 21.9999C7.09836 21.2478 5.70641 20.0758 4.7915 18.5068"/>
                        <path d="M14.8252 2.18595C16.5021 1.70882 18.2333 2.16305 19.4417 3.39724"/>
                        <path d="M4.0106 8.36655L3.63846 7.71539L4.0106 8.36655ZM6.50218 8.86743L7.15007 8.48962L6.50218 8.86743ZM3.2028 10.7531L2.55491 11.1309H2.55491L3.2028 10.7531ZM7.69685 3.37253L8.34474 2.99472V2.99472L7.69685 3.37253ZM8.53873 4.81624L7.89085 5.19405L8.53873 4.81624ZM10.4165 9.52517C10.6252 9.88299 11.0844 10.0039 11.4422 9.79524C11.8 9.58659 11.9209 9.12736 11.7123 8.76955L10.4165 9.52517ZM7.53806 12.1327C7.74672 12.4905 8.20594 12.6114 8.56376 12.4027C8.92158 12.1941 9.0425 11.7349 8.83384 11.377L7.53806 12.1327ZM4.39747 5.25817L3.74958 5.63598L4.39747 5.25817ZM11.8381 2.9306L12.486 2.55279V2.55279L11.8381 2.9306ZM14.3638 7.26172L15.0117 6.88391L14.3638 7.26172ZM16.0475 10.1491L16.4197 10.8003C16.5934 10.701 16.7202 10.5365 16.772 10.3433C16.8238 10.15 16.7962 9.94413 16.6954 9.77132L16.0475 10.1491ZM17.6632 5.37608L17.0153 5.75389L17.6632 5.37608ZM20.1888 9.7072L20.8367 9.32939V9.32939L20.1888 9.7072ZM6.99128 17.2497L7.63917 16.8719L6.99128 17.2497ZM16.9576 19.2533L16.5854 18.6021L16.9576 19.2533ZM13.784 15.3C13.9927 15.6578 14.4519 15.7787 14.8097 15.5701C15.1676 15.3614 15.2885 14.9022 15.0798 14.5444L13.784 15.3ZM4.38275 9.0177C5.01642 8.65555 5.64023 8.87817 5.85429 9.24524L7.15007 8.48962C6.4342 7.26202 4.82698 7.03613 3.63846 7.71539L4.38275 9.0177ZM3.63846 7.71539C2.44761 8.39597 1.83532 9.8969 2.55491 11.1309L3.85068 10.3753C3.64035 10.0146 3.75139 9.37853 4.38275 9.0177L3.63846 7.71539ZM7.04896 3.75034L7.89085 5.19405L9.18662 4.43843L8.34474 2.99472L7.04896 3.75034ZM7.89085 5.19405L10.4165 9.52517L11.7123 8.76955L9.18662 4.43843L7.89085 5.19405ZM8.83384 11.377L7.15007 8.48962L5.85429 9.24524L7.53806 12.1327L8.83384 11.377ZM7.15007 8.48962L5.04535 4.88036L3.74958 5.63598L5.85429 9.24524L7.15007 8.48962ZM5.57742 3.5228C6.21109 3.16065 6.8349 3.38327 7.04896 3.75034L8.34474 2.99472C7.62887 1.76712 6.02165 1.54123 4.83313 2.22048L5.57742 3.5228ZM4.83313 2.22048C3.64228 2.90107 3.02999 4.40199 3.74958 5.63598L5.04535 4.88036C4.83502 4.51967 4.94606 3.88363 5.57742 3.5228L4.83313 2.22048ZM11.1902 3.30841L13.7159 7.63953L15.0117 6.88391L12.486 2.55279L11.1902 3.30841ZM13.7159 7.63953L15.3997 10.5269L16.6954 9.77132L15.0117 6.88391L13.7159 7.63953ZM9.71869 3.08087C10.3524 2.71872 10.9762 2.94134 11.1902 3.30841L12.486 2.55279C11.7701 1.32519 10.1629 1.0993 8.9744 1.77855L9.71869 3.08087ZM8.9744 1.77855C7.78355 2.45914 7.17126 3.96006 7.89085 5.19405L9.18662 4.43843C8.97629 4.07774 9.08733 3.4417 9.71869 3.08087L8.9744 1.77855ZM17.0153 5.75389L19.5409 10.085L20.8367 9.32939L18.311 4.99827L17.0153 5.75389ZM15.5437 5.52635C16.1774 5.1642 16.8012 5.38682 17.0153 5.75389L18.311 4.99827C17.5952 3.77068 15.988 3.54478 14.7994 4.22404L15.5437 5.52635ZM14.7994 4.22404C13.6086 4.90462 12.9963 6.40555 13.7159 7.63953L15.0117 6.88391C14.8013 6.52322 14.9124 5.88718 15.5437 5.52635L14.7994 4.22404ZM2.55491 11.1309L6.34339 17.6276L7.63917 16.8719L3.85068 10.3753L2.55491 11.1309ZM16.5854 18.6021C13.2185 20.5264 9.24811 19.631 7.63917 16.8719L6.34339 17.6276C8.45414 21.2472 13.4079 22.1458 17.3297 19.9045L16.5854 18.6021ZM19.5409 10.085C21.1461 12.8377 19.9501 16.6792 16.5854 18.6021L17.3297 19.9045C21.2539 17.6618 22.9512 12.9554 20.8367 9.32939L19.5409 10.085ZM15.0798 14.5444C14.4045 13.3863 14.8772 11.6818 16.4197 10.8003L15.6754 9.49797C13.5735 10.6993 12.5995 13.2687 13.784 15.3L15.0798 14.5444Z"/>
                    </svg>
                </Button>

            ) : (
                <Button 
                    type="button" 
                    className={`${style.speechButton} ${isListening ? style.listening : ''}`}
                    onClick={isListening ? stopListening : startListening}
                >
                    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                        <path d="M94.8,51v11.4c0,15.5-12.6,28-28,28h-4.5c-15.5,0-28-12.6-28-28V51h-6.5v11.4c0,17.5,13.2,31.9,30.2,34.1v14.1l-10.2,8.6H43v5.4h23.9h4.7h14.5v-5.4h-4.7l-10.5-8.9V96.6c17.1-2.1,30.4-16.5,30.4-34.1V51H94.8z"/>
                        <path d="M73.7,60.7v-6.6h13.7v-8.6H73.7V39h13.7v-8.6H73.7v-6.6h13.6C86.9,12.7,77.8,3.7,66.6,3.7h-4.2c-11.2,0-20.3,9-20.6,20.1h13.1v6.6H41.7V39h13.2v6.6H41.7v8.6h13.2v6.6H41.7v0.6C41.7,72.7,51,82,62.4,82h4.2c11.4,0,20.7-9.3,20.7-20.7v-0.6H73.7z"/>
                    </svg>
                </Button>
            )}
        </div>
    );
};

export default SpeechButton;
