'use client';
import { ST } from 'next/dist/shared/lib/utils';
import React, { useState, useEffect, useRef, forwardRef, createRef } from 'react';
import MixedAudio from './mixedAudio'


const Step = (props:any) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        props.updateStepArray(props.stepID, active);
    }, [active]);

    const handleClick = () => {
        setActive(!active)
    }

    return(
        <div className="h-10 bg-stone-700 w-10 m-2 content-center hover:bg-stone-500" onClick={handleClick}>
            <div className={`h-2 w-2 m-1 ${active ? "bg-green-500" : "bg-white"}`}/>
        </div>
    )
}

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

        steps.push(<Step active={false} stepID={i} key={i} updateStepArray={updateStepArray} />);
        
        //updateStepArray(i, false);
      }



    return(
        <div className="h-14 w-screen flex">
            {steps}
        </div>
    )
}

const TempoControl = (props: any) => {
    return(
        <div>
            <label>Tempo: ~{props.tempo}</label>
            <input type="range" className='bg-black w-52 h-48 text-slate-100' min="60" max="180" onChange={(e) => {
                props.setTempo(e.target.value);
                }} />
        </div>
    )
}

const StartSequence = (props: any) => {
    return(
        <div>
            <input type="button" className='bg-black w-52 h-48 text-slate-100' value="PLAY" onClick={async () => {

                const myAudioContext = new AudioContext();
                await myAudioContext.audioWorklet.addModule("/worklets/recorder.worklet.js")
                props.setAudioContext(myAudioContext);
                }} />
        </div>
    )
}



export default function BeatMaker(props:any) {
    
    const [inputs, setInputs] = useState<MIDIInputMap>();
    const [sequenceStep, setSequenceStep] = useState<number>(0);
    const [sequenceOn, setSequenceOn] = useState<boolean>(false);
    const [kickStepArray, setkickStepArray] = useState<boolean[]>([]);
    const [snareStepArray, setSnareStepArray] = useState<boolean[]>([]);
    const [hiHatStepArray, setHiHatStepArray] = useState<boolean[]>([]);
    const [tomStepArray, setTomStepArray] = useState<boolean[]>([]);
    const [currentAudioNode, setCurrentAudioNode] = useState<AudioWorkletNode>();
    const [audioContext, setAudioContext] = useState<AudioContext>();
    const [count, setCount] = useState<number>(0);
    const [tempo, setTempo] = useState<number>(120);


    const KickStateRef = createRef<any>(); 

    useEffect(() => {
        navigator.requestMIDIAccess().then((access) => {
            setInputs(access.inputs);
        });

    }, []);
    useEffect(() => {
        if(audioContext != undefined)
            setSequenceOn(!sequenceOn)
    }, [audioContext]);

    useEffect(() => {
        Sequence();
    }, [sequenceOn, sequenceStep]);

    useEffect(() => {
        console.log(kickStepArray);
    }, [kickStepArray]);


    useEffect(() => {
        console.log(currentAudioNode);
        if(currentAudioNode != undefined) {
            currentAudioNode.port.onmessage = (e:any) => {
                if(e.data.type == "WORKLET_ENDED"){
                    currentAudioNode.disconnect();
                    setSequenceStep((sequenceStep+1)%16);
                }
            }
        }
    }, [currentAudioNode]);

    const Sequence = async () => {
        if(sequenceOn) {
            var audioArray = [];
            if(kickStepArray[sequenceStep]) {
                //audioFile.play();
                audioArray.push("./Kick.wav")
            }
            if(snareStepArray[sequenceStep]) {
                //audioFile.play();
                audioArray.push("./Snare.wav")
            }
            if(hiHatStepArray[sequenceStep]) {
                //audioFile.play();
                audioArray.push("./HiHat.wav")
            }
            if(tomStepArray[sequenceStep]) {
                //audioFile.play();
                audioArray.push("./Tom.wav")
            }
            if(audioContext != undefined)
                MixedAudio(audioArray, setCurrentAudioNode, audioContext, tempo);
                
            console.log(count);
            setCount(count + 1)
            //await new Promise(r => setTimeout(r, (100)));
            

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

    /*const generalClick = (async () => {

        const audioContext = new AudioContext();
        console.log(audioContext.sampleRate);
        console.log(audioContext);
        await audioContext.audioWorklet.addModule("/worklets/recorder.worklet.js")


        var snareFile = await fetch("/Snare.wav");
        var snareBuffer = await snareFile.arrayBuffer();
        var decodedSnare = await audioContext.decodeAudioData(snareBuffer);
        const snareArray = new Float32Array(decodedSnare.length);
        decodedSnare.copyFromChannel(snareArray, 0, 0);

        var kickFile = await fetch("/Kick.wav");
        var kickBuffer = await kickFile.arrayBuffer();
        var decodedKick = await audioContext.decodeAudioData(kickBuffer);
        const kickArray = new Float32Array(decodedKick.length);
        decodedKick.copyFromChannel(kickArray, 0, 0);

        var tomFile = await fetch("/Tom.wav");
        var tomBuffer = await tomFile.arrayBuffer();
        var decodedTom = await audioContext.decodeAudioData(tomBuffer);
        const tomArray = new Float32Array(decodedTom.length);
        decodedTom.copyFromChannel(tomArray, 0, 0);

        var hiHatFile = await fetch("/HiHat.wav");
        var hiHatBuffer = await hiHatFile.arrayBuffer();
        var decodedHiHat = await audioContext.decodeAudioData(hiHatBuffer);
        const hiHatArray = new Float32Array(decodedHiHat.length);
        decodedHiHat.copyFromChannel(hiHatArray, 0, 0);


        
        const testNode = new window.AudioWorkletNode(audioContext, "recorder.worklet", {
            processorOptions: {
                someUsefulVariable: new Map<any, any>([
                    [1, "one"]
                ]),
                audioBuffers: [tomArray, hiHatArray, kickArray, snareArray]
            },
            outputChannelCount : [2]
    
        });

        if(testNode != null) {
            testNode.onprocessorerror = (e:any) => {
                console.log("HERE");
            };
        }
        
        setInterval(() => testNode.port.postMessage("ping"), 1000);
        
        testNode.port.onmessage = (e:any) => {
            if(e.data.type == "WORKLET_ENDED") {
                testNode.disconnect();
                setSequenceStep((sequenceStep+1)%16);
            }
        }

        testNode.connect(audioContext.destination);
    });*/


    return(
        <div className="h-screen justify-center content-center text-center pt-32 text-3xl grid grid-flow-row">
            <div>
                hi
            </div>
            <TempoControl setTempo={setTempo} tempo={tempo} />
            <BeatTrack setStepArray={setkickStepArray} stepArray={kickStepArray} />
            <BeatTrack setStepArray={setSnareStepArray} stepArray={snareStepArray} />
            <BeatTrack setStepArray={setHiHatStepArray} stepArray={hiHatStepArray} />
            <BeatTrack setStepArray={setTomStepArray} stepArray={tomStepArray} />
            <StartSequence setSequenceOn={setSequenceOn} sequenceOn={sequenceOn} setAudioContext={setAudioContext} />
            {/*
            <input type="button" value="CLICKHERE" onClick={generalClick} />
            */}
        </div>
    );
}