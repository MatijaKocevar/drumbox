import { BaseSyntheticEvent, useEffect, useState } from "react";

const SelectMIDIDevice = () => {
  const [inputs, setInputs] = useState<WebMidi.MIDIInput[]>();
  const [selectedInput, setSelectedInput] = useState<string>();

  useEffect(() => {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

    function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
      midiAccess.onstatechange = (e: any) => {
        console.log("Some device connected!: ", e);
      };

      setInputs(Array.from(midiAccess.inputs.values()));
    }

    function onMIDIFailure() {
      console.log("Could not access your MIDI devices.");
    }
  }, []);

  useEffect(() => {
    // if (inputs) console.log(inputs);
    if (selectedInput) console.log(selectedInput);
  }, [inputs, selectedInput]);

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
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        defaultValue={"default"}
        onChange={(e: BaseSyntheticEvent) => {
          setSelectedInput(e.currentTarget.value);
        }}
      >
        <>
          <option disabled hidden value={"default"}>
            Select an input
          </option>
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
