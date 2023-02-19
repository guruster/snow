/* eslint-disable */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// material
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

// ----------------------------------------------------------------------
import { setModal } from '../actions/manager';

const CASE_POSITION = [
    "Start",
    "Rugcity",
    "Farming",
    "Honeypot Land",
    "St Exitscam",
    "Devis Asleep",
    "Softrug Boulevard",
    "Rewards Boost x1.2",
    "Shitcoin Paradise",
    "Whitelisted Street",
    "Ponzi Farm",
    "Degen Area",
    "Ape Territory",
    "Farming",
    "ICO Graveyard",
    "Dinocoins City",
    "Moonshot Street",
    "Rewards Boost x1.5",
    "Liquidation Park",
    "Disable Rewards for 24h",
    "Gemes Kingdom",
    "Rewards Boost x1.8",
    "Alphas Heaven",
    "[Redacted]"
  ]

export default function ModalDialog() {
    const dispatch = useDispatch();
    const open = useSelector(state => state.manager.modalOpen);
    const text = useSelector(state => state.manager.modalText);
    const player = useSelector(state => state.manager.player)

    const handleClose = () => {
        dispatch(setModal(false));
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            {/* <DialogTitle>Use Google's location service?</DialogTitle> */}
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ color: 'white', fontSize: '18px' }}>
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
