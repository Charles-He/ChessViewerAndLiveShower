// services are state-less
// they act as utility facades that abstract the details for complex operations
// normally, our interface to any sort of server API will be as a service

import _ from 'lodash';

const CHESSAPI_ENDPOINT = 'http://192.168.1.2:8080/api/v1/todos';

class ChessService {

  async getMatches(userId, event) {
    // const url = `${CHESSAPI_ENDPOINT}/getmatches/${userId}`;
    const url = `${CHESSAPI_ENDPOINT}/getmatches/${userId}/${event}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`ChessService getMatches failed, HTTP status ${response.status}`);
    }
    const data = await response.json();
    const matchinfo = _.get(data, 'data');
    if (!data) {
      throw new Error(`ChessService getMatches failed, data not returned`);
    }

    // const sortedBySubscribers = _.orderBy(children, 'data.subscribers', 'desc');
    const sortedByMatchids = _.orderBy(matchinfo, 'matchid', 'asc');
    // console.log(sortedByMatchids);
    return _.map(sortedByMatchids, (submatch) => {
      // abstract away the specifics of the reddit API response and take only the fields we care about
      return {
        matchid: _.get(submatch, 'matchid'),
        event: _.get(submatch, 'event'),
        site: _.get(submatch, 'site'),
        date: _.get(submatch, 'date'),
        round: _.get(submatch, 'round'),
        white: _.get(submatch, 'white'),
        black: _.get(submatch, 'black'),
        result: _.get(submatch, 'result'),
        whitetype: _.get(submatch, 'whitetype'),
        blacktype: _.get(submatch, 'blacktype'),
        timecontrol: _.get(submatch, 'timecontrol'),
        moves: undefined,
        selectedmove: 0,
        moveslength: undefined,
      }
    });
  }

  async getSan(matchId) {
    const url = `${CHESSAPI_ENDPOINT}/getmoves/${matchId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });
    // if (!response.ok) {
    //  throw new Error(`ChessService getSan failed, HTTP status ${response.status}`);
    // }
    const data = await response.json();
    const moveInfo = _.get(data, 'data');
    if (!moveInfo) {
      // throw new Error(`ChessService getSan failed, moveInfo not returned`);

      // before the first move comes, initialize the first move.
      return [{
        moveid: '1white',
        san: ''
      }]
    }
    return _.map(moveInfo, (post) => {
      // abstract away the specifics of the reddit API response and take only the fields we care about
      var step = _.get(post, 'step');
      var color = _.get(post, 'color');
      var moveId = step+color;
      // console.log(moveId);
      return {
        moveid: moveId,
        // step: _.get(post, 'step'),
        // color: _.get(post, 'color'),
        san: _.get(post, 'san')
      }
    });
  }
}

export default new ChessService();
