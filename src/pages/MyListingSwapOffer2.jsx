import { Box, Button, Grid, Typography } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { styled } from '@mui/material/styles';

export const MyListingSwapOffer2 = () => {

    const ContainedButton = styled(Button)(({ theme }) => ({
        color: '#262626',
        backgroundColor: '#f4f4f4',
        border: '1px solid #f4f4f4',
        borderRadius: '12px',
        padding: '10px 72px',
        lineHeight: '24px',
        margin: '8px 16px',
        width: '248px',
        fontWeight:'bold',
        '&:hover': {
            backgroundColor: '#262626',
            color: '#f4f4f4'
        },
    }));

    const value1 = [
        {
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            title: '8126',
            quantity: '1'
        },
        {
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            title: '8127',
            quantity: '2'
        }
    ]

    const displayCard = () => {
        return (
            <Box sx={{bgcolor:'#262626', height:'100%', maxHeight:'540px', width:'100%', borderRadius:'12px'}}>
                <Grid container sx={{'& .MuiGrid-item': {p:0}, maxHeight:'400px', overflow:'scroll'}}>
                    {
                        value1.map(item => {
                            return (
                                <>
                                     <Grid item xs={4} sx={{m:2}}>
                                        <Box sx={{bgcolor:'#6c6c6c', height:'156px', width:'156px', borderRadius:'12px'}}>
                                            <img alt="ljkhj" src={item.imageSrc} style={{height:'156px', width:'156px', borderRadius:'12px'}}/>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sx={{mt: 2}}>
                                        <Typography sx={{fontWeight:'bold'}}>Project Title</Typography>
                                        <Typography variant='subtitle1'>#{item.title}</Typography>
                                    </Grid>
                                    <Grid item xs={1} sx={{alignSelf:'end', mb:2}}>
                                        <Typography sx={{height:'34px', bgcolor:'#f4f4f4', width:'34px', borderRadius:'12px', color:'#262626', textAlign:'center', fontSize:'20px'}}>{item.quantity}</Typography>
                                    </Grid>
                                </>
                            )
                        })
                    }
                </Grid>
                <Typography sx={{mt:3, fontSize:'16px', pl:2, fontWeight:'700'}}>
                    SWAPPER ID
                </Typography>
                <Typography sx={{m: '16px 16px', bgcolor:'#262626', color:'#f4f4f4', borderRadius:'12px', lineHeight: '36px', pl: 2, mb:2}}>
                    your wallet 810r1jf01fj 1k10i018289d
                </Typography>
            </Box>
        )
    }

    const displayCardSingle = () => {
        return (
            <Box sx={{bgcolor:'#262626', height:'312px', width:'100%', borderRadius:'12px'}}>
                <Grid container sx={{'& .MuiGrid-item': {p:0}}}>
                    <Grid item xs={4} sx={{m:2}}>
                        <Box sx={{bgcolor:'#6c6c6c', height:'156px', width:'156px', borderRadius:'12px'}}>

                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{mt: 2}}>
                        <Typography sx={{fontWeight:'bold'}}>Project Title</Typography>
                        <Typography variant='subtitle1'>#8126</Typography>
                    </Grid>
                    <Grid item xs={1} sx={{alignSelf:'end', mb:2}}>
                        <Typography sx={{height:'34px', bgcolor:'#f4f4f4', width:'34px', borderRadius:'12px', color:'#262626', textAlign:'center', fontSize:'20px'}}>1</Typography>
                    </Grid>
                </Grid>
                <Typography sx={{mt:3, fontSize:'16px', pl:2, fontWeight:'700'}}>
                    OWNER ID
                </Typography>
                <Typography sx={{m: '16px 16px', bgcolor:'#262626', color:'#f4f4f4', borderRadius:'12px', lineHeight: '36px', pl: 2}}>
                    your wallet 810r1jf01fj 1k10i018289d
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{maxWidth:'1280px', m:'16px auto', height:'100%', color:'#f4f4f4', marginTop:'32px'}}>
            <Typography sx={{cursor: 'pointer'}}>
                {'<'} Back
            </Typography>
            <Typography sx={{fontSize:'20px', mt:4, fontWeight:'bold', mb:2}}>
                SWAP OFFER NFT TITLE #8192
            </Typography>
            <Grid container sx={{mt:{xs: 3, md:6}}}>
                <Grid item xs={12} md={5}>
                    {displayCard()}
                </Grid>
                <Grid item xs={12} md={2} sx={{alignSelf:'center'}}>
                    <div style={{
                        width: '53px', height: '53px', background: '#F4F4F4', borderRadius: '26px', textAlign:'center',marginLeft:'auto', marginRight:'auto'
                    }}>
                        <CachedIcon sx={{color:'#262626', mt:1}} fontSize='large'/>
                    </div>
                </Grid>
                <Grid item xs={12} md={5}>
                    {displayCardSingle()}
                </Grid>
            </Grid>
            <Box sx={{display:'flex', flexWrap:'wrap', justifyContent: 'center', pt: {xs: 3, md: 6}}}>
                <ContainedButton variant='outlined'>Offer</ContainedButton>
            </Box>
        </Box>
    )
}