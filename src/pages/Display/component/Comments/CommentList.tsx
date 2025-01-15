import React, { useEffect } from 'react';
import Slider from 'react-slick';
import CommentItem from "./CommentUnit/Comment";
import CommentInput from "./CommentUnit/CommentInput";
import style from "./CommentList.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        role: string;
    };
}

interface CommentListProps {
    onCommentCountUpdate: (count: number) => void;
    userRole: string;
    onCommentSubmit: (comment: string) => void;
    comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ 
    onCommentCountUpdate, 
    userRole,
    onCommentSubmit,
    comments 
}) => {
  const mockComments: Comment[] = [
    {
      id: 'mock1',
      user: {
        id: '1',
        name: "딸",
        role: "daughter"
      },
      content: "정말 멋있는 그림이에요!",
      createdAt: "2023-10-15"
    },
  
    {
      id: 'mock5',
      user: {
        id: '5',
        name: "아들",
        role: "son"
      },
      content: "짜앙",
      createdAt: "2023-10-15"
    }
  ];

  const allComments = [...comments, ...mockComments];

  useEffect(() => {
    onCommentCountUpdate(allComments.length);
  }, [allComments, onCommentCountUpdate]);

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
    <div className={style.commentCarousel}>
      <Slider {...settings}>
        {userRole === 'ROLE_FAMILY' && (
          <div className={style.slideWrapper}>
            <CommentInput onSubmit={onCommentSubmit} />
          </div>
        )}
        {allComments.map((comment) => (
          <div key={comment.id} className={style.slideWrapper}>
            <CommentItem
              role={comment.user.role}
              name={comment.user.name}
              comment={comment.content}
              date={comment.createdAt}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CommentList;