import { useState, useEffect } from 'react';
import API from '@/api';

interface ElderInfo {
  elderId: string;           // 어르신 ID
  name: string;              // 이름
  phoneNumber: string;       // 전화번호
  role: string;             // 역할
  attendance_streak: number; // 연속 출석 일수
  attendance_total: number;  // 총 출석 일수
}

export const useElderInfo = () => {
  const [elderInfo, setElderInfo] = useState<ElderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchElderInfo = async () => {
      try {
        const response = await API.userApi.getElderInfo();
        if (response.status === 200) {
          const elderData = response.data as ElderInfo;
          console.log('elderData:', elderData);
          setElderInfo(elderData);
        }
      } catch (error) {
        console.error('getElderInfo 실패:', error);
        setError(error as Error);
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