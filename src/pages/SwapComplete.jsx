import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SwapComplete = () => {

    const ContainedButton = styled(Button)(({ theme }) => ({
        color: '#262626',
        backgroundColor: '#f4f4f4',
        border: '1px solid #f4f4f4',
        borderRadius: '12px',
        fontWeight: 'bold',
        padding: '10px 72px',
        lineHeight: '24px',
        margin: '8px 16px',
        textTransform: 'none',
        width: '240px',
        '&:hover': {
            backgroundColor: '#262626',
            color: '#f4f4f4'
        },
    }));

    // const displayCard = () => {
    //     return (
    //         <Box sx={{bgcolor:'#262626', height:'278px', width:'248px', borderRadius:'12px', p:2}}>
    //             <Box sx={{bgcolor:'#6c6c6c', height:'208px',borderRadius:'12px'}}>

    //             </Box>
    //             <Typography sx={{mt:4, fontSize:'16px', pl:1, fontWeight:'700'}}>
    //                 OWNER ID
    //             </Typography>
    //         </Box>
    //     )
    // }

    return (
        <Box sx={{maxWidth:'1280px', m:'16px auto', height:'100%', color:'#f4f4f4'}}>
            <Typography sx={{fontSize:'20px', mt:6, fontWeight:'bold', mb:3}}>
                SWAP COMPLETE
            </Typography>
            <Box sx={{textAlign: 'center', pt: {xs: 3, md: 6}}}>
                <Typography sx={{mt:5, mb:5, fontSize:'24px', fontWeight:'600'}}>CONGRATULATIONS ON YOUR SWAP</Typography>
                <ContainedButton variant='outlined'>Go Back</ContainedButton>
            </Box>
        </Box>
    )
}