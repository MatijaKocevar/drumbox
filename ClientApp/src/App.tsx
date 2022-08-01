import { useState } from "react";
import SelectMIDIDevice from "./components/SelectMIDIDevice";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SelectMIDIDevice></SelectMIDIDevice>
    </div>
  );
}

export default App;
