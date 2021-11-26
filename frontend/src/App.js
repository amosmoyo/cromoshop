import { useState, useEffect } from "react";

function App() {
  const [color, setColor] = useState("red");
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCount((count) => count + 1);
  //   }, 1000);
  // });

  return (
    <div className="App">
      <h2>Hello world</h2>
      <h1>My favorite color is {color}!</h1>
      <button
        type="button"
        onClick={() => setColor("blue")}
      >Blue {count} </button>
    </div>
  );
}

export default App;
