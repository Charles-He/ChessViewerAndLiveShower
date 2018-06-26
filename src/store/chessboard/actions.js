// actions are where most of the business logic takes place
// they are dispatched by views or by other actions
// there are 3 types of actions:
//  async thunks - when doing asynchronous business logic like accessing a service
//  sync thunks - when you have substantial business logic but it's not async
//  plain object actions - when you just send a plain action to the reducer

import _ from 'lodash';
import * as types from './actionTypes';
// import chessService from '../../services/matchviewer';

export function _onFenChanged(fen) { // user inputted new position
    return async(dispatch, getState) => {
        dispatch({ type: types.CHESSBOARD_FENCHANGED, fen});
  };
}

export function  _onFlipChanged(flip) { //flip board
    return async(dispatch, getState) => {
        dispatch({ type: types.CHESSBOARD_FLIPBOARD, flip});
  };
}

export function  _onLightSquareColorChanged(color) {
    return async(dispatch, getState) => {
        dispatch({ type: types.CHESSBOARD_LIGHTSQUARECOLORCHANGED, color});
  };
}
    
export function  _onDarkSquareColorChanged(color) {
    return async(dispatch, getState) => {
        dispatch({ type: types.CHESSBOARD_DARKSQUARECOLORCHANGED, color});
  };
}

export function  _onMovePiece(piece, fromSquare, toSquare) { // user moved a piece
    return async(dispatch, getState) => {
        // clearTimeout(this.timeout);
        // echo move back to user:
        let message = 'You moved ' + piece + fromSquare + " to " + toSquare + ' !';
        dispatch({ type: types.CHESSBOARD_LASTMESSAGE, message});
        // this.setState({lastMessage: message}, () => {
        // this.timeout = setTimeout(() => {this.setState({lastMessage: ''})}, 2000)
    };
}

export function _onFilesChanged(file) {
    return async(dispatch, getState) => {
        dispatch({ type: types.CHESSBOARD_FILECHANGED, file});
  };
}

export function _onRanksChanged(rank) {
    return async(dispatch, getState) => {
        dispatch({ type: types.CHESSBOARD_RANKCHANGED, rank});
  };
}

export function _onGameTypeChange(gameType) {
    return async(dispatch, getState) => {
        dispatch({ type: types.CHESSBOARD_GAMETYPECHANGED, gameType});
  };
}

export function  _onPgnChanged(pgn) {
    return async(dispatch, getState) => {
        dispatch({ type: types.CHESSBOARD_PGNCHANGED, pgn});
        // this.game.load_pgn(evt.target.value);
  };
}
   
