import style from "../CanvasPage.module.css";

interface FeedbackProps {
  currentFeedback: string;
}

const FeedbackSection = ({ currentFeedback }: FeedbackProps) => {
  return (
    <div className={style.slidePanel}>
      <div className={style.feedbackContent}>
        <div className={style.feedbackRow}>
          <div>{currentFeedback}</div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;