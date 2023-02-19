/* eslint-disable */
import React, { useState } from 'react';

import { Stack, Box } from '@mui/material'

import Property from './Property'
import { useSelector } from 'react-redux';

var Total_Props_Count = 24

var properties = [
    { src: '/static/property/start.png', nftType: 0 },
    { src: '/static/property/rugcity.png', nftType: 1 },
    { src: '/static/property/farming.png', nftType: 0 },
    { src: '/static/property/honeypot_land.png', nftType: 2 },
    { src: '/static/property/st_exitscam.png', nftType: 3 },
    { src: '/static/property/devis_asleep.png', nftType: 4 },
    { src: '/static/property/softrug_boulevard.png', nftType: 5 },
    { src: '/static/property/rewards_102.png', nftType: 0 },
    { src: '/static/property/shitcoin_paradise.png', nftType: 6 },
    { src: '/static/property/whitelisted_street.png', nftType: 7 },
    { src: '/static/property/ponzi_farm.png', nftType: 8 },
    { src: '/static/property/degen_area.png', nftType: 9 },
    { src: '/static/property/ape_territory.png', nftType: 10 },
    { src: '/static/property/farming.png', nftType: 0 },
    { src: '/static/property/ico_graveyard.png', nftType: 11 },
    { src: '/static/property/dinocoins_city.png', nftType: 12 },
    { src: '/static/property/moonshot_street.png', nftType: 13 },
    { src: '/static/property/rewards_105.png', nftType: 0 },
    { src: '/static/property/liquidation_park.png', nftType: 14 },
    { src: '/static/property/disable_rewards.png', nftType: 0 },
    { src: '/static/property/gems_kingdom.png', nftType: 15 },
    { src: '/static/property/rewards_108.png', nftType: 0 },
    { src: '/static/property/alphas_heaven.png', nftType: 16 },
    { src: '/static/property/redacted.png', nftType: 17 }
]

var top_prop_ids = [12, 13, 14, 15, 16, 17, 18, 19]
var left_prop_ids = [11, 10, 9, 8]
var right_prop_ids = [20, 21, 22, 23]
var bottom_prop_ids = [7, 6, 5, 4, 3, 2, 1, 0]

export default function Board({ curPos, onChoose }) {
    const [statProps, setStatProps] = useState(properties)
    const player = useSelector(state => state.manager.player)

    // useEffect(() => {
    //     doDiceRef.current = doDice
    // }, [])

    const getNFTCount = (nftType) => {
        let nfts = player?.nfts
        if (Array.isArray(nfts)) {
            let nft = nfts?.find(nft => nft.tokenType === nftType)
            return nft ? nft.count : 0
        } else {
            return 0
        }
    }


    return (
        <Stack direction='column' spacing={1} sx={{ width: '100%' }}>
            <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
                {
                    top_prop_ids.map((item, index) => (
                        <Property width='12.5%' bg={statProps[item].src} landed={item === curPos} pos={item} key={item} count={getNFTCount(statProps[item].nftType)} onChoose={onChoose} />
                    ))
                }
            </Stack>
            <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
                <Stack direction='column' spacing={1} sx={{ width: '12%' }}>
                    {
                        left_prop_ids.map((item, index) => (
                            <Property height='25%' bg={statProps[item].src} landed={item === curPos} pos={item} key={item} count={getNFTCount(statProps[item].nftType)} onChoose={onChoose} />
                        ))
                    }
                </Stack>
                <Stack sx={{ width: '77%', height: '100%' }}>
                    <Box component='img' src='/static/center.svg' />
                </Stack>
                <Stack direction='column' spacing={1} sx={{ width: '12%' }}>
                    {
                        right_prop_ids.map((item, index) => (
                            <Property height='25%' bg={statProps[item].src} landed={item === curPos} pos={item} key={item} count={getNFTCount(statProps[item].nftType)} onChoose={onChoose} />
                        ))
                    }
                </Stack>
            </Stack>
            <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
                {
                    bottom_prop_ids.map((item, index) => (
                        <Property width='12.5%' bg={statProps[item].src} landed={item === curPos} pos={item} key={item} count={getNFTCount(statProps[item].nftType)} onChoose={onChoose} />
                    ))
                }
            </Stack>
        </Stack>
    )
}