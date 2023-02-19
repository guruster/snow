/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// material
import { styled } from '@mui/material/styles';
import { Container, Stack, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { NotificationManager } from 'react-notifications';
// components
import Page from '../../components/Page'
import Board from './Board';
import PlayerInfo from './PlayerInfo';
import CaseModal from './CaseModal';
// ----------------------------------------------------------------------
// import { sleep } from '../../lib/utils'
import { rollDice, getPlayerInfo, claimRewards, shortBalance, mintNFT, hasEnoughPoly, moveTo } from '../../lib/block';
import { setPlayerInfo, setCaseModal, setModal } from '../../actions/manager';

const ROLL_FEE = Number(process.env.REACT_APP_ROLL_FEE)

const CASE_POSITION = [
  "Start",
  "Rugcity_nft",
  "Farming",
  "Honeypot Land_nft",
  "St Exitscam_nft",
  "Devis Asleep_nft",
  "Softrug Boulevard_nft",
  "Rewards Boost x1.2",
  "Shitcoin Paradise_nft",
  "Whitelisted Street_nft",
  "Ponzi Farm_nft",
  "Degen Area_nft",
  "Ape Territory_nft",
  "Farming",
  "ICO Graveyard_nft",
  "Dinocoins City_nft",
  "Moonshot Street_nft",
  "Rewards Boost x1.5",
  "Liquidation Park_nft",
  "Disable Rewards for 24h",
  "Gemes Kingdom_nft",
  "Rewards Boost x1.8",
  "Goblin Town_nft",
  "[Redacted]_nft"
]

const NFT_PRICE = [
  '0',  // "Start",
  '35000',   // "Rugcity_nft",
  '0',   // "Farming",
  '40000',   //"Honeypot Land_nft", 
  '60000',// "St Exitscam_nft",
  '65000',// "Devis Asleep_nft",
  '70000',// "Softrug Boulevard_nft",
  '0',// "Rewards Boost x1.2",
  '80000',// "Shitcoin Paradise_nft",
  '90000',// "Whitelisted Street_nft",
  '100000',// "Ponzi Farm_nft",
  '120000',// "Degen Area_nft",
  '140000',// "Ape Territory_nft",
  '0',// "Farming",
  '180000',// "ICO Graveyard_nft",
  '200000',// "Dinocoins City_nft",
  '220000',// "Moonshot Street_nft",
  '0',// "Rewards Boost x1.5",
  '260000',// "Liquidation Park_nft",
  '0',// "Disable Rewards for 24h",
  '300000',// "Gemes Kingdom_nft",
  '0',// "Rewards Boost x1.8",
  '360000',// "Alphas Heaven_nft",
  '400000'// "[Redacted]_nft"
]

const RootStyle = styled(Page)({
  height: '100%',
  paddingTop: '100px'
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette?.background.default
}));

// ----------------------------------------------------------------------

