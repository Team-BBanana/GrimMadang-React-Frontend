import React from 'react';
import Comment from "./CommentUnit/Comment";
import style from "./CommentUnit/Comment.module.css";
import CommentInput from "./CommentUnit/CommentInput";

interface CommentListProps {
  onCommentCountUpdate: (count: number) => void;
}

const comments = [
  {
    name: "딸",
    comment: "엄마 짱ㄴㅇㄹㄴㅇㄹㄴㅇㄹ",
    date: "2023-10-15"
  },
  {
    name: "손자",
    comment: "ㅇㄻㄴㅇㄻㅈㄷㅎㅁㄴㅇㄹ",
    date: "2023-10-15"
  },
  {
    name: "아들",
    comment: "짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙",
    date: "2023-10-15"
  },
  {
    name: "아들",
    comment: "따봉",
    date: "2023-10-15"
  },
  {
    name: "아들",
    comment: "짜앙",
    date: "2023-10-15"
  },
  {
    name: "아들",
    comment: "짜앙",
    date: "2023-10-15"
  },
  {
    name: "아들",
    comment: "짜앙",
    date: "2023-10-15"
  },
  {
    name: "아들",
    comment: "짜앙",
    date: "2023-10-15"
  },
];

function FamilyCommentList({ onCommentCountUpdate }: CommentListProps) {
  React.useEffect(() => {
    onCommentCountUpdate(comments.length);
  }, [onCommentCountUpdate]);

  return (
    <>
        <div className={style.commentList}>
        {comments.map((comment, index) => (
            <Comment key={index} name={comment.name} comment={comment.comment} date={comment.date} />
        ))}
        </div>
        <CommentInput />
    </>
  );
}

export default FamilyCommentList;