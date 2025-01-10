import { useNavigate } from "react-router-dom";
import style from "./GalleryComponent.module.css";
import { cardData } from "../Card/cardData";
import Carousel from '../Card/carousel/Carousel';
import { EmblaOptionsType } from 'embla-carousel'
import { useUserRole } from "@/hooks/UserContext";

interface ElderInfo {
    elderId: string | null;
    name: string | "ㅁㅁㅁ";
    phoneNumber: string | null;
    role: string | null;
    attendance_streak: number | null;
    attendance_total: number | null;
}

interface GalleryComponentProps {
    elderinfo: ElderInfo | null;
}


const GalleryComponent: React.FC<GalleryComponentProps> = ({ elderinfo }) => {
    const navigate = useNavigate();
    const { userRole } = useUserRole();
    
    const handleCreateNewCanvas = () => {
      navigate('/canvas', { state: { createNew: true } });
    };


    const OPTIONS: EmblaOptionsType = {loop: true};

    return (
        <div className={style.container}>
            <h1 className={style.title}>{elderinfo?.name} 님의 그림 전시회</h1>
            <div className={style.carouselContainer}>
                <Carousel
                    slides={[
                        ...cardData.map((card, index) => ({
                            ...card,
                            onClick: () => navigate(`/gallery/${index + 1}`)
                        })),
                        ...(userRole === 'ROLE_ELDER' ? [{
                            imageUrl: '',
                            title: '새 캔버스 만들기',
                            onClick: handleCreateNewCanvas,
                            isAddButton: true
                        }] : [])
                    ]}
                    options={OPTIONS}
                />
            </div>
            <div className={style.explaination}>
                <p>그림을 눌러 가족들의 응원 한마디를 확인해보세요!</p>
            </div>
        </div>
    );
};

export default GalleryComponent;
