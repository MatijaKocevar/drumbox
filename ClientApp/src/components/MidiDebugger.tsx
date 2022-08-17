import { useEffect, useState } from "react";
import { MidiHandler, MIDIInputInfo, MIDIMessage } from "../modules/MidiHandler";
import { Card } from "./shared/Card";

const midi = new MidiHandler();

export const MidiDebugger = ({
  selectedMidiInput,
}: {
  selectedMidiInput: MIDIInputInfo | null;
}) => {
  const [messages, setMessages] = useState<MIDIMessage[]>([]);

  useEffect(() => {
    async function getMidiInput() {
      await midi.init();
      if (selectedMidiInput) midi.getMIDIMessage(selectedMidiInput.id, onMidiMessage);
    }

    getMidiInput().catch((e) => null);

    return () => {
      if (selectedMidiInput) {
        midi.destroy(selectedMidiInput.id);
        setMessages([]);
      }
    };
  }, [selectedMidiInput]);

  const renderMessages = () =>
    messages.map((msg) => {
      return (
        selectedMidiInput && (
          <li key={msg.messageCount + selectedMidiInput.id}>
            <span className="mr-5">cmd: {msg.command}</span>
            <span className="mr-5">note: {msg.note}</span>
            <span className="mr-5">velocity: {msg.velocity}</span>
          </li>
        )
      );
    });

  const onMidiMessage = (msg: MIDIMessage) => {
    if (msg.command == 248) return;

    setMessages((prevMessages) => {
      const prev = [...prevMessages];
      if (prev.length >= 30) {
        prev.shift();
      }

      return [...prev, msg];
    });
  };

  return (
    <Card className="ml-5 flex flex-col w-full">
      <p className="text-xl">MIDI Debugger</p>
      <p>Device name: {selectedMidiInput?.name}</p>
      <p>Device id: {selectedMidiInput?.id}</p>
      <ul className="bg-slate-800 my-3 p-2 h-full">{renderMessages()}</ul>
    </Card>
  );
};
