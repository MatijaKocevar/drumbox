export type MIDIInputInfo = Pick<WebMidi.MIDIInput, "id" | "name">;
export interface MIDIMessage {
  command: number;
  note: number;
  velocity: number;
  timestamp: number;
  messageCount: number;
}

export class MidiHandler {
  isWebMidiAvailable: boolean;
  webMidi: WebMidi.MIDIAccess | null;

  constructor() {
    this.isWebMidiAvailable = "requestMIDIAccess" in navigator;
    this.webMidi = null;
  }

  async init(): Promise<string> {
    if (!this.isWebMidiAvailable) throw new Error("Browser not compatible!");
    try {
      this.webMidi = await navigator.requestMIDIAccess();
      return "WebMidi API initialised"
    } catch (err) {
      console.log("requestMIDIAccess ERROR: ", err);
      throw err;
    }
  }

  getInputList(): MIDIInputInfo[] {
    if (!this.webMidi) throw new Error("MIDIAccess not initialised!");
      const inputs = Array.from(this.webMidi.inputs.values());
      return inputs.map(input => ({ id: input.id, name: input.name }))
  }

  getMIDIMessage(inputId: string, callback: (msg: MIDIMessage) => void) {
    if (!this.webMidi) throw new Error('MIDIAccess not initialised!')

    const input = this.webMidi.inputs.get(inputId);
    if (!input) throw new Error('Selected input not found!')

    let messageCount = 0;

    function getMIDIMessage(message: WebMidi.MIDIMessageEvent) {
      var command = message.data[0];
      if (command == 248) return;
      var note = message.data[1];
      var velocity = message.data.length > 2 ? message.data[2] : 0;
      messageCount += 1;
  
      let msg = { command, note, velocity, timestamp: message.timeStamp, messageCount};
      callback(msg)
    }

    input.onmidimessage = getMIDIMessage;
  }
}

