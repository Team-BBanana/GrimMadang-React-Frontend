import { useState, useEffect } from 'react';
import API from '@/api';
import { useNavigate } from 'react-router-dom';

interface ElderInfo {
  elderId: string;           // 어르신 ID
  name: string;              // 이름
  phoneNumber: string;       // 전화번호
  role: string;             // 역할
  attendance_streak: number; // 연속 출석 일수
  attendance_total: number;  // 총 출석 일수
}

interface ElderInfoResponse {
  status: number;
  data: ElderInfo;
}

export const useElderInfo = () => {
  const [elderInfo, setElderInfo] = useState<ElderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElderInfo = async () => {
      try {
        const response = await API.userApi.getElderInfo() as ElderInfoResponse;
        if (response.status === 200) {
          setElderInfo(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch elder info'));
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchElderInfo();
  }, []);

  return {
    elderInfo,
    isLoading,
    error
  };
}; 