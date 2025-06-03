import React, { useState } from "react";
import "../css/style.css";
import BreathingSession from "./Interactives/Angry";
import DanceSession from "./Interactives/Happy";
import EmotionSupportBot from "./Interactives/Sad";
import FearDialog from "./Interactives/Fear";
import RorschachTest from "./Interactives/Disgust";

const EmotionResult = ({ emotion, onReset }) => {
  const [showDanceSession, setShowDanceSession] = useState(false);
  const [showEmotionSupportBot, setShowEmotionSupportBot] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showFearDialog, setShowFearDialog] = useState(false);
  const [showRorschachTest, setShowRorschachTest] = useState(false);
  const supportedEmotions = ["happy", "sad", "angry", "fear", "disgust"];
  const imageName = supportedEmotions.includes(emotion) ? emotion : "default";

  const handleAction = () => {
    switch(emotion) {
      case "happy":
        setShowDanceSession(true);
        break;
      case "sad":
        setShowEmotionSupportBot(true);
        break;
      case "angry":
        setShowBreathing(true);
        break;
      case "fear":
        setShowFearDialog(true);
        break;
      case "disgust":
         setShowRorschachTest(true);
         break;
      default:
        handleOtherEmotions();
    }
  };

  const handleOtherEmotions = () => {
    switch(emotion) {
      default:
        alert(`Wykryto emocję: ${emotion}`);
    }
    onReset();
  };

  const handleSessionComplete = () => {
    setShowDanceSession(false);
    setShowEmotionSupportBot(false);
    setShowBreathing(false);
    setShowFearDialog(false);
    setShowRorschachTest(false);
    onReset();
  };

  return (
    <div className={`container emotion-result-container emotion-${imageName}`}>
      {showBreathing ? (
        <BreathingSession onComplete={handleSessionComplete} />
      ) : showDanceSession ? (
        <DanceSession onComplete={handleSessionComplete} />
      ) : showEmotionSupportBot ? (
        <EmotionSupportBot onComplete={handleSessionComplete} />
      ) : showFearDialog ? (
        <FearDialog onComplete={handleSessionComplete} />
      ) : showRorschachTest? (
        <RorschachTest onComplete={handleSessionComplete} />
      ) : (
      <>
        <h2 className="emotion-title">Twoja emocja to</h2>
        {!supportedEmotions.includes(emotion) && (
          <p className="emotion-name">{emotion}</p>
        )}
      
        <img src={`/images/${imageName}.jpg`} alt="Obrazek" className="emotion-image" />
        <button onClick={handleAction} className="action-button">
          Wykonaj akcję
        </button>
      </>
      )}
    </div>
  );
};

export default EmotionResult;