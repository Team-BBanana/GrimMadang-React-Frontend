import { useEffect, useRef, useState, useCallback } from "react";
import CanvasSection from "./components/CanvasSection";
import style from "./CanvasPage.module.css";
import API from "@/api";
import debounce from 'lodash/debounce';
import { useLocation, useNavigate } from "react-router-dom";

const aiServerUrl = "ws://127.0.0.1:8081/drawing/send";

type WebSocketMessage = {
  canvas_id?: string;
  image_url?: string;
};

const CanvasPage = () => {
  const location = useLocation();
  const shouldCreateCanvas = location.state?.createNew === true;
  const socketRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasId, setCanvasId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const reconnectTimeoutRef = useRef<number>();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const createCanvasAndConnectWebSocket = async () => {
      try {
        const response = await API.canvasApi.createCanvas({ title: "임시 제목" });
        console.log('Canvas created:', response);

        // Extract redirect_url from the response
        const redirectUrl = response.data.redirect_url;
        if (redirectUrl) {
          const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
          const robotId = urlParams.get('robot_id');
          const canvasId = urlParams.get('canvas_id');
          const name = urlParams.get('name');
          const age = urlParams.get('age');

          console.log('Parsed URL Parameters:', { robotId, canvasId, name, age });

          // Use the canvasId for WebSocket connection
          if (canvasId) {
            setCanvasId(canvasId);
            connectWebSocket(canvasId);
          }
        }
      } catch (error) {
        console.error('Error creating canvas:', error);
      }
    };

    createCanvasAndConnectWebSocket();
  }, []);

  const connectWebSocket = useCallback((canvasId: string) => {
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        console.log('기존 웹소켓 연결 재사용');
        try {
          socketRef.current.send(JSON.stringify({ canvas_id: canvasId }));
          setCanvasId(canvasId);
        } catch (error) {
          console.error('기존 소켓 메시지 전송 실패:', error);
          socketRef.current.close();
        }
        return;
      } else if (socketRef.current.readyState === WebSocket.CONNECTING) {
        console.log('웹소켓 연결 중...');
        return;
      }
    }

    try {
      const ws = new WebSocket(aiServerUrl);

      ws.onopen = () => {
        console.log('WebSocket 연결 성공');
        setIsConnected(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        ws.send(JSON.stringify({ canvas_id: canvasId }));
        console.log('WebSocket 메시지 전송:', JSON.stringify({ 'canvas_id': canvasId }));
      };

      ws.onerror = (error) => {
        console.error('웹소켓 에러 발생:', error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket 연결 종료. 코드:', event.code, '사유:', event.reason);
        setIsConnected(false);
        socketRef.current = null;
        
        if (event.code !== 1000) {
          console.log('재연결 시도 중...');
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connectWebSocket(canvasId);
          }, 3000);
        }
      };

      socketRef.current = ws;
    } catch (error) {
      console.error('WebSocket 초기화 실패:', error);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    const createCanvasAndConnectWebSocket = async () => {
      try {
        if (shouldCreateCanvas) {
          const response = await API.canvasApi.createCanvas({ title: "임시 제목" });
          const redirectUrl = response.data.redirect_url;
          if (redirectUrl) {
            const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
            const robotId = urlParams.get('robot_id');
            const newCanvasId = urlParams.get('canvas_id') || '';
            const name = urlParams.get('name');
            const age = urlParams.get('age');

            console.log('Parsed URL Parameters:', { robotId, newCanvasId, name, age });

            sessionStorage.setItem('canvasId', newCanvasId);
            setCanvasId(newCanvasId);
            connectWebSocket(newCanvasId);
          }
        } else { 
          const existingCanvasId = sessionStorage.getItem('canvasId') || '';
          if (!existingCanvasId) {
            console.warn('No existing canvasId found. Redirecting to main page.');
            navigate('/');
            return;
          }
          setCanvasId(existingCanvasId);
          connectWebSocket(existingCanvasId);
        }
      } catch (error) {
        console.error('Error creating canvas:', error);
      }
    };

    createCanvasAndConnectWebSocket();

    return () => {
      if (socketRef.current) {
        console.log('컴포넌트 언마운트: 웹소켓 연결 정리');
        socketRef.current.close(1000, '정상 종료');
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [shouldCreateCanvas, connectWebSocket, navigate]);

  const sendCanvasImage = useCallback((type: 'CANVAS_UPDATE' | 'CANVAS_SAVE') => {
    if (!canvasRef.current || socketRef.current?.readyState !== WebSocket.OPEN) return;
    
    const message: WebSocketMessage = {
      canvas_id: canvasId,
      image_url: canvasRef.current.toDataURL('image/png', 1.0).split(',')[1]
    };

    console.log('Sending message:', message);
    
    socketRef.current.send(JSON.stringify(message));
  }, [canvasId]);

  const handleDraw = useCallback(() => {
    sendCanvasImage('CANVAS_UPDATE');
  }, [sendCanvasImage]);

  const debouncedSaveCanvas = useCallback(
    debounce(() => sendCanvasImage('CANVAS_SAVE'), 10000),
    [sendCanvasImage]
  );

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log('컴포넌트 언마운트: 웹소켓 연결 정리');
        socketRef.current.close(1000, '정상 종료');
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      debouncedSaveCanvas.cancel();
    };
  }, [debouncedSaveCanvas]);

  return (
    <div className={style.canvasContainer}>
      {showNotification && (
        <div className={style.notification}>
          친구와 함께 그림을 그려보아요🎨
        </div>
      )}
      <CanvasSection 
        className={style.canvasSection} 
        onUpload={handleDraw}
        canvasRef={canvasRef}
        onChange={debouncedSaveCanvas}
      />
    </div>
  );
};

export default CanvasPage;
