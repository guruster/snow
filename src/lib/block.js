/* eslint-disable */
import { TOKEN_ABI, NFT_ABI, ARBIPOLY_ABI } from './abi';
import { sleep } from './utils';

const testavax = 'https://api.eth-test.network/ext/bc/C/rpc'
const mainavax = 'https://api.eth.network/ext/bc/C/rpc'
const rinkebynet = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

const ArbiTestRpc = 'https://goerli-rollup.arbitrum.io/rpc'

const TOKEN_ADDRESS = process.env.REACT_APP_POLYTOKEN
const NFT_ADDRESS = process.env.REACT_APP_POLYNFT
const ARBIPOLY_ADDRESS = process.env.REACT_APP_ARBIPOLY
const ROLL_FEE = Number(process.env.REACT_APP_ROLL_FEE)
const UPGRADE_FEE = Number(process.env.REACT_APP_UPGRADE_FEE)

const BrownFamilyType = 18
const FamilyCount = 7

export const hasEnoughPoly = async (account, poly) => {
    try {
        let balance = await getPolyBalance(account)
        console.log('hasenoughpoly', balance, poly)
        if (balance >= poly) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err.message);
        return false;
    }
}

export const getEthBalance = async (account) => {
    try {
        let balance = await window.web3.eth.getBalance(account)
        return Number(window.web3.utils.fromWei(balance, 'ether'))
    } catch (err) {
        console.log(err.message);
        return '0'
    }
}

export const getPolyBalance = async (account) => {
    try {
        let polyToken = new window.web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS)
        let balance = await polyToken.methods.balanceOf(account).call()
        return Number(window.web3.utils.fromWei(balance, 'ether'))
    } catch (err) {
        console.log(err.message);
        return '0'
    }
}

export const getPlayerInfo = async (account) => {
    while (true) {
        try {
            let arbipoly = new window.web3.eth.Contract(ARBIPOLY_ABI, ARBIPOLY_ADDRESS)
            let player = await arbipoly.methods.getPlayerInfo(account).call()
            let startBonusRate = await arbipoly.methods.startRate().call()
            let bullishBonusRate = await arbipoly.methods.bullishRate().call()
            return { ...player, startBonusRate, bullishBonusRate }
        } catch (err) {
            console.log(err.message);
            await sleep(30000)
        }
    }
}

export const getRollFree = async () => {
    let arbipoly = new window.web3.eth.Contract(ARBIPOLY_ABI, ARBIPOLY_ADDRESS)
    let rollFree = await arbipoly.methods.rollFree().call()
    return rollFree
}

export const getDailyRewards = async (account) => {
    while(true){
        try {
            let arbipoly = new window.web3.eth.Contract(ARBIPOLY_ABI, ARBIPOLY_ADDRESS)
            let dailyRewards = await arbipoly.methods.getLastDailyRewards(account).call()
            return window.web3.utils.fromWei(dailyRewards, 'ether')
        } catch (err) {
            console.log(err.message)
            // await sleep(30000)
            return 0
        }
    }
}

export const getClaimableRewards = async (account) => {
    while(true){
        try {
            let arbipoly = new window.web3.eth.Contract(ARBIPOLY_ABI, ARBIPOLY_ADDRESS)
            let claimableRewards = await arbipoly.methods.calcClaimableRewards(account).call()
            console.log('claimable', claimableRewards)
            return window.web3.utils.fromWei(claimableRewards, 'ether')
        } catch (err) {
            console.log(err.message)
            await sleep(30000)
        }
    }
}

export const rollDice = async (account) => {
    try {
        let polyToken = new window.web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS)

        let allowance

        allowance = Number(window.web3.utils.fromWei(await polyToken.methods.allowance(account, ARBIPOLY_ADDRESS).call()))
        console.log('allowance', allowance)
        
        if (allowance < ROLL_FEE) {
            let polyBalance = await getPolyBalance(account)
            console.log('polybalance', polyBalance)
            let res = await polyToken.methods.approve(ARBIPOLY_ADDRESS, window.web3.utils.toWei(polyBalance.toString(), 'ether')).send({ from: account });
            console.log("approve", res.status);
        }

        let arbipoly = new window.web3.eth.Contract(ARBIPOLY_ABI, ARBIPOLY_ADDRESS)
        let res = await arbipoly.methods.rollDice().send({ from: account })
        return res.status
    } catch (err) {
        console.log(err.message)
        return false
    }
}

