import React from "react";
import "./App.css";
import Video from "./Video";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Video  width={200} height={150} title="Test" id="test" />
      </header>
    </div>
  );
}

export default App;
