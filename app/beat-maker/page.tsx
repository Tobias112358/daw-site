'use client';
import { ST } from 'next/dist/shared/lib/utils';
import React, { useState, useEffect, useRef, forwardRef, createRef } from 'react';
import MixedAudio from './mixedAudio'


const Step = forwardRef<any, any>((props, ref) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        props.updateStepArray(props.stepID, active);
    }, [active]);

    const handleClick = () => {
        setActive(!active)
    }

    return(
        <div ref={ref} className="h-10 bg-stone-700 w-10 m-2 content-center hover:bg-stone-500" onClick={handleClick}>
            <div className={`h-2 w-2 m-1 ${active ? "bg-green-500" : "bg-white"}`}/>
        </div>
    )
})

const BeatTrack = (props:any) => {
    var steps = [];
    //var stepRefs: React.RefObject<any>[] = [];
    const [stepArray, setStepArray] = useState<any>([]);

    const updateStepArray = (i:number, isActive:boolean) => {
        var currentStepArray = props.stepArray;
        currentStepArray[i] = isActive;
        props.setStepArray(currentStepArray);
    }

    for (var i = 0; i < 16; i++) {
        let rootRef = createRef<any>();

        steps.push(<Step ref={rootRef} active={false} stepID={i} key={i} updateStepArray={updateStepArray} />);
        
        //updateStepArray(i, false);
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
    const [kickStepArray, setkickStepArray] = useState<boolean[]>([]);
    const [snareStepArray, setSnareStepArray] = useState<boolean[]>([]);

    const KickStateRef = createRef<any>(); 

    useEffect(() => {
        navigator.requestMIDIAccess().then((access) => {
            setInputs(access.inputs);
        });
    }, []);

    useEffect(() => {
        Sequence();
    }, [sequenceOn, sequenceStep]);

    useEffect(() => {
        console.log(kickStepArray);
    }, [kickStepArray]);

    const Sequence = async () => {
        if(sequenceOn) {
            var audioArray = [];
            if(kickStepArray[sequenceStep]) {
                //audioFile.play();
                audioArray.push("/Kick.wav")
            }
            if(snareStepArray[sequenceStep]) {
                //audioFile.play();
                audioArray.push("/Snare.wav")
            }

            MixedAudio(audioArray);

            await new Promise(r => setTimeout(r, (100)));
            //document.getElementById(""+ sequenceStep+1)
            setSequenceStep((sequenceStep+1)%16)
            
            //Sequence();
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
            <BeatTrack setStepArray={setkickStepArray} stepArray={kickStepArray} />
            <BeatTrack setStepArray={setSnareStepArray} stepArray={snareStepArray} />
            <StartSequence setSequenceOn={setSequenceOn} sequenceOn={sequenceOn} />
        </div>
    );
}