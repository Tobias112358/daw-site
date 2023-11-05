class RecorderProcessor extends AudioWorkletProcessor {

    constructor(options) {

        super();

        this.samples = options.processorOptions.audioBuffers;
        this._bufferHead = 0;
        this.mixedSamples = [];
        this.port.onmessage = (e) => {
          //console.log(e.data);
          this.port.postMessage("pong");
        };
      }

      mixSamples() {
        var mix = [];
        for(var i = 0; i<10000; i++) {
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
          var x = 1;
          this.mixSamples()
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