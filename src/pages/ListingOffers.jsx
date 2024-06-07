import { Box, Button, Grid, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LabelIcon from '@mui/icons-material/Label';
import { styled } from '@mui/material/styles';

import Icon from '../assets/icon.png';

export const ListingOffers = () => {
    const ContainedButton = styled(Button)(({ theme }) => ({
        color: '#262626',
        backgroundColor: '#f4f4f4',
        border: '1px solid #f4f4f4',
        borderRadius: '12px',
        fontWeight: 'bold',
        padding: '5px 72px',
        lineHeight: '24px',
        margin: '8px 16px',
        textTransform: 'none',
        width: '180px',
        float:'right',
        '&:hover': {
            backgroundColor: '#262626',
            color: '#f4f4f4'
        },
    }));

    const listData = [
        {
            serial: '1',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '2',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENG2',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '3',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA3',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '4',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA4',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '5',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA5',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '6',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA6',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '7',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA7',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '18',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA8',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '19',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA9',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '20',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA20',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '13',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA3',
            price: '0.15',
            offerId: '2345'
        },
        {
            serial: '15',
            imageSrc: 'https://static.wikia.nocookie.net/nomanssky_gamepedia/images/c/cc/PRODUCT.HORRIFICARTIFACT.png',
            name: 'RENGA5',
            price: '0.15',
            offerId: '2345'
        }
    ]

    const card = () => {
        return (
            <>
                <Box sx={{width:'100%', maxWidth: '580px', height:'100%', bgcolor:'#6C6C6C', borderRadius:'12px', maxHeight:'660px', ml:'auto', mr:'auto'}}>
                    <Box sx={{p:2}}>
                        <img alt="kjbhv" src={Icon} style={{width:'100%', height:'100%', maxHeight: '320px', objectFit:'cover'}}/>
                    </Box>
                    <Box sx={{display:'flex', justifyContent:'space-between', pl:2, pr:2}}>
                        <div style={{display:'flex'}}>
                            <Typography sx={{fontWeight:'bold', mr: 1}}>PROJECT TITLE</Typography>
                            <VerifiedOutlinedIcon />
                        </div>
                        <FavoriteBorderIcon />
                    </Box>
                    <Typography sx={{pl:2}}>#2156</Typography>
                    <p style={{paddingLeft:'16px', paddingRight:'16px', color:'#262626'}}>owned by <span style={{paddingLeft: '16px', fontWeight:'bold', fontSize: '16px', color:'#fff'}}>OWNER ID</span></p>
                    <p style={{paddingLeft:'16px', paddingRight:'16px', color:'#262626'}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non etiam et turpis elit scelerisque commodo, dignissim. Egestas vitae, lacus, egestas euismod iaculis aenean adipiscing ac. Aliquam vel malesuada ut vulputate nisl, elit. Condimentum libero, tortor urna, aliquam purus.z
                    </p>
                    <div style={{display:'flex', paddingLeft:'16px', color:'#262626', fontSize:'13px', paddingBottom:'16px'}}>
                        <FavoriteIcon fontSize='13px' sx={{mr:1}}/>
                        <span style={{marginRight:'48px', lineHeight:'13px'}}>6 Favourites</span>
                        <RemoveRedEyeIcon fontSize='13px' sx={{mr:1}}/>
                        <span style={{marginRight:'48px', lineHeight:'13px'}}>624 views</span>
                    </div>
                    <div style={{padding:'16px'}}>
                        <Box sx={{border:'1px solid #fff', width:'100%', borderRadius:2, height:'38px', display:'flex', justifyContent:'space-between'}}>
                            <div style={{display:'flex'}}>
                                <LabelIcon sx={{pt:0.5, fontSize:'30px', pl:1}}/>
                                <Typography sx={{lineHeight:'38px', fontSize:'14px', pl:1}}>Properties</Typography>
                            </div>
                            <KeyboardArrowDownIcon sx={{pt:0.5, fontSize:'30px', pr:1}}/>
                        </Box>
                    </div>
                </Box>
            </>
        )
    }

    const offerList = () => {
        return(
            <Box sx={{width:'100%', maxWidth: '580px', height:'100%', border:'1px solid #6C6C6C', borderRadius:'12px', maxHeight:'660px', ml:'auto', mr:'auto'}}>
                <Box sx={{display:'flex', color:'#f4f4f4', p:2}}>
                    <FormatListBulletedIcon />
                    <Typography sx={{pl:2}}>Offers</Typography>
                </Box>
                <Grid container spacing={1} sx={{pl:2, pr:2, '& .MuiGrid-item': {alignSelf:'center'}, maxHeight:'540px', overflow:'scroll'}}>
                    <Grid item xs={4}>
                        <Typography>No</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>Project</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>Floor</Typography>
                    </Grid>
                    {
                        listData.map(item => {
                            return (
                                <>
                                    <Grid item xs={1}>
                                        <Typography>{item.serial}</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <img alt="nsbjhvx" src={item.imageSrc} style={{width:'100px', maxHeight:'100px', objectFit:'cover', borderRadius:'12px'}}/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography sx={{alignSelf:'center'}}>{item.name}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography sx={{alignSelf:'center', color:'#6C6C6C', fontSize:'13px'}}>{item.price} ETH</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography sx={{alignSelf:'center', bgcolor:'#6C6C6C', borderRadius:'12px', textAlign:'center', fontSize:'14px', lineHeight:'27px',height:'27px'}}>{item.offerId}</Typography>
                                    </Grid>
                                </>
                            )
                        })
                    }
                </Grid>
                <ContainedButton variant='outlined'>Offer</ContainedButton>
            </Box>
        )
    }

    return (
        <Box sx={{maxWidth:'1280px', m:'16px auto', height:'100%', color:'#f4f4f4', marginTop:'32px'}}>
            <Typography sx={{mb: 2, fontWeight:'bold'}}>NFT TITLE #2156</Typography>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    {card()}
                </Grid>
                <Grid item xs={12} md={6}>
                    {offerList()}
                </Grid>
            </Grid>
        </Box>
    )
}