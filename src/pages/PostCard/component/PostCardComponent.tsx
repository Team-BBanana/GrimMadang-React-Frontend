import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import style from './PostCardComponent.module.css';
import Button from '@/components/Button/Button';

interface PostCardComponentProps {
    backgroundImage: string;
    onShare: (title: string, content: string, imageBlob: string) => Promise<void>;
}

const PostCardComponent: React.FC<PostCardComponentProps> = ({ backgroundImage, onShare }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formRef.current) {
            try {
                const canvas = await html2canvas(formRef.current);
                const imageBlob = canvas.toDataURL('image/png');
                onShare(title, content, imageBlob);
            } catch (error) {
                console.error('엽서 이미지 생성 실패:', error);
            }
        }
    };

    return (
        <div className={style.container}>
            <h1 className={style.title}>마음을 담은 엽서 만들기</h1>
            <p className={style.description}>
                소중한 추억을 엽서로 만들어 가족들과 공유해보세요
            </p>
            <div 
                className={style.postcard}
                style={{ backgroundImage: `url(${backgroundImage})`}}
            >
                <form ref={formRef} onSubmit={handleSubmit} className={style.form}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        className={style.titleInput}
                        maxLength={50}
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="마음을 담아 메시지를 작성해보세요"
                        className={style.contentInput}
                        maxLength={200}
                    />
                    <div className={style.buttonContainer}>
                        <Button type="submit">
                            카카오톡으로 엽서 보내기
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostCardComponent;
