// reducers hold the store's state (the initialState object defines it)
// reducers also handle plain object actions and modify their state (immutably) accordingly
// this is the only way to change the store's state
// the other exports in this file are selectors, which is business logic that digests parts of the store's state
// for easier consumption by views

import _ from 'lodash';
import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import update from 'immutability-helper';

const initialState = Immutable({
  matches: undefined,
  selectedMatch: undefined,
  // selectedMove: "w1"
  // selectedMove: 0,
  // movesLength: undefined
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.LIVESHOW_FETCHMATCH:
      return state.merge({
        matches: action.matches
      });
    case types.LIVESHOW_FETCHMOVE:
      var newMoves = action.moves;
      return (
        update(state,{matches: {[action.moves.matchid]: {moves: {$set: newMoves}}}})
      );
      
    case types.LIVESHOW_NEWMOVE:
      return state.merge({
        matches: action.newMove
      });
    case types.LIVESHOW_SELECTEDMATCH:
      return {
        ...state,
        selectedMatch: action.selectedMatch
      };
    case types.LIVESHOW_SELECTEDMOVE:
      // console.log(action.selectedMove);
      var newSelectedMove = action.selectedMove.move;
      return (
        update(state,{matches: {[action.selectedMove.matchid]: {selectedmove: {$set: newSelectedMove}}}})
        // ...state,
        // selectedMove: action.selectedMove
      );
      case types.LIVESHOW_MOVELENGTH:
      // console.log(action.length);
      var newLength = action.length.length;
      return (
        update(state,{matches: {[action.length.matchid]: {moveslength: {$set: newLength}}}})
        // ...state,
        // movesLength: action.length
      );
      case types.LIVESHOW_ADDRESULT:
      console.log(action.addResult);
      var newResult = action.addResult.result;
      return (
        update(state,{matches: {[action.addResult.matchid]: {result: {$set: newResult}}}})
      )
    default:
      return state;
  }
}

// selectors

export function getMatches(state) {
  // console.log(state.liveshow.matches);
  return state.liveshow.matches;
}

export function getSelectedMatch(state) {
  // console.log(state.liveshow.selectedMatch);
  return state.liveshow.selectedMatch;
}

export function getSelectedMove(state) {
  // console.log(state.liveshow.selectedMove);
  if (state.liveshow.selectedMatch != null) {
    // console.log(state.liveshow.selectedMatch);
    return state.liveshow.matches[state.liveshow.selectedMatch]['selectedmove'];
  } else {return 0}
}

export function getMoves(state) {
  // console.log(state.liveshow.matches);
  // console.log(state.liveshow.matches[state.liveshow.selectedMatch]['moves']);
  return state.liveshow.matches[state.liveshow.selectedMatch]['moves'];
}

export function getMovesLength(state) {
  // console.log(state.liveshow.selectedMove);
  // return state.liveshow.movesLength;
  if (state.liveshow.selectedMatch != null) {
    return state.liveshow.matches[state.liveshow.selectedMatch]['moveslength'];
  } else {return 1}
}
