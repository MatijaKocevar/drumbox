import { useEffect, useState } from "react";
import { MidiHandler, MIDIInputInfo, MIDIMessage } from "../modules/MidiHandler";
import "./Launchpad.css";
import { MidiDebugger } from "./MidiDebugger";

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

  useEffect(() => {
    async function getMidiInput() {
      await midi.init();
      if (selectedMidiInput)
        midi.getMIDIMessage(selectedMidiInput.id, onMidiMessage);
    }

    getMidiInput().catch((e) => null);
  }, [selectedMidiInput]);

  const onMidiMessage = (msg: MIDIMessage) => {
    if (msg.command === 153) {
      if (msg.velocity > 0) {
        setActivePads((prev) => [...prev, `pad-${msg.note}`])
      } else {
        setActivePads((prev) => [ ...prev ].filter(padId => padId != `pad-${msg.note}`))
      }
    }
  };

  const setPadStyles = (padId: string) => {
    const isPadActive = activePads.indexOf(padId) != -1;

    const mainStyles = "pad relative w-16 h-16 m-1.5 bg-neutral-400";
    const activeStyles = "active";

    return isPadActive ? [mainStyles, activeStyles].join(" ") : mainStyles;
  };

  const Pad = (index: number) => (
    <button
      onClick={handleMouseClick}
      className={setPadStyles(`pad-${index}`)}
      id={`pad-${index}`}
      key={`pad-${index}`}
    ></button>
  );

  const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const [padId, padIndex] = getPadDataFromEvent(e);
    const [row, col] = getPadPositionFromId(padId);
    setActivePads((activePads) =>
      padIndex != -1
        ? [...activePads.filter((id) => id != padId)]
        : [...activePads, padId]
    );
  };

  const getPadDataFromEvent = (
    e: React.MouseEvent<HTMLElement>
  ): [string, number] => [
    e.currentTarget.id,
    activePads.indexOf(e.currentTarget.id),
  ];

  const getPadPositionFromId = (padId: string): [number, number] => {
    const padNumber = parseInt(padId.slice(padId.indexOf("-") + 1));
    const row = Math.floor(padNumber / width);
    const col = padNumber % height;

    return [row, col];
  };

  return (
    <div className="flex flex-justify">
      <div className="launchpad w-max h-max p-7 mt-3 bg-black">
        {[...Array(height)].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="flex">
              {[...Array(width)].map((col, colIndex) =>
                Pad(rowIndex * width + colIndex)
              )}
            </div>
          );
        })}
      </div>
      <MidiDebugger selectedMidiInput={selectedMidiInput}></MidiDebugger>
    </div>
  );
};

export default Launchpad;
