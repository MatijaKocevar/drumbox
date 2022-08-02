import {Subject} from "rxjs";
import scale from "./scale.json";

export class Sequencer {
  audioCtx: AudioContext;

  oscilatorNodes: { oscNode: OscillatorNode; gainNode: GainNode }[];
  destination: AudioDestinationNode;

  currentBeat = 0;
  nextBeatTime = 0.0;
  tempo = 80.0;
  scheduleAheadTime = 0.1;
  lookahead = 250.0;
  beatsQueue: Array<{ beat: number; time: number }> = [];
  timeoutId: number | undefined = undefined;
//  beatsSubject$: Subject<number>;

  sequenceMap: Array<boolean[]> = [];

  constructor() {
    this.audioCtx = new AudioContext();
    this.destination = this.audioCtx.destination;

    this.oscilatorNodes = this.createOscilators();

//    this.beatsSubject$ = new Subject<number>();
  }

  updateSequenceMap(sequenceMap: Array<boolean[]>) {
    console.log('sequence: ', sequenceMap);
    this.sequenceMap = sequenceMap;
  }

  createOscilators() {
    const idx = scale.findIndex((note) => note.name == "C5");
    const selected_octave = scale.slice(idx, idx + 12);

    const oscilators: { oscNode: OscillatorNode; gainNode: GainNode }[] = [];

    for (const note of selected_octave) {
      const gainNode = this.audioCtx.createGain();
      gainNode.connect(this.destination);
      gainNode.gain.value = 0;

      const oscNode = this.audioCtx.createOscillator();
      oscNode.connect(gainNode);
      oscNode.type = "sawtooth";
      oscNode.frequency.value = note.freq;
      oscNode.detune.value = 110;
      oscNode.start();
      oscilators.push({ oscNode , gainNode });
    }

    return oscilators;
  }

  nextBeat() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextBeatTime += secondsPerBeat;

    this.currentBeat = (this.currentBeat + 1) % 12;
  }

  scheduleBeat(beatNumber: number, time: number) {
    this.beatsQueue.push({ beat: beatNumber, time });

    for (let [key, note] of this.sequenceMap[beatNumber].entries()) {
      if (note) {
        const smoothingInterval = 0.02;
        const noteLength = 0.5;
        this.oscilatorNodes[key].gainNode.gain.setTargetAtTime(0.5, time, smoothingInterval);
        this.oscilatorNodes[key].gainNode.gain.setTargetAtTime(0, time + noteLength, smoothingInterval);
      }
    }
  }

  start() {
    this.nextBeatTime = this.audioCtx.currentTime;
    console.log('STARTING: ', this.nextBeatTime, this.audioCtx.currentTime)
    this.audioCtx.resume();
    this.scheduler();
  }

  stop() {
    clearTimeout(this.timeoutId);
  }

  scheduler() {
    console.log(
      this.nextBeatTime,
      this.audioCtx.currentTime + this.scheduleAheadTime
    );
    console.log(
      this.nextBeatTime <
      (this.audioCtx.currentTime + this.scheduleAheadTime)
    );
    while (
      this.nextBeatTime <
      (this.audioCtx.currentTime + this.scheduleAheadTime)
    ) {
      console.log('Should run next beat')
      this.scheduleBeat(this.currentBeat, this.nextBeatTime);
      this.nextBeat();
    }

    this.timeoutId = setTimeout(() => this.scheduler(), this.lookahead);
  }
}