export const moveTo = async (account, pos) => {
    try {
        let arbipoly = new window.web3.eth.Contract(ARBIPOLY_ABI, ARBIPOLY_ADDRESS)
        let res = await arbipoly.methods.moveTo(pos).send({
            from: account
        })
        return res.status
    } catch (err) {
        console.log(err.message)
        return false
    }
}

export const claimRewards = async (account) => {
    try {
        let arbipoly = new window.web3.eth.Contract(ARBIPOLY_ABI, ARBIPOLY_ADDRESS)
        let res = await arbipoly.methods.claim().send({ from: account })
        return res.status
    } catch (err) {
        console.log(err.message)
        return false
    }
}

export const mintNFT = async (account, price) => {
    // try {
    let res
    let polyNFT = new window.web3.eth.Contract(NFT_ABI, NFT_ADDRESS)
    let polyToken = new window.web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS)

    let allowance = Number(window.web3.utils.fromWei(await polyToken.methods.allowance(account, NFT_ADDRESS).call()))
    if (allowance < price) {
        let polyBalance = await getPolyBalance(account)
        res = await polyToken.methods.approve(NFT_ADDRESS, window.web3.utils.toWei(polyBalance.toString(), 'ether')).send({ from: account });
        console.log("approve", res.status);
    }
    res = await polyNFT.methods.mintNFT().send({ from: account });
    return res.status
    // } catch (err) {
    //     console.log(err.message)
    //     return false
    // }
}

export const getNFTs = async (account) => {
    try {
        //  type => amounts
        let nftAmounts = new Map()
        let polyNFT = new window.web3.eth.Contract(NFT_ABI, NFT_ADDRESS)
        let nftIds = await polyNFT.methods.tokensOfOwner(account).call()
        for (let i = 0; i < nftIds.length; i++) {
            let nftType = Number(await polyNFT.methods.getTypeOf(nftIds[i]).call())
            let amount = nftAmounts.get(nftType) || 0
            nftAmounts.set(nftType, amount + 1)
        }

        return Array.from(nftAmounts, function (item) {
            return { tokenType: item[0], count: item[1] }
        })
    } catch (err) {
        console.log(err.message)
        return new Map()
    }
}

export const getUpgradableCounts = async (account) => {
    while(true){
        try {
            //  0: brown family upgradable counts, ...
            let upgradableCounts = [0, 0, 0, 0, 0, 0, 0]
            let polyNFT = new window.web3.eth.Contract(NFT_ABI, NFT_ADDRESS)
            for (let i = 0; i < FamilyCount; i++) {
                let count = Number(await polyNFT.methods.getUpgradableCount(account, BrownFamilyType + i).call())
                upgradableCounts[i] = count
            }
            return upgradableCounts
        } catch (err) {
            console.log(err.message)
            await sleep(30000)
        }
    }
}

export const upgradeFamily = async (account, familyType) => {
    try {
        let polyToken = new window.web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS)

        let allowance = Number(window.web3.utils.fromWei(await polyToken.methods.allowance(account, NFT_ADDRESS).call()))
        if (allowance < UPGRADE_FEE) {
            let polyBalance = await getPolyBalance(account)
            let res = await polyToken.methods.approve(NFT_ADDRESS, window.web3.utils.toWei(polyBalance.toString(), 'ether')).send({ from: account });
            console.log("approve", res.status);
        }

        let polyNFT = new window.web3.eth.Contract(NFT_ABI, NFT_ADDRESS)
        let res = await polyNFT.methods.upgrade(account, familyType).send({ from: account })
        return res.status
    } catch (err) {
        console.log(err.message)
        return false
    }
}

export const isBigger = (x, y) => {
    x = x || "0";
    y = y || "0";
    if (x.length > y.length) y = "0".repeat(x.length - y.length) + y;
    else if (y.length > x.length) x = "0".repeat(y.length - x.length) + x;

    for (let i = 0; i < x.length; i++) {
        if (x[i] < y[i]) return -1;
        if (x[i] > y[i]) return 1;
    }
    return 0;
}


export const shortAddress = (address) => {
    if (address !== "" || address !== undefined) {
        let lowCase = address.toLowerCase();
        return "0x" + lowCase.charAt(2).toUpperCase() + lowCase.substr(3, 3) + "..." + lowCase.substr(-4);
    }
    return address;
}

export const shortBalance = (val) => {
    let num = parseFloat(val).toFixed(2)
    return num
}