// Die component represents one individual die
// It receives props from App to determine how to display and behave
export default function Die(props) {
  // Define a style object to dynamically set background color
  // If the die is held, show a green background; otherwise, white
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  // Return a styled <button> element
  // - style: passed from the styles object for visual feedback
  // - onClick: when clicked, calls the `hold` function with this die’s id
  // - aria-pressed: communicates held state to screen readers
  // - aria-label: descriptive label for assistive tech users
  // - content: displays the die’s numeric value
  return (
    <button
      style={styles}
      onClick={() => props.hold(props.id)} // Call hold handler with die's id
      aria-pressed={props.isHeld} // Boolean for accessibility toggles
      aria-label={`Die with value ${props.value}, ${
        props.isHeld ? "held" : "not held"
      }`}
    >
      {props.value}
    </button>
  );
}
