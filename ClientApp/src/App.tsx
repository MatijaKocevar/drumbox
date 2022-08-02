import SelectMIDIDevice from "./components/SelectMIDIDevice";
import "./App.css";
import Drumbox from "./components/Drumbox";
import {} from "./modules/MidiHandler";
import Launchpad from "./components/Launchpad";

function App() {
  return (
    <div className="App bg-white dark:bg-slate-800 min-h-screen h-full">
      <Launchpad></Launchpad>
    </div>
  );
}

export default App;
