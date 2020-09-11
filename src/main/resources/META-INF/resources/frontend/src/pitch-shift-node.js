import { Jungle } from '../third-party/jungle.js';
/**
 * @memberOf VaadinAudioPlayer
 */
export const PitchShiftNode = class PitchShiftNode {
    /**
     * @param {AudioNode} inputNode
     */
    constructor(inputNode) {
        this._inputNode = inputNode;
        this._context = this._inputNode.context;
        this._jungleObject = new Jungle(this._context);

        // Remove initial pitch down offset
        // this._jungleObject.setPitchOffset(0);

        // Fix squeaking sound artifact when playback starts
        this._jungleObject.modGain1.gain.cancelScheduledValues(0);
        this._jungleObject.modGain2.gain.cancelScheduledValues(0);
        this._jungleObject.modGain1.gain.value = 0;
        this._jungleObject.modGain2.gain.value = 0;

        this._inputNode.connect(this._jungleObject.input);
    }

    /**
     * @returns {AudioContext}
     */
    get context() {
        return this._context;
    }

    /**
     * @param {AudioNode} destination
     */
    connect(destination) {
        this._jungleObject.output.connect(destination);
    }

    /**
     */
    disconnect() {
        this._jungleObject.output.disconnect();
    }

    /**
     * @param {number} pitchFactor
     * @param {number?} when
     */
    setPitchFactor(pitchFactor, when) {
        // const pitchOffset = (pitchFactor - 1) * 2;
        // this._jungleObject.setPitchOffset(pitchOffset);

        // NOTE: Using Jungle.js builtin setPitchOffset / setDelay methods
        // does the job, introduces a squeaking sound artifact as a result
        // of using `setTargetAtTime` for changing the delay time with
        // a smooth transition. Below is equivalent of above, but with
        // instant transition.

        const baseDelayTime = 0.100;
        const delayTime = Math.abs(pitchFactor - 1) * baseDelayTime;
        if (pitchFactor > 1) { // pitch up
            this._jungleObject.mod1Gain.gain.setValueAtTime(0, when);
            this._jungleObject.mod2Gain.gain.setValueAtTime(0, when);
            this._jungleObject.mod3Gain.gain.setValueAtTime(1, when);
            this._jungleObject.mod4Gain.gain.setValueAtTime(1, when);
        } else { // pitch down
            this._jungleObject.mod1Gain.gain.setValueAtTime(1, when);
            this._jungleObject.mod2Gain.gain.setValueAtTime(1, when);
            this._jungleObject.mod3Gain.gain.setValueAtTime(0, when);
            this._jungleObject.mod4Gain.gain.setValueAtTime(0, when);
        }
        this._jungleObject.modGain1.gain.setValueAtTime(delayTime, when);
        this._jungleObject.modGain2.gain.setValueAtTime(delayTime, when);
    }
};

