import React, { useState } from "react";
import Camera from "./components/Camera";
import EmotionResult from "./components/EmotionResult";

function App() {
  const [emotion, setEmotion] = useState(null);

  // funkcja wywoływana po wykryciu emocji
  const onEmotionDetected = (detectedEmotion) => {
    setEmotion(detectedEmotion);
  };

  // reset emocji i wróć do kamery
  const reset = () => {
    setEmotion(null);
  };

  return (
    <div>
      {!emotion && <Camera onEmotionDetected={onEmotionDetected} />}
      {emotion && <EmotionResult emotion={emotion} onReset={reset} />}
    </div>
  );
}

export default App;
