'use client';
import React, { useState, useEffect } from 'react';
import AudioRecorder from './audioRecorder';


export default function AudioInput(props:any) {
    
    const [rec, setRec] = useState<any>();
    const [audioChunks, setAudioChunks] = useState<any>();

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({audio:true})
        .then((mediaDevices) =>  setRec(new MediaRecorder(mediaDevices)));
    }, []);

    useEffect(() => {
        if(rec === undefined) return;
        rec.ondataavailable = (e:any) => {
            setAudioChunks(/*audioChunks + */e.data);
        }
    }, [rec]);

    useEffect(() => {
        if (rec != undefined && rec.state == "inactive") {
            let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
            (document.getElementById("recordedAudio") as HTMLFormElement).src = URL.createObjectURL(blob);
            (document.getElementById("recordedAudio") as HTMLFormElement).controls=true;
            (document.getElementById("recordedAudio") as HTMLFormElement).autoplay=true;
            sendData(blob)
        }
    }, [audioChunks]);

    function sendData(data:any) {}


    return(
        <div className="h-screen justify-center content-center text-center pt-32 text-3xl grid grid-flow-row">
            <div>
                Hello
            </div>
            <div onClick={() => {

                setAudioChunks([]);
                rec.start();
            }}>
                Start
            </div>
            <div onClick={() => {
                rec.stop();
            }}>
                Stop
            </div>
            <div>
                <audio id="recordedAudio"></audio>
            </div>
        </div>
    );
}