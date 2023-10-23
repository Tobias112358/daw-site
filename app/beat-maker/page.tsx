'use client';
import { ST } from 'next/dist/shared/lib/utils';
import React, { useState, useEffect } from 'react';

const Step = (props:any) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
    }, [active]);

    return(
        <div className="h-10 bg-stone-700 w-10 m-2 content-center hover:bg-stone-500" onClick={() => {setActive(!active)}}>
            <div className={`h-2 w-2 m-1 ${active ? "bg-green-500" : "bg-white"}`}/>
        </div>
    )
}

const Kick = (props:any) => {
    var steps = [];

    for (var i = 0; i < 16; i++) {
        steps.push(<Step active={false} key={i} />);
      }
    return(
        <div className="h-14 w-screen flex">
            {steps}
        </div>
    )
}

const StartSequence = (props: any) => {
    return(
        <div>
            <input type="button" className='bg-black w-52 h-48 text-slate-100' value="PLAY" onClick={() => {
                props.setSequenceOn(!props.sequenceOn)
                }} />
        </div>
    )
}



export default function BeatMaker(props:any) {
    
    const [inputs, setInputs] = useState<MIDIInputMap>();
    const [sequenceStep, setSequenceStep] = useState<number>(0);
    const [sequenceOn, setSequenceOn] = useState<boolean>(false);
    const [audioFile, setAudioFile] = useState<any>(new Audio("/Kick.wav"));

    useEffect(() => {
        navigator.requestMIDIAccess().then((access) => {
            setInputs(access.inputs);
        });
    }, []);

    useEffect(() => {
        Sequence();
    }, [sequenceOn]);

    const Sequence = async () => {
        if(sequenceOn) {
            audioFile.play();
            await new Promise(r => setTimeout(r, (30)));
            setSequenceStep(sequenceStep+1)
            Sequence();
        }
    }

    useEffect(() => {
        
      if(inputs != undefined) {
        inputs.forEach((input) => {
            input.onmidimessage = (message) => {
              console.log(message);
            };
          });
      }
    }, [inputs]);


    return(
        <div className="h-screen justify-center content-center text-center pt-32 text-3xl grid grid-flow-row">
            <div>
                hi
            </div>
            <Kick />
            <StartSequence setSequenceOn={setSequenceOn} sequenceOn={sequenceOn} />
        </div>
    );
}