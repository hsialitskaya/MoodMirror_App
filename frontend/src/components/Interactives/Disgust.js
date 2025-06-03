import React, { useState, useRef, useEffect} from "react";
import "../../css/style.css";

const images = [
  "/images/rorschach1.jpg",
  "/images/rorschach2.jpg",
  "/images/rorschach3.jpg",
];

// Opcje odpowiedzi dla każdego obrazu (indeks obrazu => lista odpowiedzi)
const options = [
  [
    "Bawiące się psy",
    "Owady lub pająki",
    "Ogród z kwiatami",
    "Wiosna lub jesień",
    "Dwie osoby",
    "Kolorowy tusz",
    "Nic, zupełnie nic",
  ],
  [
    "Dwa słonie",
    "Dwóch klaunów",
    "Małe twarze po bokach",
    "Tusz czerwony i czarny",
    "Owad, na którego ktoś nastąpił",
    "Wybuch bomby",
    "Nic, zupełnie nic",
  ],
  [
    "Policjant",
    "Nietoperz lub motyl",
    "Nogi",
    "Czarne chmury",
    "Głowa aligatora",
    "Zdjęcie rentgenowskie",
    "Nic, zupełnie nic",
  ],
];

// Funkcja generująca podsumowanie na podstawie odpowiedzi 
const summarizeAnswers = (answers) => {
  if (answers.includes("Nic, zupełnie nic")) {
    return "Zauważyłeś pustkę lub niechęć do interpretacji – to naturalne, umysł czasem się broni.";
  }
  if (answers.some((a) => a.toLowerCase().includes("ciało") || a.toLowerCase().includes("skóra"))) {
    return "Twoje odpowiedzi sugerują dużą wrażliwość na cechy ludzkie i cielesne.";
  }
  return "Twoje odpowiedzi są zróżnicowane, co pokazuje bogactwo Twojej wyobraźni i emocji.";
};

export default function RorschachTest() {
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const audioRef = useRef(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedOption) return alert("Wybierz odpowiedź przed zatwierdzeniem.");
    setAnswers((prev) => [...prev, selectedOption]);
    setSelectedOption("");

    if (step === images.length - 1) {
      // ostatni obraz, pokazujemy podsumowanie
      setShowSummary(true);
    } else {
      setStep((prev) => prev + 1);
    }
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

  if (showSummary) {
    return (
      <div className="container disgust">
        <h2 className="title">Podsumowanie testu</h2>
        <p className="feedback-message">{summarizeAnswers(answers)}</p>
        <button onClick={handleBackToHome} className="disgust_button">
          Wróć do głównej strony
        </button>
      </div>
    );
  }

  return (
    <div className="container disgust">
      <h2 className="title">Ukryty przekaz</h2>
      <img src={images[step]} alt={`rorschach test ${step + 1}`} className="rorschach-image" />
      <p className="question">Co widzisz na tym obrazie?</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="options-list" style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto 20px" }}>
          {options[step].map((option, idx) => (
            <label key={idx} style={{ display: "block", marginBottom: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="rorschach-option"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                style={{ marginRight: "10px" }}
              />
              {option}
            </label>
          ))}
        </div>

        <button type="submit" className="submit-button" disabled={!selectedOption}>
          {step === images.length - 1 ? "Zakończ i zobacz podsumowanie" : "Zatwierdź i następny obraz"}
        </button>
      </form>

      <audio
          ref={audioRef}
          src="/audio/disgust_music.mp3"
          preload="auto"
          aria-hidden="true"
        />

      <button onClick={handleBackToHome} className="disgust_button">
        Wróć do głównej strony
      </button>
    </div>
  );
}
