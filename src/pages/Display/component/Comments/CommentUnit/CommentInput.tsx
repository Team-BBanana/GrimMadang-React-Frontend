import Button from '@/components/Button/Button';
import style from './CommentInput.module.css';
import Input from '@/components/InputBox/InputBox';

const CommentInput: React.FC = () => {

    const handleSubmit = () => {
        console.log('등록하기');
    };

    return (
        <div className={style.inputWrapper}>
            <Input
                type="text"
                placeholder="응원의 말을 작성해주세요"
                id="comment"
                name="comment"
                value=""
                onChange={() => {}}
            />
            <Button type='button' onClick={handleSubmit} className={style.commentButton}>응원하기</Button>
        </div>
    );
};  

export default CommentInput;