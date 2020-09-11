/**
 * Implements a separate gain control on every channel
 * of the given `inputNode`.
 *
 * @memberOf VaadinAudioPlayer
 */
export const MultiChannelGainNode = class MultiChannelGainNode {
    /**
     * @param {AudioNode} inputNode
     */
    constructor(inputNode) {
        this._inputNode = inputNode;
        this._context = this._inputNode.context;
        this._channelCount = this._inputNode.channelCount;

        this._channelSplitterNode = this._context.createChannelSplitter(this._channelCount);
        this._inputNode.connect(this._channelSplitterNode);

        this._channelMergerNode = this._context.createChannelMerger(this._channelCount);

        this._gainNodes = [...new Array(this._channelCount)].map((_, i) => {
            const gainNode = this._context.createGain();
            this._channelSplitterNode.connect(gainNode, i, 0);
            gainNode.connect(this._channelMergerNode, 0, i);
            return gainNode;
        });
    }

    /**
     * @returns {AudioContext}
     */
    get context() {
        return this._context;
    }

    /**
     * @returns {number}
     */
    get channelCount() {
        return this._channelCount;
    }

    /**
     * @param {AudioNode} destination
     */
    connect(destination) {
        this._channelMergerNode.connect(destination);
    }

    /**
     */
    disconnect() {
        this._channelMergerNode.disconnect();
    }

    /**
     * Get the gain parameter node for the given channel.
     *
     * @param {number} channelIndex
     * @return {AudioParam}
     */
    getGain(channelIndex) {
        return this._gainNodes[channelIndex].gain;
    }
};

