import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@/components/Button/Button';
import style from './PostCardComponent.module.css';

interface PostCardComponentProps {
    backgroundImage: string;
    onShare: (title: string, content: string) => void;
}

const PostCardComponent: React.FC<PostCardComponentProps> = ({ backgroundImage, onShare }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { id } = useParams();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onShare(title, content);
    };

    return (
        <div className={style.container}>
            <div 
                className={style.postcard}
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <form onSubmit={handleSubmit} className={style.form}>
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
                            엽서 보내기
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostCardComponent;
