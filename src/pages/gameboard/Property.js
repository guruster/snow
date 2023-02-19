/* eslint-disable */
import { Box, Stack, Typography } from "@mui/material";
import { setCaseModal } from '../../actions/manager'
import { useDispatch} from "react-redux";

export default function Property({ width, height, bg, landed, pos, count, onChoose }) {
    const dispatch = useDispatch()

    if (width) {
        return (
            <Stack 
                sx={{
                    width, position: 'relative',
                    transition: 'transform .2s',
                    '&:hover': {
                        transform: 'scale(1.1)'
                    }
                }} onClick={() => {
                    onChoose(pos)
                    dispatch(setCaseModal(true, pos))
                }}>
                <Box component='img' src={bg} />
                <Box className={landed ? 'zoom-in-zoom-out':''} component='img' display={landed ? 'block' : 'none'}  src='/static/pointer.png' sx={{ position: 'absolute' }} />
                <Typography variant='h5' sx={{ position: 'absolute', color:"#00ff37", right: '5%', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>{count ?`x ${count}`:''}</Typography>
            </Stack>
        )
    } else if (height) {
        return (
            <Stack
                sx={{
                    height, position: 'relative',
                    transition: 'transform .2s',
                    '&:hover': {
                        transform: 'scale(1.1)'
                    }
                }} onClick={() => {
                    onChoose(pos)
                    dispatch(setCaseModal(true, pos))
                }}>
                <Box component='img' src={bg} />
                <Box component='img' className={landed ? 'zoom-in-zoom-out':''} display={landed ? 'block' : 'none'}  src='/static/pointer.png' sx={{ position: 'absolute' }} />
                <Typography variant='h5' sx={{ position: 'absolute', color:"#00ff37", right: '5%', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>{count ?`x ${count}`:''}</Typography>
            </Stack>
        )
    }
}