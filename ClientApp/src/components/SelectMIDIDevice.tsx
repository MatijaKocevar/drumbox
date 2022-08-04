import { BaseSyntheticEvent, useEffect, useState } from "react";
import { MidiHandler, MIDIInputInfo } from "../modules/MidiHandler";

const SelectMIDIDevice = ({
  onMIDIInputChange,
}: {
  onMIDIInputChange: (input: MIDIInputInfo) => void;
}) => {
  const [inputs, setInputs] = useState<MIDIInputInfo[]>([]);
  const [isWebMidiAvailable, setIsWebMidiAvailable] = useState<boolean>(false);

  useEffect(() => {
    async function getMIDIInputs() {
      const midi = new MidiHandler();
      await midi.init();
      setIsWebMidiAvailable(true);
      const inputs = midi.getInputList();
      setInputs(inputs);
    }

    getMIDIInputs().catch((err) => setIsWebMidiAvailable(false));
  }, []);

  return (
    <>
      <label
        htmlFor="inputs"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
      >
        Select an option
      </label>
      <select
        id="inputs"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ing-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        defaultValue={"default"}
        onChange={(e: BaseSyntheticEvent) => {
          let input = inputs.find(i => i.id == e.currentTarget.value)
          if (input) onMIDIInputChange(input)
        }}
      >
        <>
          <option disabled hidden value={"default"}>
            Select an input
          </option>
          {!isWebMidiAvailable && (
            <option> MIDI API not avaliable on this device</option>
          )}
          {inputs?.length &&
            inputs.map((input) => {
              return (
                <option key={input.id} value={input.id}>
                  {input.name}
                </option>
              );
            })}
        </>
      </select>
    </>
  );
};

export default SelectMIDIDevice;
