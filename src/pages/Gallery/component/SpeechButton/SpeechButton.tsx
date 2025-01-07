import { useState, useEffect } from 'react';
import Button from '@/components/Button/Button';
import style from './SpeechButton.module.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface SpeechButtonProps {
    onTranscriptComplete: (transcript: string) => void;
}

const SpeechButton = ({ onTranscriptComplete }: SpeechButtonProps) => {
    const [isListening, setIsListening] = useState(false);
    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    
    let silenceTimeout: NodeJS.Timeout | null = null;

    const startListening = () => {
        setIsListening(true);
        resetTranscript();
        console.log("startListening");
        SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    };

    const stopListening = () => {
        setIsListening(false);
        console.log("stopListening");
        SpeechRecognition.stopListening();
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
            }, 2000);
        }
        return () => {
            if (silenceTimeout) {
                clearTimeout(silenceTimeout);
            }
        };
    }, [transcript, isListening]);

    if (!browserSupportsSpeechRecognition) {
        return null;
    }

    return (
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
    );
};

export default SpeechButton;
