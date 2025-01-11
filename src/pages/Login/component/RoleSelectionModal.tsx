import React, { useState } from 'react';
import style from './RoleSelectionModal.module.css';
import Button from '@/components/Button/Button';
import Input from '@/components/InputBox/InputBox';

interface RoleSelectionModalProps {
    onSelect: (role: 'ROLE_FAMILY' | 'ROLE_ELDER', phoneNumber: string) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onSelect }) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setPhoneNumber(value);
    };

    const handleFamilySubmit = () => {
        onSelect('ROLE_FAMILY', phoneNumber);
    };

    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <div className={style.familyForm}>
                    <Input
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        placeholder="어르신의 전화번호"
                        value={phoneNumber}
                        onChange={handleInputChange}
                        required
                    />
                    <Button type="button" onClick={handleFamilySubmit}>
                        제출
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionModal;