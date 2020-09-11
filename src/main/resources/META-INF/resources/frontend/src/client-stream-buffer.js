import './chunk-descriptor.js';

/**
 * Decodes the audio data from ArrayBuffer, stores references
 * to source ArrayBuffer, decoded AudioBuffer promise, chunk descriptor.
 *
 * @memberOf VaadinAudioPlayer
 */
export const ClientStreamBuffer = class ClientStreamBuffer {
    /**
     * @param {AudioContext} context
     * @param {ArrayBuffer} data
     */
    constructor(context, data) {
        this._context = context;

        /**
         * @type {VaadinAudioPlayer.ChunkDescriptor | null}
         */
        this.chunk = null;

        /**
         * @type {Promise<AudioBuffer>}
         */
        this.ready = new Promise((resolve, reject) => {
            this._context.decodeAudioData(data, resolve, reject);
        });
    }
};

