import { useNavigate } from "react-router-dom";
import style from "./GalleryComponent.module.css";
import Carousel from '../Card/carousel/Carousel';
import { EmblaOptionsType } from 'embla-carousel'

interface ElderInfo {
    elderId: string | null;
    name: string | "ㅁㅁㅁ";
    phoneNumber: string | null;
    role: string | null;
    attendance_streak: number | null;
    attendance_total: number | null;
}

interface Drawing {
  id: string;
  user: {
    id: string;
    name: string;
  };
  title: string;
  imageUrl1: string;
  imageUrl2: string;
  description: string;
  feedback1: string;
  feedback2: string;
  createdAt: string;
  updatedAt: string;
}

interface GalleryComponentProps {
    elderinfo: ElderInfo | null;
    drawings: Drawing[];
}


const GalleryComponent: React.FC<GalleryComponentProps> = ({ elderinfo, drawings }) => {
    const navigate = useNavigate();
    
    const handleCreateNewCanvas = () => {
      navigate('/canvas', { state: { createNew: true } });
    };

    const OPTIONS: EmblaOptionsType = {loop: true};

    // Carousel에 필요한 형식으로 drawings 데이터 변환
    const carouselSlides = drawings.map((drawing) => ({
        imageUrl: drawing.imageUrl2,  // Carousel이 필요로 하는 imageUrl
        title: drawing.title,         // Carousel이 필요로 하는 title
        onClick: () => navigate(`/gallery/${drawing.id}`)
    }));

    return (
        <div className={style.container}>
            <h1 className={style.title}>{elderinfo?.name} 님의 그림 전시회</h1>
            <div className={style.explaination}>
                <p>그림을 눌러 가족들의 응원 한마디를 확인해보세요!</p>
            </div>
            <div className={style.carouselContainer}>
                <Carousel
                    slides={[
                        ...carouselSlides,
                        ...(elderinfo?.role === 'ROLE_ELDER' ? [{
                            imageUrl: '',
                            title: '새 캔버스 만들기',
                            onClick: handleCreateNewCanvas,
                            isAddButton: true
                        }] : [])
                    ]}
                    options={OPTIONS}
                />
            </div>
            
        </div>
    );
};

export default GalleryComponent;
