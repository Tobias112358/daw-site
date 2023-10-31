import { useState, useRef } from "react";
import MixedAudio from './mixedAudio'

const AudioRecorder = () => {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData:any = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err:any) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };
    return (
        <div>
            <h2>Audio Recorder</h2>
            <main>
                <div className="audio-controls grid grid-cols-1">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} type="button">
                            Get Microphone
                        </button>
                    ): null}wait
                    {permission ? (
                        <button type="button">
                            Record
                        </button>
                    ): null}
                </div>
            </main>
        </div>
    );
};
export default AudioRecorder;
