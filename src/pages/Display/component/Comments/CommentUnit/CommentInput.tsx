import React, { useState } from 'react';
import Button from '@/components/Button/Button';
import style from './CommentInput.module.css';
import Input from '@/components/InputBox/InputBox';

interface CommentInputProps {
    onSubmit: (comment: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ onSubmit }) => {
    const [comment, setComment] = useState<string>("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit(comment);  // 부모 컴포넌트로 코멘트 전달
        setComment("");     // 입력 후 상태 초기화
    };

    return (
        <div className={style.inputWrapper}>
            <Input
                type="text"
                placeholder="응원의 한마디를 작성해주세요!"
                id="comment"
                name="comment"
                value={comment}
                onChange={handleInputChange}
            />
            <Button type='button' onClick={handleSubmit} className={style.commentButton}>응원하기</Button>
        </div>
    );
};

export default CommentInput;