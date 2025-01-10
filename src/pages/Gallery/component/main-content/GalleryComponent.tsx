import { useNavigate } from "react-router-dom";
import style from "./GalleryComponent.module.css";
import { cardData } from "../Card/cardData";
import Carousel from '../Card/carousel/Carousel';
import { useEffect } from "react";
import API from "@/api";
import { useState } from "react";
import { EmblaOptionsType } from 'embla-carousel'


const GalleryComponent: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateNewCanvas = () => {
        navigate('/canvas', { state: { createNew: true } });
    };

    const [elderName, setElderName] = useState<string>('사용자');

    useEffect(() => {
        const fetchElderName = async () => {
            try {
                const response = await API.galleryApi.getElderName();
                if (response.status === 200) {
                    const name = response.data.elderName || 'ㅁㅁㅁ';
                    console.log(name);
                    setElderName(name);
                }
            } catch (error) {
                console.error('getElderName 실패:', error);
            }
        };
        fetchElderName();
    }, []);

    const OPTIONS: EmblaOptionsType = {loop: true};


    return (
        <div className={style.container}>
            <h1 className={style.title}>{elderName} 님의 그림 전시회</h1>
            <div className={style.carouselContainer}>
                <Carousel
                    slides={cardData.map((card, index) => ({
                        ...card,
                        onClick: () => navigate(`/gallery/${index + 1}`)
                    }))}
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
