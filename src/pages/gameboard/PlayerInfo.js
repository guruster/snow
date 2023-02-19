/* eslint-disable */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
/////   Mui
import { styled, Stack, Typography, TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { NotificationManager } from 'react-notifications';
////    Action
import { setPlayerInfo, setRollable } from "../../actions/manager";
import { shortBalance, upgradeFamily, hasEnoughPoly } from "../../lib/block";
////    Component
import { InfoTitle, InfoValue, InfoUnit } from "../StyledComponent";

const ROLL_DURATION = Number(process.env.REACT_APP_ROLL_DURATION)
// const ROLL_DURATION = 10 // 10 seconds
const UPGRADE_FEE = Number(process.env.REACT_APP_UPGRADE_FEE)

const CaseType = [
    "NFT",
    "Start",
    "Farming",
    "Rewards Boost x1.2",
    "Rewards Boost x1.5",
    "DisableRewards",
    "Rewards Boost x1.8"
]

const BoostType = [
    "Rewards Boost x1.2",
    "Rewards Boost x1.5",
    "Rewards Boost x1.8"
]

const TokenType = [
    'None',
    'Rugcity',//------    Case    --------//
    'Honeypot Land',

    'St Exitscam',
    'Devis Asleep',
    'Softrug Boulevard',

    'Shitcoin Paradise',
    'Whitelisted Street',

    'Ponzi Farm',
    'Degen Area',
    'Ape Territory',

    'Ico Graveyard',
    'Dinocoins City',
    'Moonshot Street',

    'Liquidation Park',
    'Gemes Kingdom',

    'Goblin Town',
    '[Redacted]',

    'Brown Family',//------    Family------------//
    'Grey Family',
    'Purple Family',
    'Orange Family',
    'Red Family',
    'Yellow Family',
    'Blue Family'
]

const BrownFamilyType = 18



const NFTViewer = ({ nftData, upgradableCounts }) => {
    const dispatch = useDispatch()
    const wallet = useSelector(state => state.manager.wallet)
    const [upgrading, setUpgrading] = useState(false)
    const [familyType, setFamilyType] = useState(BrownFamilyType)

    useEffect(() => {
        if (upgradableCounts[familyType - BrownFamilyType] === 0) {
            setUpgrading(false)
        }
    }, [upgradableCounts[familyType - BrownFamilyType]])

    const upgrade = async (familyType) => {
        setUpgrading(true)
        setFamilyType(familyType)
        try {
            if (await hasEnoughPoly(wallet, UPGRADE_FEE)) {
                let res = await upgradeFamily(wallet, familyType)
                var audio = new Audio('/static/sound/mint.mp3')
                audio.play()
                if (res) {
                    NotificationManager.success(`Upgraded to ${TokenType[familyType]}`)
                    dispatch(setPlayerInfo(wallet))
                } else {
                    NotificationManager.error(`Upgrade failed`)
                    setUpgrading(false)
                }
            } else {
                NotificationManager.warning(`You don't have enough POLY to upgrade family`)
            }
        } catch (err) {
            console.log(err.message)
            setUpgrading(false)
        }
    }

    return (
        <Stack direction='column' spacing={1} alignItems='center'
            sx={{
                backgroundColor: '#2e2e2e',
                borderRadius: '5px',
            }}>
            <InfoTitle variant="h5">
                - Your NFTs -
            </InfoTitle>
            <TableContainer component={Paper} sx={{ mt: "20px", backgroundColor: '#1a2e4c' }}>
                <Table aria-label="simple table">
                    <TableBody>
                        {nftData?.map(nft => (
                            <TableRow
                                key={nft.tokenType}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'whtie' }}
                            >
                                {/* <TableCell align="left"><img src={`/static/nft/${nft.tokenType - 1}.png`} width="30px" height="30px" /> </TableCell> */}
                                <TableCell align="left" sx={{ padding: '0px' }}>
                                    <InfoTitle variant='body1'>
                                        {`${TokenType[nft.tokenType]}`}
                                    </InfoTitle>
                                </TableCell>
                                <TableCell align="left" sx={{ fontFamily: "Comfortaa", color: "white", padding: '0px' }}>
                                    <InfoValue variant="h6">
                                        {`x ${nft.count}`}
                                    </InfoValue>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <Stack direction='column'> */}
            {
                upgradableCounts?.map((item, index) => {
                    if (item > 0) {
                        return <LoadingButton loading={upgrading} loadingPosition='start' startIcon={<></>} variant='contained' key={index} sx={{ fontSize:'24px' }} onClick={e => upgrade(BrownFamilyType + index)}>
                            {`Upgrade to ${TokenType[BrownFamilyType + index]} x${item}`}
                        </LoadingButton>
                    } else {
                        <></>
                    }
                }
                )
            }
            {/* </Stack> */}
        </Stack>
    )
}

export default function PlayerInfo() {
    const dispatch = useDispatch()
    const player = useSelector(state => state.manager.player)

    const [counter, setCounter] = useState()
    const [rollCounter, setRollCounter] = useState(null)
    const [disableCounter, setDisableCounter] = useState(null)
    const [boostCounters, setBoostCounters] = useState([])

    useEffect(() => {
        // if (player.lastRollTime) {
        if (counter) {
            clearInterval(counter)
        }
        setCounter(setInterval(() => setNewTime(), 1000));
        return () => clearInterval(counter);
        // }
    }, [player.lastRollTime, player.boostRewards?.length, player.disableStartTime])

    const setNewTime = () => {
        ///     roll counter
        {
            const startTime = new Date((player.lastRollTime + ROLL_DURATION) * 1000);
            const endTime = new Date();
            const distanceToNow = startTime - endTime;

            if (distanceToNow > 0) {
                const getHours = `0${Math.floor((distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2);
                const getMinutes = `0${Math.floor((distanceToNow % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2);
                const getSeconds = `0${Math.floor((distanceToNow % (1000 * 60)) / 1000)}`.slice(-2);

                setRollCounter({
                    hours: getHours || '000',
                    minutes: getMinutes || '000',
                    seconds: getSeconds || '000'
                });
            } else {
                dispatch(setRollable(true))
                setRollCounter(null)
            }
        }
        // disable counter
        {
            const startTime = new Date((player.disableStartTime + player.disableRemainTime) * 1000);
            const endTime = new Date();
            const distanceToNow = startTime - endTime;

            if (distanceToNow > 0) {
                const getHours = `0${Math.floor((distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2);
                const getMinutes = `0${Math.floor((distanceToNow % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2);
                const getSeconds = `0${Math.floor((distanceToNow % (1000 * 60)) / 1000)}`.slice(-2);

                setDisableCounter({
                    hours: getHours || '000',
                    minutes: getMinutes || '000',
                    seconds: getSeconds || '000'
                });
            } else {
                setDisableCounter(null)
            }
        }
        // Boost counter
        {
            let counters = []
            for (let i = 0; i < player.boostRewards?.length / 3; i++) {
                const startTime = new Date((player.boostRewards[i * 3 + 1] + player.boostRewards[i * 3 + 2]) * 1000);
                const endTime = new Date();
                const distanceToNow = startTime - endTime;

                if (distanceToNow > 0) {
                    const getHours = `0${Math.floor((distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2);
                    const getMinutes = `0${Math.floor((distanceToNow % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2);
                    const getSeconds = `0${Math.floor((distanceToNow % (1000 * 60)) / 1000)}`.slice(-2);

                    counters.push({
                        hours: getHours || '000',
                        minutes: getMinutes || '000',
                        seconds: getSeconds || '000'
                    });
                } else {
                    counters.push({
                        hours: '0',
                        minutes: '0',
                        seconds: '0'
                    });
                }
            }
            setBoostCounters(counters)
        }
    };

    return (
        <Stack direction='column' spacing={2}>
            <Stack direction='column'>
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                    <InfoTitle variant='h6'>
                        Balance:
                    </InfoTitle>
                    <Stack direction='row' spacing={1}>
                        <InfoValue variant='h4'>
                            {`${shortBalance(player?.ethBalance)}`}
                        </InfoValue>
                        <InfoUnit variant='h6'>
                            {` ETH `}
                        </InfoUnit>
                        <InfoValue variant='h4'>
                            {`${shortBalance(player?.polyBalance)}`}
                        </InfoValue>
                        <InfoUnit variant='h6'>
                            {` $POLY`}
                        </InfoUnit>
                    </Stack>
                </Stack>
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                    <InfoTitle variant='h6'>
                        {`Total Claimed Rewards: `}
                    </InfoTitle>
                    <Stack direction='row' spacing={1}>
                        <InfoValue variant="h4">
                            {`${shortBalance(player?.rewardClaimed)}`}
                        </InfoValue>
                        <InfoUnit variant='h6'>
                            {` $POLY`}
                        </InfoUnit>
                    </Stack>
                </Stack>
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                    <InfoTitle variant='h6'>
                        {`Daily Rewards: `}
                    </InfoTitle>
                    <Stack direction='row' spacing={1}>
                        <InfoValue variant="h4">
                            {`${shortBalance(player?.dailyRewards)}`}
                        </InfoValue>
                        <InfoUnit variant='h6'>
                            {` $POLY`}
                        </InfoUnit>

                    </Stack>
                </Stack>
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                    <InfoTitle variant='h6'>
                        {`Claimable Rewards: `}
                    </InfoTitle>
                    <Stack direction='row' spacing={1}>

                        <InfoValue variant="h4">
                            {`${shortBalance(player?.claimableRewards)}`}
                        </InfoValue>
                        <InfoUnit variant='h6'>
                            {` $POLY`}
                        </InfoUnit>
                    </Stack>
                </Stack>

                {
                    disableCounter &&
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h6'>
                            {`Disable Rewards for: `}
                        </InfoTitle>
                        <InfoValue variant="h4">
                            {`${disableCounter.hours} : ${disableCounter.minutes} : ${disableCounter.seconds}`}
                        </InfoValue>
                    </Stack>
                }
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                    <InfoTitle variant='h6'>
                        {`Start Rewards Boost: `}
                    </InfoTitle>
                    <InfoValue variant="h4">
                        {`${player?.startBonusRate || 0} x ${player?.startBonusCounts || 0} times -> ${Math.pow(player?.startBonusRate || 0, player?.startBonusCounts || 0).toFixed(2)}`}
                    </InfoValue>
                </Stack>
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                    <InfoTitle variant='h6'>
                        {`Bullish News Rewards Boost: `}
                    </InfoTitle>
                    <InfoValue variant="h4">
                        {`${player?.bullishBonusRate || 0} x ${player?.bullishBonusCounts || 0} times -> ${Math.pow(player?.bullishBonusRate || 0, player?.bullishBonusCounts || 0).toFixed(2)}`}
                    </InfoValue>
                </Stack>
                {
                    boostCounters.map((boost, index) => {
                        if (boost.hours !== '0' && boost.minutes !== '0' && boost.seconds !== '0') {
                            return (
                                <Stack direction='row' spacing={1} alignItems='center' key={index} justifyContent='space-between'>
                                    <InfoTitle variant='h6'>
                                        {`${BoostType[index]}: `}
                                    </InfoTitle>
                                    <InfoValue variant="h4">
                                        {`${boost.hours} : ${boost.minutes} : ${boost.seconds}`}
                                    </InfoValue>
                                </Stack>
                            )
                        }
                    }
                    )
                }
                {
                    rollCounter &&
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h6'>
                            {`Next Roll After:  `}
                        </InfoTitle>
                        <InfoValue variant="h4">
                            {`${rollCounter.hours} : ${rollCounter.minutes} : ${rollCounter.seconds}`}
                        </InfoValue>
                    </Stack>
                }
            </Stack>
            <NFTViewer nftData={Array.isArray(player.nfts) ? player.nfts : []} upgradableCounts={player.upgradableCounts} />
        </Stack >
    )
}