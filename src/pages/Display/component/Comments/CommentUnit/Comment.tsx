import style from "./Comment.module.css";

interface CommentProps {
    name: string;
    comment: string;
    date: string;
}

function Comment(props: CommentProps) {
    return (
        <div className={style.wrapper}>
            <div className={style.imageContainer}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    className={style.image} />
            </div>

            <div className={style.contentContainer}>
                <div className={style.headerContainer}>
                    <span className={style.nameText}>{props.name}</span>
                    <span className={style.dateText}>{props.date}</span>
                </div>
                <span className={style.commentText}>{props.comment}</span>
            </div>
        </div>
    );
}

export default Comment;