// Import necessary modules and libraries
import { useState, useRef, useEffect } from "react"; // React hooks to manage component state, references, and side effects
import { nanoid } from "nanoid"; // Generates unique IDs, useful for React keys and tracking dice uniquely
import Confetti from "react-confetti"; // A React component that displays a celebratory confetti animation
import Die from "./Die"; // Importing the custom Die component (represents a single die)

const App = () => {
  // Create state to store an array of 10 dice
  // Each die is an object with a value (1–6), a held status (boolean), and a unique ID
  // We're using a function to initialize useState so that dice are only generated once on initial render
  const [dice, setDice] = useState(() => generateAllNewDice());

  // useRef creates a persistent reference to the Roll/New Game button in the DOM
  // Useful for focusing the button when the game is won
  const buttonRef = useRef(null);

  // Determine if the game has been won:
  // 1. All dice must be held
  // 2. All dice must have the same value
  // We use array.every() to check both conditions
  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  // useEffect runs side effects after rendering
  // Here, we use it to focus the button when the game is won (improves accessibility)
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus(); // .current points to the DOM node
    }
  }, [gameWon]); // Only runs when gameWon changes

  // Generates a fresh array of 10 dice
  // Each die has a random value from 1 to 6, is initially not held, and has a unique ID
  function generateAllNewDice() {
    return new Array(10)
      .fill(0) // Create an array of 10 elements with dummy values
      .map(() => ({
        value: Math.ceil(Math.random() * 6), // Random number between 1 and 6
        isHeld: false,
        id: nanoid(), // Generate a unique ID for each die
      }));
  }

  // Main logic for rolling dice or resetting the game
  // If the game isn't won, re-roll all unheld dice
  // If the game is won, reset the game with new dice
  function rollDice() {
    if (!gameWon) {
      // Update only unheld dice; held dice stay the same
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      setDice(generateAllNewDice()); // Start a new game
    }
  }

  // Called when a die is clicked
  // Toggles the `isHeld` property of the die with the matching ID
  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  // Create an array of Die components by mapping over the dice state array
  // Each die receives props for rendering and interactivity
  const diceElements = dice.map((dieObj) => (
    <Die
      key={dieObj.id} // Helps React track list items efficiently
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={hold}
      id={dieObj.id}
    />
  ));

  // The return block defines the visual structure of the component using JSX
  // Shows game title, optional confetti, screen-reader win message, dice, and button
  return (
    <main>
      <h1>Tenzies</h1>

      {/* Show confetti when the game is won */}
      {gameWon && <Confetti />}

      {/* Screen reader-only win message for accessibility */}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You Won! Press "New Game" to start again.</p>
        )}
      </div>

      {/* Render all 10 dice */}
      <div className="dice-container">{diceElements}</div>

      {/* Button that rolls dice or starts new game based on game state */}
      <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
};

// Export the App component so it can be used in index.js
export default App;
