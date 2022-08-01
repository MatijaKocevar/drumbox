import { useState } from 'react'
import  SelectMIDIDevice  from './components/SelectMIDIDevice';
import './App.css'

function App() {
  const [count, setCount] = useState(0)


  if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
} else {
    console.log('WebMIDI is not supported in this browser.');
}



navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);

    midiAccess.onstatechange = (e) => {

      console.log('Some deivce connected!: ', e);
    }

    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;


    inputs = [ ...inputs.values() ]

    console.log(inputs[1])

 //   inputs[1].onmidimessage = (m) => console.log('Recevied midi message: ', m.data)


  
    console.log("inputs: ", inputs);
    console.log("outputs: ", outputs);


}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

  return (
    <div className="App">
      <SelectMIDIDevice></SelectMIDIDevice>

    </div>
  )
}

export default App
