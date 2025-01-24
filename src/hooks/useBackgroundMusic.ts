import { useEffect, useRef } from 'react';

export const useBackgroundMusic = (audioSrc: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const audio = new Audio();
      audio.src = audioSrc;
      audio.loop = true;
      audio.volume = 0.15;
      audioRef.current = audio;

      const playBGM = () => {
        audioRef.current?.play().catch(error => {
          console.error('BGM play error:', error);
        });
      };

      document.addEventListener('click', playBGM, { once: true });

      return () => {
        audioRef.current?.pause();
        audioRef.current = null;
      };
    } catch (error) {
      console.error('Audio initialization error:', error);
    }
  }, [audioSrc]);

  return audioRef;
}; 