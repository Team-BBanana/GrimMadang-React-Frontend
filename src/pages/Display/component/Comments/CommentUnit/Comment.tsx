import style from "./Comment.module.css";
import sonImage from "@/assets/imgs/son.svg";
import daughterImage from "@/assets/imgs/daughter.svg";
import husbandImage from "@/assets/imgs/husband.svg";
import wifeImage from "@/assets/imgs/wife.svg";
import grandSonImage from "@/assets/imgs/grandSon.svg";
import grandDaughterImage from "@/assets/imgs/grandDaughter.svg";

interface CommentProps {
    name: string;
    comment: string;
    date: string;
    role: string;
}

function Comment(props: CommentProps) {
    const getImageSrc = (role: string) => {
        switch (role) {
            case 'son':
                return sonImage;
            case 'daughter':
                return daughterImage;
            case 'husband':
                return husbandImage;
            case 'wife':
                return wifeImage;
            case 'grandSon':
                return grandSonImage;
            case 'grandDaughter':
                return grandDaughterImage;
            default:
                return 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];  // yyyy-mm-dd 형식으로 변환
    };

    return (
        <div className={style.wrapper}>
            <div className={style.imageContainer}>
                <img src={getImageSrc(props.role)} className={style.image} />
            </div>

            <div className={style.contentContainer}>
                <div className={style.headerContainer}>
                    <span className={style.nameText}>{props.name}</span>
                    <span className={style.commentText}>{props.comment}</span>
                </div>
                <span className={style.dateText}>{formatDate(props.date)}</span>
            </div>
        </div>
    );
}

export default Comment;