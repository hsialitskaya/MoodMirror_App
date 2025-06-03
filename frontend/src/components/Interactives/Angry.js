import React, { useEffect, useRef, useState } from "react";
import "../../css/style.css";

// Stałe konfiguracyjne
const PARTICLE_COLORS = [
  "particle-red",
  "particle-crimson",
  "particle-firebrick",
  "particle-tomato",
  "particle-indianred",
  "particle-lightcoral",
];
const ANIMATION_CLASSES = ["float1", "float2", "float3", "float4", "float1", "float2"]; 
const NUM_PARTICLES = 60;
const CYCLE_DURATION_MS = 12000;
const TOTAL_CYCLES = 10;
const PHASE_TIMES = [4000, 2000, 4000, 2000];
const PHASES = ["Wdech", "Zatrzymaj", "Wydech", "Zatrzymaj"];

const BreathingSession = ({ onComplete }) => {
  const [breathingPhase, setBreathingPhase] = useState("Wdech");
  const audioRef = useRef(null);

  // Efekt dla głównego timera sesji i muzyki
  useEffect(() => {
  const audioElement = audioRef.current; 

  const handleAudio = async () => {
    try {
      if (audioElement) {
        audioElement.loop = true;
        await audioElement.play();
      }
    } catch (error) {
      console.error("Błąd odtwarzania muzyki:", error);
    }
  };

  const sessionTimeout = setTimeout(() => {
    onComplete?.();
  }, CYCLE_DURATION_MS * TOTAL_CYCLES);

  handleAudio();

  return () => {
    if (audioElement) {
      audioElement.pause();
    }
    clearTimeout(sessionTimeout);
  };
}, [onComplete]); 

  // Efekt dla faz oddechu
  useEffect(() => {
    let phaseIndex = 0;
    let timeoutId;

    const updatePhase = () => {
      setBreathingPhase(PHASES[phaseIndex]);
      timeoutId = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % PHASES.length;
        updatePhase();
      }, PHASE_TIMES[phaseIndex]);
    };

    updatePhase();
    return () => clearTimeout(timeoutId);
  }, []);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // Generowanie cząsteczek
  const generateParticles = () => 
    Array.from({ length: NUM_PARTICLES }, (_, i) => {
      const size = `${4 + Math.random() * 8}px`;
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 15}s`;
      const duration = `${10 + Math.random() * 10}s`;
      const colorClass = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const animationClass = ANIMATION_CLASSES[Math.floor(Math.random() * ANIMATION_CLASSES.length)];

      return (
        <div
          key={i}
          className={`particle ${colorClass} ${animationClass}`}
          style={{
            width: size,
            height: size,
            left,
            top,
            animationDelay: delay,
            animationDuration: duration
          }}
        />
      );
    });

  return (
    <div className="container angry">
      <h5>Breathing session</h5>

       <div className="content-wrapper">
      <div className="breathing-circle" />
      {generateParticles()}
      <p className="breathing-text">{breathingPhase}</p>
      
      <audio
        ref={audioRef}
        src="/audio/angry_music.mp3"  
        preload="auto"
        aria-hidden="true"
      />
    </div>
      <button onClick={handleBackToHome} className="angry_button">
            Wróć do głównej strony
      </button>
    </div>
  );
};

export default BreathingSession;