import React from 'react';
import Slider from 'react-slick';
import Comment from "./CommentUnit/Comment";
import CommentInput from "./CommentUnit/CommentInput";
import style from "./CommentList.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

interface CommentListProps {
  onCommentCountUpdate: (count: number) => void;
  userRole: string;
}

const CommentList = ({ onCommentCountUpdate, userRole }: CommentListProps) => {
  const comments = [
    {
      name: "딸",
      role: "daughter",
      comment: "정말 멋있는 그림이에요!",
      date: "2023-10-15"
    },
    {
      name: "손자",
      role: "grandSon",
      comment: "호랑이 너무 무서워요",
      date: "2023-10-15"
    },
    {
      name: "아들",
      role: "son",
      comment: "따봉",
      date: "2023-10-15"
    },
    {
      name: "아들",
      role: "son",
      comment: "따봉",
      date: "2023-10-15"
    },
    {
      name: "아들",
      role: "son",
      comment: "짜앙",
      date: "2023-10-15"
    },
    {
      name: "아들",
      role: "son",
      comment: "짜앙",
      date: "2023-10-15"
    },
  ];

  React.useEffect(() => {
    onCommentCountUpdate(comments.length);
  }, [onCommentCountUpdate]);

  const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button className={style.prevArrow} onClick={onClick}>
        <ChevronLeftIcon />
      </button>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button className={style.nextArrow} onClick={onClick}>
        <ChevronRightIcon />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    className: style.slider,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  return (
    <div className={style.carouselContainer}>
      <div className={style.commentCarousel}>
        <Slider {...settings}>
          {userRole === 'ROLE_FAMILY' && (
            <div className={style.slideWrapper}>
              <CommentInput />
            </div>
          )}
          {comments.map((comment, index) => (
            <div key={index} className={style.slideWrapper}>
              <Comment
                role={comment.role}
                name={comment.name}
                comment={comment.comment}
                date={comment.date}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CommentList;