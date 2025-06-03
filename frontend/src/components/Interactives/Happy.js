import React, { useRef, useState, useEffect } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "../../css/style.css";

export default function DanceChallengeApp() {
  const videoDanceRef = useRef(null);
  const videoCamRef = useRef(null);
  const audioStartRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameEnded, setGameEnded] = useState(false); 

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoCamRef.current) videoCamRef.current.srcObject = stream;

        const newDetector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        setDetector(newDetector);
      } catch (e) {
        console.error("Błąd inicjalizacji kamery/detektora", e);
      }
    })();
  }, []);

  const analyzePoseAndScore = (pose, prevData) => {
    if (!pose) return { scoreToAdd: 0, newPrevData: prevData };

    const keypoints = pose.keypoints.reduce((acc, kp) => {
      acc[kp.name] = kp;
      return acc;
    }, {});

    let scoreToAdd = 0;
    let newPrevData = { ...prevData };

    const getY = (name) => keypoints[name]?.y || 0;
    const getX = (name) => keypoints[name]?.x || 0;

    const noseY = getY("nose");
    const avgKneeY = (getY("left_knee") + getY("right_knee")) / 2;
    if (noseY < avgKneeY - 100) {
      if (!prevData.jumping) {
        scoreToAdd += 1;
        newPrevData.jumping = true;
      }
    } else {
      newPrevData.jumping = false;
    }

    const avgHipY = (getY("left_hip") + getY("right_hip")) / 2;
    if (avgHipY > avgKneeY - 10) {
      if (!prevData.squatting) {
        scoreToAdd += 1;
        newPrevData.squatting = true;
      }
    } else {
      newPrevData.squatting = false;
    }

    const leftArmUp = getY("left_wrist") < getY("left_shoulder") - 50;
    const rightArmUp = getY("right_wrist") < getY("right_shoulder") - 50;
    if ((leftArmUp || rightArmUp) && !prevData.armsUp) {
      scoreToAdd += 1;
      newPrevData.armsUp = true;
    } else if (!leftArmUp && !rightArmUp) {
      newPrevData.armsUp = false;
    }

    const distWrists = Math.hypot(getX("left_wrist") - getX("right_wrist"), getY("left_wrist") - getY("right_wrist"));
    const heightDiffWrists = Math.abs(getY("left_wrist") - getY("right_wrist"));
    if (distWrists < 50 && heightDiffWrists < 30 && !prevData.clapping) {
      scoreToAdd += 1;
      newPrevData.clapping = true;
    } else if (distWrists >= 50 || heightDiffWrists >= 30) {
      newPrevData.clapping = false;
    }

    const leftWristX = getX("left_wrist");
    const rightWristX = getX("right_wrist");
    if (
      !prevData.waving && 
      ((prevData.leftWristX !== undefined && Math.abs(leftWristX - prevData.leftWristX) > 30) ||
       (prevData.rightWristX !== undefined && Math.abs(rightWristX - prevData.rightWristX) > 30))
    ) {
      scoreToAdd += 1;
      newPrevData.waving = true;
    } else if (
      prevData.leftWristX !== undefined &&
      prevData.rightWristX !== undefined &&
      Math.abs(leftWristX - prevData.leftWristX) <= 30 &&
      Math.abs(rightWristX - prevData.rightWristX) <= 30
    ) {
      newPrevData.waving = false;
    }

    newPrevData.leftWristX = leftWristX;
    newPrevData.rightWristX = rightWristX;

    return { scoreToAdd, newPrevData };
  };

  const prevPoseDataRef = React.useRef({});

  useEffect(() => {
    if (!running || !detector || !videoCamRef.current) return;

    let animationFrameId;
    const startTime = Date.now();

    const runDetection = async () => {
      if (Date.now() - startTime > 30000) {
        setRunning(false);
        setGameEnded(true);  
        if (videoDanceRef.current) videoDanceRef.current.pause();
        if (videoCamRef.current) videoCamRef.current.pause();
        return;
      }

      const poses = await detector.estimatePoses(videoCamRef.current);
      if (poses.length > 0) {
        const { scoreToAdd, newPrevData } = analyzePoseAndScore(poses[0], prevPoseDataRef.current);
        prevPoseDataRef.current = newPrevData;
        if (scoreToAdd > 0) {
          setScore((prev) => prev + scoreToAdd);
        }
      }
      animationFrameId = requestAnimationFrame(runDetection);
    };

    runDetection();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [running, detector]);

  const handleStart = () => {
    setScore(0);
    prevPoseDataRef.current = {};
    setTimeLeft(30);
    setRunning(true);
    setGameEnded(false);

    if (audioStartRef.current) {
      audioStartRef.current.currentTime = 0;
      audioStartRef.current.play().catch((e) => {
        console.warn("Nie udało się odtworzyć dźwięku startowego:", e);
      });
    }


    if (videoDanceRef.current) {
      videoDanceRef.current.currentTime = 0;
      videoDanceRef.current.play().catch((e) => {
        console.error("Failed to play dance video:", e);
        alert("Error: Dance video cannot be played. Check if the file exists.");
      });
    }

    if (videoCamRef.current) {
      videoCamRef.current.play().catch((e) => {
        console.error("Failed to play camera stream:", e);
        alert("Error: Camera access failed. Please allow camera permissions.");
      });
    }

    const intervalId = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalId);
          setRunning(false);
          setGameEnded(true);
          videoDanceRef.current?.pause();
          videoCamRef.current?.pause();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="container happy">
      <h1>Just Dance Style - Challenge</h1>

      {!gameEnded ? (
        <>
          <div className="videos-row">
            <div className="video-wrapper">
              <h2>Wideo z tańcem</h2>
              <video
                ref={videoDanceRef}
                src="/video/dance.mp4"
                muted
                playsInline
                autoPlay={false}
                className="video"
              />

              <audio ref={audioStartRef} src="/audio/happy_music.mp3" />
            </div>

            <div className="video-wrapper">
              <h2>Twoja kamerka</h2>
              <video
                ref={videoCamRef}
                autoPlay
                muted
                playsInline
                className="video"
              />
            </div>
          </div>

          <div className="controls">
            <button onClick={handleStart} disabled={running} className={`start-btn ${running ? "disabled" : ""}`}>
              Start
            </button>
          </div>

          <div className="scoreboard">
            {running
              ? `Czas: ${timeLeft}s | Punkty: ${score}`
              : timeLeft === 0
              ? `Koniec! Twoje punkty: ${score}`
              : "Kliknij Start, aby zacząć tańczyć!"}
          </div>
         <button onClick={handleBackToHome} className="happy_button">
            Wróć do głównej strony
         </button>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            fontSize: "3rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <p>Koniec gry!</p>
          <p>Twoje punkty: {score}</p>
          <button onClick={handleBackToHome} className="happy_button">
            Wróć do głównej strony
          </button>
        </div>
      )}
    </div>
  );
}
