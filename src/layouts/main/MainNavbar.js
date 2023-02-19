/* eslint-disable */
import { useEffect, useState } from 'react'
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Web3 from 'web3'
// material
import { styled } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, Link, Stack } from '@mui/material';
import { NotificationManager } from 'react-notifications';

// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// components
import Logo from '../../components/Logo';
import Label from '../../components/Label';
import { MHidden } from '../../components/@material-extend';
//
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';
import ModalDialog from '../../pages/ModalDialog';

// ----------------------------------------------------------------------
import { setWallet, setModal } from '../../actions/manager';
import { shortAddress } from '../../lib/block'

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 88;

const NETWORK = process.env.REACT_APP_NETWORK;
// const CHAIN_ID = process.env.REACT_APP_ARBITRUM_TEST_ID;
const CHAIN_ID = process.env.REACT_APP_ARBITRUM_MAIN_ID;

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: APP_BAR_MOBILE,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  [theme.breakpoints.up('md')]: {
    height: APP_BAR_DESKTOP
  }
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8
}));

// ----------------------------------------------------------------------

export default function MainNavbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isOffset = useOffSetTop(100);
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.manager.wallet)
  const [initWeb3, setInitWeb3] = useState(false);

  useEffect(() => {
    if (window.ethereum && !initWeb3) {
      setInitWeb3(true);
      window.web3 = new Web3(window.ethereum);

      window.ethereum.on('accountsChanged', function (accounts) {
        // if (accounts[0] !== account) {
        console.log("change", accounts[0]);
        conMetamask();
        // }
      });

      window.ethereum.on('networkChanged', function (networkId) {
        if (Number(networkId) !== Number(CHAIN_ID)) {
          dispatch(setWallet(''))
          // dispatch(setModal(true, `Connect to ${NETWORK} network.`));
          NotificationManager.warning(`Connect to ${NETWORK}.`)
          return;
        }
        conMetamask();
      });

      conMetamask();
    } else {
      NotificationManager.warning("Install metamask wallet on your browser")
    }
  }, []);

  /// window.ethereum used to get addrss
  const conMetamask = async (e) => {
    // console.log(e);
    if (window.ethereum) {
      const chainId = await window.ethereum.request({
        method: "eth_chainId"
      });
      if (Number(chainId) !== Number(CHAIN_ID)) {
        console.log(chainId)
        // dispatch(setModal(true, `Connect to ${NETWORK} network on metamask.`));
        NotificationManager.warning(`Connect to ${NETWORK} network.`)
        dispatch(setWallet(''))
        return;
      }
      const accounts = await window.ethereum.enable();
      dispatch(setWallet(accounts[0]))
    } else {
      NotificationManager.warning("Install metamask wallet on your browser")
    }
  }

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            bgcolor: 'background.default',
            height: { md: APP_BAR_DESKTOP - 16 }
          })
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: { md: '3%', xl: '4%' }
          }}
        >
          {/* <RouterLink to="/">
            <Logo />
          </RouterLink> */}
          {/* <Box sx={{ flexGrow: 0.1 }} /> */}
          <Stack direction='row' spacing={1} alignItems='center'>
            <Link href='https://twitter.com/arbipoly' target='_blank'>
              <img src='/static/twitter.svg' width='48px' />
            </Link>
            <Link href='https://t.me/ArbiPoly' target='_blank' width='48px'>
              <img src='/static/telegram.svg' />
            </Link>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />

          <MHidden width="mdDown">
            <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />
          </MHidden>
          <Button variant='contained' onClick={conMetamask}>
            {
              wallet ? shortAddress(wallet) : 'Connect'
            }
          </Button>
          <MHidden width="mdUp">
            <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />
          </MHidden>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
      <ModalDialog />
    </AppBar>
  );
}
