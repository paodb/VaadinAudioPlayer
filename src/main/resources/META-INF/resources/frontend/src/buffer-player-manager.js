import { BufferPlayer } from './buffer-player.js';

/**
 * Contains BufferPlayer instances, implements switching
 * the current player instance.
 *
 * @memberOf VaadinAudioPlayer
 */
export const BufferPlayerManager = (() => {
    const MAX_PLAYERS_DEFAULT = 2;

    return class BufferPlayerManager {
        /**
         * @param {AudioContext} context
         * @param {number?} maxPlayers
         */
        constructor(context, maxPlayers = MAX_PLAYERS_DEFAULT) {
            this._context = context;
            this._players = [...new Array(maxPlayers)].map(() => {
                return new BufferPlayer(this._context);
            });
            this._currentPlayerId = 0;
        }

        /**
         * @returns {VaadinAudioPlayer.BufferPlayer}
         */
        get currentPlayer() {
            return this._players[this._currentPlayerId];
        }

        /**
         * @returns {VaadinAudioPlayer.BufferPlayer}
         */
        get nextPlayer() {
            const i = (this._currentPlayerId + 1) % this._players.length;
            return this._players[i];
        }

        /**
         * @returns {VaadinAudioPlayer.BufferPlayer}
         */
        get prevPlayer() {
            const i = this._currentPlayerId === 0 ? this._players.length - 1 : this._currentPlayerId - 1;
            return this._players[i];
        }

        moveToNextPlayer() {
            this._currentPlayerId = (this._currentPlayerId + 1) % this._players.length;
        }

        moveToPrevPlayer() {
            this._currentPlayerId = this._currentPlayerId === 0 ? this._players.length - 1 : this._currentPlayerId - 1;
        }

        /**
         * @returns {VaadinAudioPlayer.BufferPlayer[]}
         */
        get players() {
            return this._players;
        }

        /**
         * @param {AudioNode} destination
         */
        connectAll(destination) {
            this._destination = destination;
            this._players.forEach(player => player.connect(destination));
        }

        /**
         */
        disconnectAll() {
            this._destination = undefined;
            this._players.forEach(player => player.disconnect());
        }
    };
})();