export default function GamePage() {
  const dispatch = useDispatch()
  const rollable = useSelector(state => state.manager.rollable)
  const rollFree = useSelector(state => state.manager.rollFree)
  const wallet = useSelector(state => state.manager.wallet)
  const player = useSelector(state => state.manager.player)
  const [rolling, setRolling] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [minting, setMinting] = useState(false)
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    if (wallet) {
      dispatch(setPlayerInfo(wallet))
    }
    setMinting(false)
    let counter = setInterval(() => {
      if (wallet) {
        dispatch(setPlayerInfo(wallet))
      }
    }, 30000);
    return () => clearInterval(counter);
  }, [wallet, player.minted])

  const roll = async () => {
    setRolling(true)
    if (await hasEnoughPoly(wallet, ROLL_FEE)) {
      var audio = new Audio('/static/sound/dice.mp3')
      audio.play()
      let res = await rollDice(wallet)
      if (res) {
        let data = await getPlayerInfo(wallet)
        // while (Number(data.curPos) === player.curPos) {
        //   await sleep(5000)
        //   data = await getPlayerInfo(wallet)
        // }
        if (data) {
          NotificationManager.success(`You rolled ${data.dice}`)
          ///   land farming case
          if (Number(data.curPos) === 2 || Number(data.curPos) === 13) {
            if (Number(data.farming) === 1) {
              dispatch(setModal(true, "Please select any card which you want to move"))
            }
            dispatch(setCaseModal(true, `farming_${data.farming}`))
          } else {
            dispatch(setCaseModal(true, data.curPos))
          }
          notify(data)
        }
        dispatch(setPlayerInfo(wallet))
        audio = new Audio('/static/sound/move.mp3')
        audio.play()
      }
    } else {
      NotificationManager.warning(`You don't have enough POLY to roll dice`)
    }
    setRolling(false)
  }

  const claim = async () => {
    setClaiming(true)
    let res = await claimRewards(wallet)
    if (res) {
      NotificationManager.success(`You claimed ${shortBalance(player.claimableRewards)} $POLY`)
      dispatch(setPlayerInfo(wallet))
    } else {
      NotificationManager.error(`Claimable failed`)
    }
    setClaiming(false)
  }

  const mint = async () => {
    setMinting(true)
    if (await hasEnoughPoly(wallet, NFT_PRICE[player.curPos])) {
      var audio = new Audio('/static/sound/mint.mp3')
      audio.play()
      try {
        let res = await mintNFT(wallet, NFT_PRICE[player.curPos])
        if (res) {
          NotificationManager.success(`You minted ${CASE_POSITION[player.curPos]?.split('_')[0]} NFT`)
          dispatch(setPlayerInfo(wallet))
        } else {
          NotificationManager.error(`Minting failed`)
        }
      } catch (err) {
        console.log(err.message)
        setMinting(false)
      }
    } else {
      NotificationManager.warning(`You don't have ${window.web3.utils.fromWei(NFT_PRICE[player.curPos], 'ether')} $POLY`)
      setMinting(false)
    }
  }

  const chooseProperty = async (pos) => {
    if ((player.curPos === 2 || player.curPos === 13) && player.farming === 1 && !moving) {
      setMoving(true)
      // NotificationManager.success(`You selected ${pos}.`)
      let res = await moveTo(wallet, pos)
      if (res) {
        let data = await getPlayerInfo(wallet)
        // while (Number(data.curPos) === player.curPos) {
        //   await sleep(5000)
        //   data = await getPlayerInfo(wallet)
        // }
        NotificationManager.success(`You moved successfully`)
        notify(data)
        dispatch(setPlayerInfo(wallet))
      }
      setMoving(false)
    }
  }

  const notify = (data) => {
    let curPos = Number(data.curPos)
    ///   passed start case
    if (curPos < player.curPos) {
      NotificationManager.success(`You passed Start case. You got permanent x1.1 rewards bonus.`)
    }
    ///   land farming case
    if (curPos === 2 || curPos === 13) {
      if (data.farming === 0) {
        NotificationManager.success(`You got "Bullish news". This will give you a permanent rewards bonus of x1.05.`)
      } else if (data.farming === 1) {
        NotificationManager.success(`You got "CEX listing". You can move to any case you want. Please choose case.`)
      } else if (data.farming === 2) {
        NotificationManager.success(`You got "Restore rewards". You can restore disabled rewards.`)
      } else if (data.farming === 3) {
        NotificationManager.success(`You got "FUD campaign". Nothing happend.`)
      }
      /// Rewards boost case
    } else if (curPos === 7) {
      NotificationManager.success(`You got x1.2 rewards bonus for 24h.`)
    } else if (curPos === 17) {
      NotificationManager.success(`You got x1.5 rewards bonus for 24h.`)
    } else if (curPos === 21) {
      NotificationManager.success(`You got x1.8 rewards bonus for 24h.`)
      /// Disable rewards case
    } else if (curPos === 19) {
      NotificationManager.success(`This will disable your rewards for 12h.`)
      /// NFT case
    } else if (curPos > 0) {
      NotificationManager.success(`You can mint <${CASE_POSITION[curPos]?.split('_')[0]}>`)
    }

  }

  return (
    <RootStyle title="Arbipoly" id="move_top">
      {/* <Container > */}
      <Stack direction={{ md: 'row', xs: 'column' }} spacing={6} justifyContent='space-between' sx={{ width: '90%', mx: '5%' }}>
        <Stack sx={{ width: { md: '70%', xs: '100%' } }}>
          <Board curPos={player.curPos} onChoose={chooseProperty} />
        </Stack>

        <Stack direction='column' spacing={3} sx={{ width: { md: '30%', xs: '100%' } }}>
          <PlayerInfo />

          {
            (CASE_POSITION[player.curPos]?.split('_')[1] === 'nft' && !player.minted) &&
            <LoadingButton loading={minting} loadingPosition='start' startIcon={<></>} variant='contained' onClick={mint}>
              {`Mint <${CASE_POSITION[player.curPos]?.split('_')[0]}>`}
            </LoadingButton>
          }

          <Stack direction='row' spacing={1} sx={{ width: '100%', border: '1px solid white', padding: 1 }}>
            <LoadingButton loading={rolling} loadingPosition='start' startIcon={<></>} variant='contained' size='large'
              disabled={(!rollable && !rollFree) || rolling} onClick={roll} sx={{ width: '50%', fontSize:'24px' }}>Roll Dice</LoadingButton>

            <LoadingButton loading={claiming} loadingPosition='start' startIcon={<></>} variant='contained' color='error' size='large' disabled={claiming || Number(player.claimableRewards) === 0} onClick={claim} sx={{ width: '50%', fontSize:'24px'  }}>Claim Rewards</LoadingButton>
          </Stack>
        </Stack>
      </Stack>
      {/* </Container> */}
      <CaseModal />
    </RootStyle>
  );
}
