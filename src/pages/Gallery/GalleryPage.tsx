
import GalleryComponent from "./component/GalleryComponent";
import SpeechButton from "./component/SpeechButton/SpeechButton";

const GalleryPage = () => {
    const handleSpeechButtonClick = () => {
        // AI 음성 기능 호출
        console.log("AI 음성 기능 호출");
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <GalleryComponent />
            <SpeechButton onClick={handleSpeechButtonClick} />
        </div>
    );
}

export default GalleryPage;