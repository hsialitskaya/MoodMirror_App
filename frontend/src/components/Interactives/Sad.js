import React, { useState, useRef, useEffect } from 'react';

const EmotionSupportBot = () => {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState('');
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);

  const breathingTechnique = `🧘 Technika oddechowa:
1. Usiądź wygodnie.
2. Weź powolny, głęboki wdech przez nos (4 sekundy).
3. Wstrzymaj oddech na 7 sekund.
4. Powoli wypuść powietrze przez usta (8 sekund).
5. Powtórz 3 razy.`;

  const affirmations = [
    'Jestem wystarczająco dobry/dobra.',
    'Każdy dzień jest nową szansą.',
    'Zasługuję na spokój i szczęście.',
    'Wszystko, czego potrzebuję, jest we mnie.',
    'Pokonuję trudności krok po kroku.'
  ];

  const meditation = `🧘‍♂️ Krótka medytacja:
Zamknij oczy, skup się na swoim oddechu.
Poczuj jak powietrze wchodzi i wychodzi.
Pozwól myślom swobodnie przepływać, nie zatrzymuj ich.
Oddychaj spokojnie przez minutę.`;

  const motivationalQuotes = [
    '„Sukces to suma małych wysiłków powtarzanych dzień po dniu.” – Robert Collier',
    '„Nie czekaj. Pora nigdy nie będzie odpowiednia.” – Napoleon Hill',
    '„Najlepszy czas na zasadzenie drzewa był 20 lat temu. Drugi najlepszy czas jest teraz.” – Chińskie przysłowie',
    '„Nigdy nie rezygnuj z celu tylko dlatego, że osiągnięcie go wymaga czasu.” – Nieznany',
    '„To, co robisz dzisiaj, może poprawić wszystkie twoje jutra.” – Ralph Marston'
  ];

  const stretchingExercises = `🤸‍♂️ Proste ćwiczenia rozciągające:
1. Unieś ramiona do góry i rozciągnij się jak najwyżej (5 sekund).
2. Pochyl się powoli do przodu, dotknij palców u stóp (10 sekund).
3. Obróć głowę powoli w prawo i lewo (5 razy).
4. Krążenie ramion do przodu i do tyłu (po 10 razy).
5. Rozluźnij ciało i oddychaj spokojnie.`;

  const getRandom = (list) => list[Math.floor(Math.random() * list.length)];

  // Pierwsza wiadomość powitalna - menu (dodawana tylko raz)
  const welcomeMessage = `Hej! Chcesz poprawić sobie humor? Wybierz coś, co Cię zainteresuje:
1. Technika oddechowa 🧘
2. Pozytywna afirmacja 💬
3. Krótka medytacja 🧘‍♂️
4. Cytat motywacyjny 📜
5. Ćwiczenia rozciągające 🤸‍♂️
Wpisz numer od 1 do 5 lub "koniec", aby zakończyć.`;

  useEffect(() => {
    // Przy pierwszym renderze dodajemy powitalne menu
    setChat([{ from: 'bot', text: welcomeMessage }]);
  }, [welcomeMessage]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => {
        console.log('Autoplay audio zablokowane przez przeglądarkę:', e);
      });
    }
  }, []);

  const handleUserInput = () => {
    const input = userInput.trim().toLowerCase();
    if (!input) return;

   
    setChat(prev => [...prev, { from: 'user', text: userInput }]);

    let botResponse = '';

    switch (input) {
      case '1':
        botResponse = breathingTechnique;
        break;
      case '2':
        botResponse = getRandom(affirmations);
        break;
      case '3':
        botResponse = meditation;
        break;
      case '4':
        botResponse = getRandom(motivationalQuotes);
        break;
      case '5':
        botResponse = stretchingExercises;
        break;
      case 'koniec':
        botResponse = 'Dziękuję, że tu byłeś/aś! Wróć, kiedy tylko chcesz 😊';
        break;
      default:
        botResponse = 'Nie rozumiem, spróbuj jeszcze raz (wpisz 1-5 lub "koniec").';
    }

    setTimeout(() => {
      setChat(prev => [...prev, { from: 'bot', text: botResponse }]);
    }, 300); 

    setUserInput('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="container sad">
      <div className="emotion-support-bot">
        <h2 className="emotion-title">🤖 Bot wsparcia emocjonalnego</h2>
        <div
          className="chat-container"
          ref={chatContainerRef}
          style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '12px', background: '#fafafa', marginBottom: '15px' }}
        >
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.from}`}
              style={{ marginBottom: '10px', whiteSpace: 'pre-line' }}
            >
              <strong>{msg.from === 'user' ? 'Ty' : 'Bot'}:</strong> <br /> {msg.text}
            </div>
          ))}
        </div>

        {/* Jeśli nie wpisano 'koniec', pokazuj input i przycisk */}
        {!chat.some(m => m.from === 'bot' && m.text.includes('Dziękuję')) && (
          <div className="input-row">
            <input
              type="text"
              placeholder='Wpisz 1, 2, 3, 4, 5 lub "koniec"'
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleUserInput();
              }}
              className="input-field"
              onFocus={e => {
                e.target.style.borderColor = '#3a5fcd';
                e.target.style.boxShadow = '0 0 8px 2px rgba(58, 95, 205, 0.5)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#7b61f7';
                e.target.style.boxShadow = '0 2px 8px rgba(123, 97, 247, 0.2)';
              }}
            />
            <button
              onClick={handleUserInput}
              className="send-button"
            >
              Wyślij
            </button>
          </div>
        )}

        <button
          onClick={handleBackToHome}
          className="sad_button">
          Wróć do głównej strony
        </button>

      <audio
          ref={audioRef}
          src="/audio/sad_music.mp3" 
          preload="auto"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default EmotionSupportBot;
