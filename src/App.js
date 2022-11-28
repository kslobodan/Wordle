import { useEffect, useState } from "react";
import "./App.css";
import wordList from "./words.json";

function App() {
  const [words, setWords] = useState([]);
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const WORD_LENGTH = 5;

  useEffect(() => {
    setWords(wordList);
  }, []);

  useEffect(() => {
    console.log(Math.floor(Math.random() * words.length));
    setSolution(words[Math.floor(Math.random() * words.length)]);
  }, [words]);

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) return;

      if (event.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }

        const exists =
          words.filter((w) => w.toUpperCase() === currentGuess.toUpperCase())
            .length > 0;
        console.log("current guess: ", currentGuess);
        console.log(
          "words filtered: ",
          words.filter((w) => w === currentGuess)
        );

        if (!exists) {
          alert("Word  not valid");
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");

        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
        }
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }
      if (currentGuess.length >= 5) {
        return;
      }

      const isLetter = event.key.match(/^[a-z]{1}$/) != null;
      if (isLetter) {
        setCurrentGuess((currentGuess) => currentGuess + event.key);
      }
    };

    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution, guesses, words]);

  return (
    <div className="board">
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex((val) => val == null);
        return (
          <Line
            key={i}
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
            isFinal={!isCurrentGuess && guess != null}
            solution={solution}
          />
        );
      })}
    </div>
  );

  function Line({ guess, isFinal, solution }) {
    const tiles = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
      const char = guess[i];
      let className = "tile";

      if (isFinal) {
        if (char === solution[i]) {
          className += " correct";
        } else if (solution.includes(char)) {
          className += " close";
        } else {
          className += " incorrect";
        }
      }

      tiles.push(
        <div key={i} className={className}>
          {char}
        </div>
      );
    }
    return <div className="line">{tiles}</div>;
  }
}

export default App;
