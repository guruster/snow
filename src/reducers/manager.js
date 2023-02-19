import * as types from '../actions/types';

const initialState = {
  status: '',
  wallet: '',
  modalText: '',
  modalOpen: false,
  caseModalOpen: false,
  curPos: 0,
  dice: 0,
  player: {
    ethBalance: 0,
    polyBalance: 0,
    dice: 0,
    prevPos: 0,
    curPos: 0,
    lastRollTime: 0,
    lastRewardTime: 0,
    rewardClaimed: 0,
    dailyRewards: 0,
    claimableRewards: 0,
    disableStartTime: 0,
    disableRemainTime: 0,
    farming: 0,
    boostRewards: [],
    minted: false,
    nfts: [],
    upgradableCounts: []
  },
  rollable: false,
  rollFree: false,
};

function managerReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {

    case types.SET_STATUS:
      return {
        ...state,
        status: payload
      };
    case types.SET_WALLET:
      return {
        ...state,
        wallet: payload
      }
    case types.SET_MODAL:
      return {
        ...state,
        ...payload
      };
    case types.SET_CASE_MODAL:
      return {
        ...state,
        ...payload
      }
    case types.SET_DICE:
      return {
        ...state,
        dice: payload
      };
    case types.SET_PLAYER_INFO:
      return {
        ...state,
        player: payload
      }
    case types.SET_ROLLABLE:
      return {
        ...state,
        rollable: payload
      }
    case types.SET_ROLL_FREE:
      return {
        ...state,
        rollFree: payload
      }
    default:
      return state;
  }
}

export default managerReducer;
