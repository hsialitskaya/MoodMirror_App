import React, { useRef, useEffect } from "react";
import "../css/style.css";

const Camera = ({ onEmotionDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (e) {
        alert("Błąd dostępu do kamery: " + e.message);
      }
    }
    startCamera();
  }, []);

  const captureAndSend = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, 48, 48);
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.9);

    try {
      const res = await fetch("http://localhost:5002/predict_emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const data = await res.json();
      onEmotionDetected(data.emotion);
    } catch (e) {
      alert("Błąd komunikacji z serwerem: " + e.message);
    }
  };

  return (
    <div className="camera-container">
      <div className="camera-left">
        <img src="/images/main.jpg" alt="Obrazek" className="side-image" />
      </div>
      <div className="camera-right">
        <h1 className="camera-title">Rozpoznawanie Emocji</h1>
        <video ref={videoRef} autoPlay muted className="camera-video" />
        <button onClick={captureAndSend} className="camera-button">
          Rozpoznaj emocję
        </button>
        <canvas ref={canvasRef} width="48" height="48" style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default Camera;
