'use client';
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

export default function BeatMaker(props:any) {
    
    const [inputs, setInputs] = useState<MIDIInputMap>();

    useEffect(() => {
        navigator.requestMIDIAccess().then((access) => {
            setInputs(access.inputs);
        });
    }, []);

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
            <br />
            <Kick />
            <br />
            <Kick />
            <br />
            <Kick />
        </div>
    );
}