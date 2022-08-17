import { useEffect, useRef, useState } from "react";
import { MidiHandler, MIDIInputInfo, MIDIMessage } from "../modules/MidiHandler";
import "./Launchpad.css";
import { MidiDebugger } from "./MidiDebugger";
import LpMIniMK3 from "../templates/LPMiniMK3.json";

const midi = new MidiHandler();

const Launchpad = ({
  width = 9,
  height = 9,
  selectedMidiInput,
}: {
  width?: number;
  height?: number;
  selectedMidiInput: MIDIInputInfo | null;
}) => {
  const [activePads, setActivePads] = useState<string[]>([]);
  const padActiveStyle = "dark:bg-green-600 hover:bg-green-400";

  const prevRef = useRef<string>();

  useEffect(() => {
    async function getMidiInput() {
      await midi.init();
      if (selectedMidiInput) {
        midi.getMIDIMessage(selectedMidiInput.id, onMidiMessage);

        if (prevRef.current) midi.destroy(prevRef.current);
        prevRef.current = selectedMidiInput.id;
      }
    }

    getMidiInput().catch((e) => null);
  }, [selectedMidiInput]);

  const onMidiMessage = (msg: MIDIMessage) => {
    if (msg.command === 144 || msg.command === 128) {
      if (msg.velocity > 0) {
        setActivePads((prev) => [...prev, `pad-${msg.note}`]);
      } else {
        setActivePads((prev) => [...prev].filter((padId) => padId != `pad-${msg.note}`));
      }
    }
  };

  const setPadStyles = (padId: string) => {
    const isPadActive = activePads.indexOf(padId) != -1;

    const mainStyles = "pad relative w-16 h-16 m-1.5 bg-neutral-400";
    const activeStyles = "active";

    return isPadActive ? [mainStyles, activeStyles].join(" ") : mainStyles;
  };

  const Pad = (index: number) => {
    return (
      <button
        onClick={handleMouseClick}
        className={setPadStyles(`pad-${index}`)}
        id={`pad-${index}`}
        key={`pad-${index}`}
        name={`${index}`}
      ></button>
    );
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const [padId, padIndex, noteCode] = getPadDataFromEvent(e);
    const [row, col] = getPadPositionFromId(padId);
    setActivePads((activePads) =>
      padIndex != -1 ? [...activePads.filter((id) => id != padId)] : [...activePads, padId]
    );

    // let test = midi.getOutputList();
    if (midi.webMidi) {
      midi.sendMiddleC(midi.webMidi, "output-3", noteCode);
      midi.getOutputList();
      debugger;
    }
  };

  const getPadDataFromEvent = (
    e: React.MouseEvent<HTMLElement>
  ): [string, number, string | null] => {
    let tempEl = e.currentTarget as HTMLElement;
    let noteCode = tempEl.getAttribute("name");
    return [tempEl.id, activePads.indexOf(tempEl.id), noteCode];
  };

  const getPadPositionFromId = (padId: string): [number, number] => {
    const padNumber = parseInt(padId.slice(padId.indexOf("-") + 1));
    const row = Math.floor(padNumber / width);
    const col = padNumber % height;

    return [row, col];
  };

  return (
    <div className="flex flex-justify">
      <div className="launchpad">
        {[...Array(height)].map((row, rowIndex) => {
          return (
            selectedMidiInput && (
              <div key={rowIndex + selectedMidiInput.id} className="flex">
                {[...Array(width)].map((col, colIndex) => {
                  let note = LpMIniMK3.filter((note) => {
                    if (note.position.x == colIndex && note.position.y == rowIndex) {
                      return note;
                    }
                  });
                  if (note.length) {
                    return Pad(note[0].noteCode);
                  }
                })}
              </div>
            )
          );
        })}
      </div>
      <MidiDebugger selectedMidiInput={selectedMidiInput}></MidiDebugger>
    </div>
  );
};

export default Launchpad;
