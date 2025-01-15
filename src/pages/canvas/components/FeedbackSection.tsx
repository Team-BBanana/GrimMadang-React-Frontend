import style from "../CanvasPage.module.css";

interface FeedbackProps {
  currentFeedback: {
    title: string;
    description: string;
  };
  isFeedbackCardCollapsed: boolean;
  toggleFeedbackCard: (e: React.MouseEvent) => void;
}

const ChevronIcon = () => (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
    >
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

const FeedbackSection = ({ currentFeedback, isFeedbackCardCollapsed, toggleFeedbackCard }: FeedbackProps) => {
  return (
    <div 
        className={`${style.slidePanel}`}
        onClick={toggleFeedbackCard}
    >
        <div className={`${style.feedbackContent} ${isFeedbackCardCollapsed ? style.collapsed : ''}`}>
            <div className={style.feedbackRow}>
                <h3>{currentFeedback.title}</h3>
                <div className={`${style.toggleIcon} ${isFeedbackCardCollapsed ? style.toggleIconRotated : ''}`}>
                    <ChevronIcon />
                </div>
            </div>
            <div className={style.feedbackDescription}>
                <p>{currentFeedback.description}</p>
            </div>
        </div>
    </div>
  );
};

export default FeedbackSection;