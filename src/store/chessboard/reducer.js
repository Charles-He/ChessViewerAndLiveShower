// reducers hold the store's state (the initialState object defines it)
// reducers also handle plain object actions and modify their state (immutably) accordingly
// this is the only way to change the store's state
// the other exports in this file are selectors, which is business logic that digests parts of the store's state
// for easier consumption by views

import _ from 'lodash';
import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import React, { Component}  from 'react';

const gameState = {
    lightSquareColor: "#e8b586", // light blue
    darkSquareColor: "#a85a12", // dark blue
    flip: false,
    lastMessage: '',
    // squareSize: 45,
    squareSize: window.innerHeight > window.innerWidth ?  window.innerWidth / 10 : window.innerHeight / 12,
    gameType: 'chess'
};

const gamePresets = {
    chess: {
      // fen: "1r3kr1/pbpBBp1p/1b3P2/8/8/2P2q2/P4PPP/3R2K1 b - - 0 24",
      files: 8,
      flip: true,
      gameHistory: false,
      ranks: 8,
      pieceDefinitions: {},
      fen: ''
      // startMove: 'w0'
    }
    
};

const initialState = Immutable(
    Object.assign({}, gameState, gamePresets[gameState.gameType])
);

// Convenience function for concisely creating piece definition callbacks
function _createPieceDefinition(url) {
    return (transformString) => (
      
      <svg>
        <image transform={transformString} href={url} />
      </svg>
      
    )
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.LIVESHOW_FETCHMATCH:
      return state.merge({
        matches: action.matches
      });
    case types.LIVESHOW_FETCHMOVE:
      return {
        ...state,
          matches: {
            ...state.matches,
            [action.moves.matchid]: {
              ...state.matches[action.moves.matchid],
                moves : action.moves
            }
          }
      };
      
    case types.LIVESHOW_NEWMOVE:
      return state.merge({
        matches: action.newMove
      });
    case types.LIVESHOW_SELECTEDMATCH:
      return state.merge({
        selectedMatch: action.selectedMatch
      });
    case types.LIVESHOW_SELECTEDMOVE:
      return state.merge({
        selectedMove: action.moveId
      });
    default:
      return state;
  }
}

// selectors

export function getDarkSquareColor(state) {
  // console.log(state.liveshow.matches);
  return state.chessboard.darkSquareColor;
}

export function getFen(state) {
  // console.log(state.liveshow.selectedMatch);
  return state.chessboard.fen;
}

export function getGameHistory(state) {
  return state.chessboard.gameHistory;
}

export function getStartPosition(state) {
  // strange! there is no currentPosition in state.
  return state.chessboard.currentPosition;
}

export function getFiles(state) {
  return state.chessboard.files;
}

export function getFlip(state) {
  return state.chessboard.flip;
}

export function getLightSquareColor(state) {
  return state.chessboard.lightSquareColor;
}

export function getPgn(state) {
  var moves = state.liveshow.matches[state.liveshow.selectedMatch]['moves'];
  // console.log(moves);

  function Item(move, sanw, sanb) {
    this.move = move;
    this.sanw = sanw;
    this.sanb = sanb;
  }

  var initObj = moves;
  var newKey = [];
  var marker = [];
  var newColor = [];
  var lastMoveId;
  var newArray = [];

  Object.keys(initObj).forEach(function(key) {
    newKey = key.match(/\d+/);
    if (newKey == null) { return; }
    lastMoveId = newKey[0];
    newColor = key.match(/[a-z]+/);
    if (newColor[0] === "white") {
      if (marker[newKey[0]] != null) {
        newArray[newKey[0]] = new Item(newKey[0], initObj[key].san, marker[newKey[0]]);
      } else {
        marker[newKey[0]] = initObj[key].san;
      }
    } else {
      if (marker[newKey[0]] != null) { 
        newArray[newKey[0]] = new Item(newKey[0], marker[newKey[0]], initObj[key].san);
      } else {
        marker[newKey[0]] = initObj[key].san;
      }
    }
  } );
  if (newArray[lastMoveId] == null) {
    if (newColor[0] === "white") {
      newArray[lastMoveId] = new Item(lastMoveId, marker[lastMoveId], undefined);
    } else {
      newArray[lastMoveId] = new Item(lastMoveId, undefined, marker[lastMoveId]);
    }
  }
  // console.log(newArray);

  var pgn;
  newArray.forEach(function(item) {
    if (item != null) {
      pgn += item['move']+'. '+item['sanw']+' '+item['sanb']+' ';
    }
  } );
  pgn = pgn.replace(/undefined/g, '');
  pgn = ['[]','',pgn].join('\n');
  // console.log(state.chessboard.pgn);
  return pgn;
}

export function getPieceDefinitions(state) {
  return state.chessboard.pieceDefinitions;
}

export function getRanks(state) {
  return state.chessboard.ranks;
}

export function getSquareSize(state) {
  return state.chessboard.squareSize;
}

export function getStartMove(state) {
  // return state.liveshow.selectedMove;
  if (state.liveshow.selectedMatch) {
    return state.liveshow.matches[state.liveshow.selectedMatch]['selectedmove'];
  } else {return 0}
}