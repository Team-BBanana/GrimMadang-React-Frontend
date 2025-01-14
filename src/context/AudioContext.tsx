import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface AudioState {
  queue: string[];
  isPlaying: boolean;
}

type AudioAction =
  | { type: 'ADD_TO_QUEUE'; payload: string }
  | { type: 'PLAY_NEXT' }
  | { type: 'SET_PLAYING'; payload: boolean };

const initialState: AudioState = {
  queue: [],
  isPlaying: false,
};

const audioReducer = (state: AudioState, action: AudioAction): AudioState => {
  switch (action.type) {
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] };
    case 'PLAY_NEXT':
      return { ...state, queue: state.queue.slice(1) };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    default:
      return state;
  }
};

const AudioContext = createContext<{
  state: AudioState;
  dispatch: React.Dispatch<AudioAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);

  useEffect(() => {
    if (!state.isPlaying && state.queue.length > 0) {
      const audio = new Audio(state.queue[0]);
      dispatch({ type: 'SET_PLAYING', payload: true });

      audio.play().catch(error => console.error('Audio play error:', error));
      audio.onended = () => {
        dispatch({ type: 'SET_PLAYING', payload: false });
        dispatch({ type: 'PLAY_NEXT' });
      };
    }
  }, [state.isPlaying, state.queue]);

  return (
    <AudioContext.Provider value={{ state, dispatch }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext); 