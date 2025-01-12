import React, { useState } from 'react';
import Comment from "./CommentUnit/Comment";
import style from "./CommentUnit/Comment.module.css";
import CommentInput from "./CommentUnit/CommentInput";
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

interface CommentListProps {
  onCommentCountUpdate: (count: number) => void;
}

function FamilyCommentList({ onCommentCountUpdate }: CommentListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      comment: "짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙짜앙",
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

  React.useEffect(() => {
    onCommentCountUpdate(comments.length);
  }, [onCommentCountUpdate]);

  const handlePrev = () => {
    setCurrentIndex(prev => 
      prev === 0 ? comments.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prev => 
      prev === comments.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={style.carouselContainer}>
      <div className={style.commentCarousel}>
        <button 
          className={style.carouselButton} 
          onClick={handlePrev}
          aria-label="이전 댓글"
        >
          <ChevronLeftIcon />
        </button>

        <div className={style.singleCommentWrapper}>
          <Comment 
            name={comments[currentIndex].name}
            comment={comments[currentIndex].comment}
            date={comments[currentIndex].date}
          />
        </div>

        <button 
          className={style.carouselButton} 
          onClick={handleNext}
          aria-label="다음 댓글"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className={style.pageIndicator}>
        {currentIndex + 1} / {comments.length}
      </div>

      <CommentInput />
    </div>
  );
}

export default FamilyCommentList;