import React, { useState } from 'react';
import style from './RoleSelectionModal.module.css';
import Button from '@/components/Button/Button';
import Input from '@/components/InputBox/InputBox';

interface RoleSelectionModalProps {
    onSelect: (role: 'ROLE_FAMILY' | 'ROLE_ELDER', familyInfo?: { name: string; phoneNumber: string }) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onSelect }) => {
    const [isFamilyFormVisible, setIsFamilyFormVisible] = useState(false);
    const [familyInfo, setFamilyInfo] = useState({ name: '', phoneNumber: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFamilyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleFamilySubmit = () => {
        onSelect('ROLE_FAMILY', familyInfo);
    };

    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h2>{isFamilyFormVisible ? '어떤 분의 그림을 보러 왔나요?' : '환영합니다!'}</h2>
                {isFamilyFormVisible ? (
                    <div className={style.familyForm}>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="가족의 이름"
                            value={familyInfo.name}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            id="phoneNumber"
                            type="text"
                            name="phoneNumber"
                            placeholder="가족의 전화번호"
                            value={familyInfo.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                        <Button type="button" onClick={handleFamilySubmit}>
                            제출
                        </Button>
                    </div>
                ) : (
                    <div className={style.buttonGroup}>
                        <Button type="button" onClick={() => setIsFamilyFormVisible(true)}>
                            🖼️ 그림을 볼거에요!
                        </Button>
                        <Button type="button" onClick={() => onSelect('ROLE_ELDER')}>
                            🎨 그림을 그릴거에요!
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoleSelectionModal;