'use client';

import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Keyboard from './keyboard';
import '../globals.css'

var isSynthActive = false;

const play = (fm:any, wasm:any, setTempo:any) => {
  if (fm === null || fm === undefined) {
    fm = new wasm.FmOsc();
    fm.set_note(50);
    fm.set_fm_frequency(0);
    fm.set_fm_amount(0);
    fm.set_gain(0.8);
    setTempo(fm.get_tempo());
    //fm.get_midi_access();

    isSynthActive = true;
    //StartSequence(fm);
    
  } else {
    isSynthActive = false;
    fm.free();
    fm = null;
  }
  return fm;
}

const PlayButton = (props: { setFM: (arg0: any) => void; fm: any; wasm: any; setTempo: any; }) => {
  

  return(
    <div className={props.fm ? "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded w-28 text-center float-center my-4" : "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded w-28 text-center float-center my-4"}>
      <input type="button" value="play" onClick={() => {props.setFM(play(props.fm, props.wasm, props.setTempo))}} />
    </div>
  );
}

const StartSequence = (props:any) => {
  
  var slide = (fm:any) => {
    if (fm) {
      fm.start_sequence();
    }
    return fm;
  }

  return(
    <div>
      <input type="button" value="Start Sequence" onClick={(e) => {props.setFM(slide(props.fm))}} />
    </div>
  );
}

const PrimarySlider = (props:any) => {
  
  var slide = (fm:any, event:any) => {
    if (fm) {
      fm.set_note(parseInt(event.target.value));
    }
    return fm;
  }

  return(
    <div>
      <label>Pitch</label>
      <input className="w-full" type="range" min="1" max="100" defaultValue="50" onChange={(e) => {props.setFM(slide(props.fm, e))}} />
    </div>
  );
}

const PrimaryGain = (props:any) => {
  
  var slide = (fm:any, event:any) => {
    if (fm) {
      fm.set_gain(parseFloat(event.target.value)/100);
    }
    return fm;
  }

  return(
    <div className="">
      <label>Gain</label>
      <input className="w-full" type="range" min="1" max="100" defaultValue="50" onChange={(e) => {props.setFM(slide(props.fm, e))}} />
    </div>
  );
}

const FMFrequency = (props:any) => {
  
  var slide = (fm:any, event:any) => {
    if (fm) {
      fm.set_fm_frequency(parseFloat(event.target.value));
    }
    return fm;
  }

  return(
    <div>
      <label>FM Frequency</label>
      <input className="w-full" type="range" min="1" max="100" defaultValue="50" onChange={(e) => {props.setFM(slide(props.fm, e))}} />
    </div>
  );
}

const FMAmount = (props:any) => {

  var slide = (fm:any, event:any) => {
    if (fm) {
      fm.set_fm_amount(parseFloat(event.target.value));
    }
    return fm;
  }

  return(
    <div>
      <label>FM Amount</label>
      <input className="w-full" type="range" min="1" max="100" defaultValue="50" onChange={(e) => {props.setFM(slide(props.fm, e))}} />
    </div>
  );
}

const LFOAmplitude = (props:any) => {

  var slide = (fm:any, event:any) => {
    if (fm) {
      fm.set_lfo_amplitude(Number(event.target.value/100));
    }
    return fm;
  }

  return(
    <div>
      <label>LFO Amount</label>
      <input className="w-full" type="range" min="1" max="100" defaultValue="50" onChange={(e) => {props.setFM(slide(props.fm, e))}} />
    </div>
  );
}

const LFOFrequency = (props:any) => {

  var slide = (fm:any, event:any) => {
    if (fm) {
      fm.set_lfo_frequency(parseFloat(event.target.value));
    }
    return fm;
  }

  return(
    <div>
      <label>LFO Frequency</label>
      <input className="w-full" type="range" min="1" max="100" defaultValue="50" onChange={(e) => {props.setFM(slide(props.fm, e))}} />
    </div>
  );
}

const SetTempo = (props:any) => {

  var slide = (fm:any, event:any) => {
    if (fm) {
      fm.set_tempo(parseFloat(event.target.value));
    }
    return fm;
  }

  return(
    <div>
      <h3>Tempo:</h3>
      <input className="w-full p-4" type="range" min="1" max="240" defaultValue="0" onChange={(e) => {props.setFM(slide(props.fm, e)); props.setTempo(props.fm.get_tempo())}} />
    </div>
  );
}

const TempoDisplay = (props:any) => {
  return(
    <div>
      <h3>Tempo: {props.tempo}</h3>
    </div>
  );
}

const OscillatorSelect = (props:any) => {

  var oscillatorFnuction:any = () => {

  };
  useEffect(() => {
    if(props.fm) {
      if(props.oscillatorName === "LFO") {
        oscillatorFnuction = () => {
          props.fm.toggle_lfo();
        };
      } else if (props.oscillatorName === "Primary") {
        oscillatorFnuction = () => {
          props.fm.toggle_primary_oscillator();
          console.log(props.fm.get_primary_is_on());
        };
      } else if (props.oscillatorName === "Frequency") {
        /*if(props.fm.get_lfo_is_on()) {
          oscillatorFnuction = () => {
            props.fm.stop_frequency()
          };
        } else {
          oscillatorFnuction = () => {
            props.fm.start_frequency()
          };
        }*/
        oscillatorFnuction = () => {
          props.fm.toggle_frequency_oscillator();
        };
      }
    }
  }, [props.fm]);

  return(
    <div className="bg-slate-900">
      <input className="bg-green-900 text-green-500" name="oscillator_toggle" id={props.oscillatorName} type="checkbox" value={props.oscillatorName} onChange={(e) => {oscillatorFnuction()}} />
    </div>
  );
}

const WaveSelect = (props:any) => {

  var selectWave = (fm:any, event:any, componentName:any) => {
    if (fm) {
      switch(componentName) {
        case "Primary Wave":
          fm.set_primary_oscillator_type(event.target.value);
          break;
        case "FM Wave":
          fm.set_fm_oscillator_type(event.target.value);
          break;
        case "LFO":
          fm.set_lfo_oscillator_type(event.target.value);
          break;
        default:
          return fm;
      }
    }
    return fm;
  }

  return(
    <div className="text-l">
      <h3>{props.componentName}</h3>
      <ul>
        <li><label htmlFor="sine">Sine: </label><input name={"oscillator_type_"+props.componentName} id="sine" type="radio" value="sine" checked onChange={(e) => {selectWave(props.fm, e, props.componentName)}} /></li>
        <li><label htmlFor="triangle">Triangle: </label><input name={"oscillator_type_"+props.componentName} id="triangle" type="radio" value="triangle" onChange={(e) => {selectWave(props.fm, e, props.componentName)}} /></li>
        <li><label htmlFor="sawtooth">Sawtooth: </label><input name={"oscillator_type_"+props.componentName} id="sawtooth" type="radio" value="sawtooth" onChange={(e) => {selectWave(props.fm, e, props.componentName)}} /></li>
        <li><label htmlFor="square">Square: </label><input name={"oscillator_type_"+props.componentName} id="square" type="radio" value="square" onChange={(e) => {selectWave(props.fm, e, props.componentName)}} /></li>
      </ul>
    </div>
  );
}

const FMOscillator = (props:any) => {
  const [name, setName] = useState<string>();
  const [fm, setFM] = useState<any>();
  const [wasm, setWasm] = useState<any>();
  const [sequence, setSequence] = useState(0);
  const [tempo, setTempo] = useState('-');

  useEffect(() => {
    if(wasm != null){
      setName("Synthesizer");
      setFM(play(fm, wasm, setTempo));
    }
  }, [wasm]);

  useEffect(() => {
    loadWasm();
  });

  var loadWasm = async () => {
    try {
      setWasm(await import('wasm_synthesizer'));
    } catch(err: any) {
      console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
    }
  };

  return (
    <div className="text-xl" >
      <h3 className="">Osc!</h3>
      <hr />
      {/*<div className="w-screen flex items-center justify-center">
        <PlayButton fm={fm} setFM={setFM} wasm={wasm} setTempo={setTempo} />
      </div>*/}
      <div className="grid grid-cols-4 w-fit bg-slate-300 text-center">
        <div className="border-2 grid grid-cols-2 m-4" >
          <div className="padding-2">
            <PrimaryGain fm={fm} setFM={setFM} />
            <br />
            <PrimarySlider fm={fm} setFM={setFM} />
            <br />
            <OscillatorSelect fm={fm} oscillatorName={"Primary"} />
          </div>
          <WaveSelect fm={fm} setFM={setFM} componentName={"Primary Wave"}/>
        </div>
        
        <div className="border-2 grid grid-cols-2 m-4" >
          <div className="padding-2">
            <FMFrequency fm={fm} setFM={setFM} />
            <br />
            <FMAmount fm={fm} setFM={setFM} />
            <br />
            <OscillatorSelect fm={fm} oscillatorName={"Frequency"} />
          </div>
          <WaveSelect fm={fm} setFM={setFM} componentName={"FM Wave"}/>
        </div>
        
        <div className="border-2 grid grid-cols-2 m-4" >
          <div className="padding-2">
            <LFOFrequency fm={fm} setFM={setFM} />
            <br />
            <LFOAmplitude fm={fm} setFM={setFM} />
            <br />
            <OscillatorSelect fm={fm} oscillatorName={"LFO"} />
          </div>
          <WaveSelect fm={fm} setFM={setFM} componentName={"LFO"}/>
        </div>
        <div className="m-4">
          <SetTempo fm={fm} setFM={setFM} setTempo={setTempo} />
          <br />
          <TempoDisplay tempo={tempo} />
          <br />
          <input className="border-1 rounded" type="button" value="Sync LFO with tempo" onClick={() => {fm.sync_lfo_with_tempo()}} />
        </div>
        <div className="col-span-4 w-screen flex items-center justify-center">
          <Keyboard name={"hi"} fm={fm} setFM={setFM} wasm={wasm}  />
        </div>
      </div>
      
      
      
    </div>
  );
};

export default FMOscillator;
