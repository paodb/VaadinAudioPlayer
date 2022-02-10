import { Schedule } from './schedule.js';

/**
 * Reusable AudioBuffer player node.
 *
 * @memberOf VaadinAudioPlayer
 */
export const BufferPlayer = (() => {
    return class BufferPlayer {
        /**
         * @param {AudioContext} context
         */
        constructor(context) {
            this._context = context;
            this._startTime = undefined;
            this._destination = undefined;
            this._resetSourceNode();
        }

        get isScheduled() {
            return this._startTime !== undefined;
        }

        get isPlaying() {
            return this.isScheduled
                && this._startTime <= this._context.currentTime
                - Schedule.AUDIO_SCHEDULE_DELAY_MS / 1000;
        }

        play(
            offsetMillis,
            when = this._context.currentTime +
            Schedule.AUDIO_SCHEDULE_DELAY_MS / 1000
        ) {
            if (this.isScheduled) {
                this.stop(when);
            }
            this._startTime = when;
            this._sourceNode.start(when, offsetMillis / 1000);
        }

        playByDuration(
            offsetMillis,
            when = this._context.currentTime +
            Schedule.AUDIO_SCHEDULE_DELAY_MS / 1000,
            duration
        ) {
            if (this.isScheduled) {
                this.stop(when);
            }
            this._startTime = when;
            this._sourceNode.start(when, offsetMillis / 1000, duration);
        }

        stop(
            when = this._context.currentTime
            + Schedule.AUDIO_SCHEDULE_DELAY_MS / 1000
        ) {
            if (this.isScheduled) {
                this._sourceNode.stop(when);
                this._resetSourceNode();
            }
        }

        /**
         * @param {AudioNode} destination
         */
        connect(destination) {
            this._destination = destination;
            this._sourceNode.connect(destination);
        }

        /**
         */
        disconnect() {
            if (this._destination) {
                this._destination = undefined;
                this._sourceNode.disconnect();
            }
        }

        /**
         * @param {AudioBuffer} buffer
         */
        set buffer(buffer) {
            if (this._sourceNode.buffer !== buffer) {
                this._resetSourceNode(true);
                if (buffer !== null) {
                    this._sourceNode.buffer = buffer;
                }
            }
        }

        /**
         * @returns {AudioBuffer}
         */
        get buffer() {
            return this._sourceNode.buffer;
        }

        /**
         * @returns {AudioParam}
         */
        get playbackRate() {
            return this._sourceNode.playbackRate;
        }

        /**
         * @param {boolean} discardBuffer
         */
        _resetSourceNode(discardBuffer) {
            let buffer;
            let playbackRate = 1;
            if (this._sourceNode) {
                buffer = this._sourceNode.buffer;
                playbackRate = this._sourceNode.playbackRate.value;
            }
            this._startTime = undefined;
            this._sourceNode = this._context.createBufferSource();
            this._sourceNode.playbackRate.value = playbackRate;
            this._sourceNode.onended = event => {
                // If the current source node has ended playback,
                // reset it to prepare for starting playback again
                if (this._sourceNode === event.target) {
                    this._resetSourceNode();
                }
            };
            if (buffer && !discardBuffer) {
                this._sourceNode.buffer = buffer;
            }
            if (this._destination) {
                this._sourceNode.connect(this._destination);
            }
        }
    };
})();

