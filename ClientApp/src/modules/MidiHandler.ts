function onMIDIFailure() {
  console.log("Error: Could not access MIDI devices.");
}
function getMIDIMessage(message: WebMidi.MIDIMessageEvent) {}

function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
  var inputs = midiAccess.inputs;
  var outputs = midiAccess.outputs;

  // Attach MIDI event "listeners" to each input
  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

export class MidiHandler {
  inputIds: number[];

  constructor(_inputIds: number[]) {
    this.inputIds = _inputIds;
  }

  _getMIDIMessage() {
    if (navigator.requestMIDIAccess) {
      console.log("This browser supports WebMIDI!");

      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log("WebMIDI is not supported in this browser.");
    }

    function onMIDIFailure() {
      console.log("Error: Could not access MIDI devices.");
    }

    function getMIDIMessage(message: WebMidi.MIDIMessageEvent) {
      var command = message.data[0];
      var note = message.data[1];
      var velocity = message.data.length > 2 ? message.data[2] : 0; //
    }

    function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
      // Attach MIDI event "listeners" to each input
      for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
      }
    }
  }
}

let test = new MidiHandler([1, 2, 3]);
