const MixedAudio = async (sources:string[], setCurrentAudioNode:any, audioContext:AudioContext, tempo:number) => {

  
        console.log(audioContext.currentTime);

        var sourceArrays: Float32Array[] = [];
        await Promise.all(sources.map(async (source:string) => {
          var snareFile = await fetch(source);
          var snareBuffer = await snareFile.arrayBuffer();
          var decodedSnare = await audioContext.decodeAudioData(snareBuffer);
          const snareArray = new Float32Array(decodedSnare.length);
          decodedSnare.copyFromChannel(snareArray, 0, 0);
          sourceArrays.push(snareArray);
        }));
        



        const testNode = new window.AudioWorkletNode(audioContext, "recorder.worklet", {
            processorOptions: {
                someUsefulVariable: new Map<any, any>([
                    [1, "one"]
                ]),
                audioBuffers: sourceArrays,
                tempo: tempo,
                startTime: audioContext.currentTime
            },
            outputChannelCount : [2]
    
        });



        if(testNode != null) {
            testNode.onprocessorerror = (e:any) => {
                console.log(e);
            };
        }

        testNode.connect(audioContext.destination);

        setCurrentAudioNode(testNode);
}

export default MixedAudio;