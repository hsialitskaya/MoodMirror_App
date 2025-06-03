import React, { useState, useRef, useEffect } from "react";
import "../../css/style.css";

const dialogSteps = [
  {
    id: 1,
    text: 'Czuję, że coś Cię niepokoi. Chcesz ze mną poszukać odwagi? Zróbmy to razem.',
    options: [
      { text: 'Tak, jestem gotowy!', nextId: 2 },
      { text: 'Nie teraz...', nextId: 99 },
    ],
  },
  {
    id: 2,
    text: 'Zamknij oczy. Wyobraź sobie spokojny las, gdzie wszystko jest bezpieczne.',
    options: [
      { text: 'Widzę las', nextId: 3 },
      { text: 'Nie mogę się skupić', nextId: 4 },
    ],
  },
  {
    id: 3,
    text: 'Wspaniale! Poczuj, jak każdy oddech uspokaja Twoje serce.',
    options: [
      { text: 'Czuję spokój', nextId: 5 },
      { text: 'To trudne, ale spróbuję', nextId: 5 },
    ],
  },
  {
    id: 4,
    text: 'To w porządku. Możemy spróbować później albo inną metodę. Co wybierasz?',
    options: [
      { text: 'Spróbujmy inną metodę', nextId: 5 },
      { text: 'Zakończmy na dziś', nextId: 99 },
    ],
  },
  {
    id: 5,
    text: 'Jesteś odważniejszy niż myślisz. Pamiętaj, że nie jesteś sam.',
    options: [
      { text: 'Dziękuję', nextId: 99 },
    ],
  },
  {
    id: 99,
    text: 'Kiedy tylko zechcesz, wrócimy do tego razem. Dbaj o siebie!',
    options: [],
  },
];



export default function FearDialog() {
  const [currentId, setCurrentId] = useState(1);
  const audioRef = useRef(null);

  const currentStep = dialogSteps.find((step) => step.id === currentId);

  const handleOptionClick = (nextId) => {
    setCurrentId(nextId);
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;    // zapętlenie
      audioRef.current.play().catch((e) => {
        console.log("Nie udało się odtworzyć audio automatycznie:", e);
      });
    }
  }, []); 

  return (
    <div className="container fear">
      <div className="mentor">
        {currentId === 3 ? (
          <img
            src="/images/forest.jpg"
            alt="Spokojny las"
            className="mentor-img"
          />
        ) : (
          <img
            src="/images/meditation.jpg"
            alt="Wirtualny opiekun - sowa"
            className="mentor-img"
          />
        )}
        <div className="speech-bubble">
          <p>{currentStep.text}</p>
          <div className="options">
            {currentStep.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt.nextId)}
                className="btn"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
        <audio
          ref={audioRef}
          src="/audio/fear_music.mp3"
          preload="auto"
          aria-hidden="true"
        />
      </div>
      <button onClick={handleBackToHome} className="fear_button">
        Wróć do głównej strony
      </button>
    </div>
  );
}
