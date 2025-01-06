import API from '@/api';
import style from './component/FamilyComponent.module.css';
import { useNavigate } from 'react-router-dom';
import FamilyComponent from './component/FamilyComponent';

const FamilyPage: React.FC = () => {
    const navigate = useNavigate();

    const handleFamilySelection = async (familyId: string) => {
        console.log(`Selected familyId: ${familyId}`);
        try {
            const response = await API.familyApi.tokenGenerate({familyId: familyId});
            console.log('Token generated:', response.data);
            navigate('/family/gallery');
        } catch (error) {
            console.error('Error generating token:', error);
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <h1 className={style.title}>계정을 선택해주세요</h1>
            <div className={style.accountlist}>
                <FamilyComponent onFamilySelect={handleFamilySelection}/>
            </div>
        </div>
    );
};

export default FamilyPage;