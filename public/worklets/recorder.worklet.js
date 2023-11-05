class RecorderProcessor extends AudioWorkletProcessor {

    constructor(options) {

        super();

        this.startTime = options.processorOptions.startTime;
        this.tempo = options.processorOptions.tempo;
        this.samples = options.processorOptions.audioBuffers;
        this._bufferHead = 0;
        this.mixedSamples = [];
        this.port.onmessage = (e) => {
          //console.log(e.data);
          this.port.postMessage("pong");
        };
      }

      mixSamples(bufferLength) {
        var mix = [];
        for(var i = 0; i<Math.ceil(bufferLength); i++) {
          mix[i] = 0;
          this.samples.forEach((sample) => {
            if(mix[i] >= 1.0) {
              mix[i] = 0.999999999999999;
            } else if(mix[i] <= -1.0) {
              mix[i] = -0.999999999999999;
            }
            else {
              if(sample[i] == undefined || sample[i] == null || sample[i] == NaN) {
                mix[i] += 0;
              } else {
                mix[i] += sample[i];
              }
            }
          });
        }
        this.mixedSamples = mix;
      }
    
      process(inputs , outputs , parameters ) {
        
        const output = outputs[0];
        var channelIndex = 0;
          let absoluteSampleIndex = this._bufferHead
          var x = (this.tempo/4)-120;
          var y = Math.E/2.6;
          var z = Math.pow(y, -x);
          var w = 1+z;
          this.mixSamples(40000)
          for (let i = 0; i < output[0].length; i++) {
            outputs[0][0][i] = this.mixedSamples[absoluteSampleIndex] === undefined ? 0 : this.mixedSamples[absoluteSampleIndex];
            outputs[0][1][i] = this.mixedSamples[absoluteSampleIndex] === undefined ? 0 : this.mixedSamples[absoluteSampleIndex];
            absoluteSampleIndex += 1;
          }
          channelIndex += 1;
          this._bufferHead = absoluteSampleIndex;

        this.port.postMessage({
          type: 'BUFFER_ENDED',
          bufferHead: this._bufferHead
        });

        var endTime = this.startTime + (60/this.tempo)/4
        if(currentTime >= endTime) {
          this.port.postMessage({
            type: 'WORKLET_ENDED'
          });
          return false;
        }

        if(this._bufferHead >= this.mixedSamples.length) {
          this.port.postMessage({
            type: 'WORKLET_ENDED'
          });
          return false;
        } else {
          return true;
        }
      }
}
registerProcessor("recorder.worklet", RecorderProcessor);