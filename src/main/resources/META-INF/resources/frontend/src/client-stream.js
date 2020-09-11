import { ClientStreamBuffer } from './client-stream-buffer.js';
import './chunk-descriptor.js';

/**
 * Schedule interval constants.
 *
 * @memberOf VaadinAudioPlayer
 */
export const ClientStream = (() => {
    const MAX_BUFFER_RETAIN_COUNT = 8;

    return class ClientStream {
        /**
         * @param {AudioContext} context
         * @param {AudioPlayer} transport
         */
        constructor(context, transport) {
            this._context = context;
            this._transport = transport;
            this._chunkRequests = new WeakMap();
            this._resolutions = new WeakMap();
            this._rejections = new WeakMap();
            this._buffers = new WeakMap();
        }

        /**
         * @param {VaadinAudioPlayer.ChunkDescriptor} chunk
         * @returns {Promise<VaadinAudioPlayer.ClientStreamBuffer>}
         */
        requestChunk(chunk) {
            if (!chunk) {
                Promise.reject();
            }

            if (this._buffers.has(chunk)) {
                return Promise.resolve(this._buffers.get(chunk));
            }

            if (this._chunkRequests.has(chunk)) {
                return this._chunkRequests.get(chunk);
            }

            const request = new Promise((resolve, reject) => {
                this._resolutions.set(chunk, resolve);
                this._rejections.set(chunk, reject);
            });
            this._chunkRequests.set(chunk, request);

            this._loadChunkData(chunk);

            return request;
        }

        /**
         * @param {number} chunkId
         * @returns {Promise<VaadinAudioPlayer.ChunkDescriptor>}
         */
        requestChunkById(chunkId) {
            return this.requestChunk(this._findChunkById(chunkId));
        }

        /**
         * @param {number} position_millis
         * @returns {Promise<VaadinAudioPlayer.ChunkDescriptor>}
         */
        requestChunkByTimestamp(position_millis) {
            return this.requestChunk(this._findChunkForPosition(position_millis));
        }

        /**
         * Makes a binary GET request on chunk.url to load chunk audio data.
         * Uses `_onChunkDataLoaded` callback.
         *
         * @param {VaadinAudioPlayer.ChunkDescriptor} chunk
         */
        _loadChunkData(chunk) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', chunk.url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = () => {
                this._onChunkDataLoaded(chunk, xhr.response);
            };
            xhr.send(null);
        }

        /**
         * Chunk data request callback.
         *
         * @param {VaadinAudioPlayer.ChunkDescriptor} chunk
         * @param {ArrayBuffer} data
         */
        _onChunkDataLoaded(chunk, data) {
            const buffer = new ClientStreamBuffer(this._context, data);
            buffer.chunk = chunk;

            this._buffers.set(chunk, buffer);
            if (this._buffers.size > MAX_BUFFER_RETAIN_COUNT) {
                this._buffers.forEach((buffer, chunk) => {
                    if (this._buffers.size > MAX_BUFFER_RETAIN_COUNT) {
                        this._buffers.delete(chunk);
                    }
                });
            }

            const resolve = this._resolutions.get(chunk);
            if (resolve) {
                this._resolutions.delete(chunk);
                resolve(buffer);
            }
        }

        /**
         * @param {number} chunkId
         * @return {VaadinAudioPlayer.ChunkDescriptor}
         */
        _findChunkById(chunkId) {
            return this._transport.chunks
                .filter(chunk => chunk.id === chunkId)[0];
        }

        /**
         * @param {number} position_millis
         * @return {VaadinAudioPlayer.ChunkDescriptor}
         */
        _findChunkForPosition(position_millis) {
            return this._transport.chunks
                .filter(chunk => {
                    return chunk.startTimeOffset <= position_millis
                        && (chunk.endTimeOffset - chunk.leadInDuration) > position_millis
                })[0];
        }

        /**
         * @param {VaadinAudioPlayer.ChunkDescriptor} chunk
         * @returns {Promise<VaadinAudioPlayer.ClientStreamBuffer>}
         */
        getBufferForChunk(chunk) {
            return this._buffers.get(chunk);
        }

        /**
         * @returns {number}
         */
        get duration() {
            return this._transport.duration;
        }
    };
})();

