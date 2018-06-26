// actions are where most of the business logic takes place
// they are dispatched by views or by other actions
// there are 3 types of actions:
//  async thunks - when doing asynchronous business logic like accessing a service
//  sync thunks - when you have substantial business logic but it's not async
//  plain object actions - when you just send a plain action to the reducer

import _ from 'lodash';
import * as types from './actionTypes';
import chessService from '../../services/matchviewer';
// import * as selectors from './reducer';
// import * as postActions from '../posts/actions';

export function fetchMatches(userId, event) {
  return async(dispatch, getState) => {
    try {
      const matchArray = await chessService.getMatches(userId, event);
      const matches = _.keyBy(matchArray, (match) => match.matchid);
      console.log(matches);
      dispatch({ type: types.LIVESHOW_FETCHMATCH, matches });

      // set initial value of selected match
      const selectedMatch = Object.keys(matches)[0];
      dispatch({ type: types.LIVESHOW_SELECTEDMATCH, selectedMatch });
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchMoves(matchId) {
  // console.log(matchId);
  return async(dispatch, getState) => {
    try {
      const moveArray = await chessService.getSan(matchId);
      
      const moves = _.keyBy(moveArray, (move) => move.moveid);
      // add moveid to the new object to repsent the key in state.matches
      moves.matchid = matchId;
      // add matchid as the key to match state design
      const newArray = [moves];
      const newMoves = _.keyBy(newArray, () => 'moves');
      const newArrayTwo = [newMoves];
      const newMovesTwo = _.keyBy(newArrayTwo, () => matchId);
      // console.log(moves);
      dispatch({ type: types.LIVESHOW_FETCHMOVE, moves });

      // let length;
      // length.length = Object.keys(moves).length - 1;
      // length.matchid = matchId;
      var length = { length: Object.keys(moves).length - 1, matchid: matchId }
      dispatch({ type: types.LIVESHOW_MOVELENGTH, length });
    } catch (error) {
      console.error(error);
    }
  };
}

export function newMove() {
  // catch san from websocket. need to develop later.
}

export function selectMatch(match) {
  return (dispatch, getState) => {
    let newSelectedMatch;
    newSelectedMatch = match;
    dispatch({ type: types.LIVESHOW_SELECTEDMATCH, selectedMatch: newSelectedMatch  });
    // optimization - prefetch the moves before going to the posts screen
    // if (newSelectedTopics.length === 3) {
    //   dispatch(postActions.fetchPosts());
    // }
  };
}

export function selectMove(move, matchId) {
  // console.log(move);
  return (dispatch, getState) => {
    var newSelectedMove = { move: move, matchid: matchId };
    dispatch({ type: types.LIVESHOW_SELECTEDMOVE, selectedMove: newSelectedMove  });
  };
}

export function addResult(matchId, result) {
  // console.log(move);
  return (dispatch, getState) => {
    var newResult = { result: result, matchid: matchId };
    dispatch({ type: types.LIVESHOW_ADDRESULT, addResult: newResult  });
  };
}
