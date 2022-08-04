import SelectMIDIDevice from "./components/SelectMIDIDevice";
import "./App.css";
import Drumbox from "./components/Drumbox";
import {MIDIInputInfo} from "./modules/MidiHandler";
import Launchpad from "./components/Launchpad";
import {useState} from "react";

function App() {

  const [selectedMidiInput, setSelectedMidiInput] = useState<MIDIInputInfo | null>(null);

  const onMIDIInputChange = (input: MIDIInputInfo) => {
    setSelectedMidiInput(input);
  }

  return (
    <div className="App bg-white dark:bg-slate-800 min-h-screen h-full">
      <div className="container mx-auto" >
        <SelectMIDIDevice onMIDIInputChange={onMIDIInputChange}></SelectMIDIDevice>
        <Launchpad selectedMidiInput={selectedMidiInput}></Launchpad>
        <Drumbox></Drumbox>
        </div>
    </div>
  );
}

export default App;
