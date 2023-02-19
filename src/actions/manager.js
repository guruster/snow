import {
  SET_STATUS,
  SET_WALLET,
  SET_MODAL,
  SET_CASE_MODAL,
  SET_DICE,
  SET_PLAYER_INFO,
  SET_ROLLABLE,
  SET_ROLL_FREE
} from './types';

import { getClaimableRewards, getDailyRewards, getEthBalance, getPlayerInfo, getPolyBalance, getRollFree, getNFTs, getUpgradableCounts } from '../lib/block';

export const setStatus = (status) => dispatch => {
  dispatch({
    type: SET_STATUS,
    payload: status
  })
}

export const setWallet = (wallet) => dispatch => {
  dispatch({
    type: SET_WALLET,
    payload: wallet
  })
}

export const setModal = (open, text) => dispatch => {
  dispatch({
    type: SET_MODAL,
    payload: { modalOpen: open, modalText: text }
  })
}

export const setCaseModal = (open, curPos) => dispatch => {
  dispatch({
    type: SET_CASE_MODAL,
    payload: { caseModalOpen: open, curPos }
  })
}

export const setDice = (dice) => dispatch => {
  dispatch({
    type: SET_DICE,
    payload: dice
  })
}

export const setPlayerInfo = (account) => async dispatch => {
  let player = {
    upgradableCounts: []
  };

  player.ethBalance = await getEthBalance(account)
  player.polyBalance = await getPolyBalance(account)

  // dispatch({
  //   type: SET_PLAYER_INFO,
  //   payload: player
  // })

  const data = await getPlayerInfo(account)
  player.dice = Number(data?.dice)
  player.curPos = Number(data?.curPos)
  player.lastRollTime = Number(data?.lastRollTime)
  player.lastRewardTime = Number(data?.lastRewardTime)
  player.rewardClaimed = window.web3.utils.fromWei(data?.rewardClaimed || '0', 'ether')
  player.startBonusCounts = Number(data?.startBonusCounts)
  player.startBonusRate = 1 + Number(data?.startBonusRate) / 100
  player.bullishBonusCounts = Number(data?.bullishBonusCounts)
  player.bullishBonusRate = 1 + Number(data?.bullishBonusRate) / 100
  player.disableStartTime = Number(data?.disableStartTime)
  player.disableRemainTime = Number(data?.disableRemainTime)
  player.farming = Number(data?.farming)
  player.boostRewards = data?.boostRewards.map(item => Number(item))
  player.minted = data?.minted
  player.nfts = await getNFTs(account)
  console.log('nfts', player.nfts)
  player.upgradableCounts = await getUpgradableCounts(account)
  console.log('upgradable', player.upgradableCounts)
  player.dailyRewards = await getDailyRewards(account)
  player.claimableRewards = await getClaimableRewards(account)


  console.log('player', player)
  dispatch({
    type: SET_PLAYER_INFO,
    payload: player
  })

  const rollFree = await getRollFree()
  dispatch({
    type: SET_ROLL_FREE,
    payload: rollFree
  })
}

export const setRollable = (rollable) => dispatch => {
  dispatch({
    type: SET_ROLLABLE,
    payload: rollable
  })
}