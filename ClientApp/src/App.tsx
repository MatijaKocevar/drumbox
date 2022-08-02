import SelectMIDIDevice from "./components/SelectMIDIDevice";
import "./App.css";
import Drumbox from "./components/Drumbox";

function App() {
  return (
    <div className="App bg-white dark:bg-slate-800 h-screen">
      <SelectMIDIDevice></SelectMIDIDevice>
      <Drumbox></Drumbox>
    </div>
  );
}

export default App;
