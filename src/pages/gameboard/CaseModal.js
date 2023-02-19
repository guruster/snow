/* eslint-disable */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// material
import { Box, Fade, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

// ----------------------------------------------------------------------
import { setCaseModal } from '../../actions/manager';


export default function CaseModal() {
    const dispatch = useDispatch();
    const open = useSelector(state => state.manager.caseModalOpen);
    const curPos = useSelector(state => state.manager.curPos);

    const handleClose = () => {
        dispatch(setCaseModal(false));
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            {/* <DialogTitle>Use Google's location service?</DialogTitle> */}
            {/* <DialogContent> */}
            <Box component='img' src={`/static/card/${curPos}.png`} width='400px' height='680px' />

            {/* </DialogContent> */}
        </Dialog>
    );
}
