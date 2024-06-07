/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import ercAbi from "./../abi/erc721.json";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { formatOffers, metadataUrl, formatListings } from "../utils/format-listings";
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { getImageUrl } from "../utils/string-util";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllTrades } from "../redux/thunk/get-trades";
import { ArrowBack } from "@mui/icons-material";
import { getNetworkInfo } from "../connectors/networks";
import { setTxDialogFailed, setTxDialogHash, setTxDialogPending, setTxDialogSuccess, showTxDialog } from "../redux/slices/app-slice";
const noImage =
  "data:image/png;base64,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";

export const SingleSwapOffer = () => {
  const { offerId, network } = useParams();
  const [listingObj, setListingObj] = useState();
  const [offerObj, setOfferObj] = useState();
  const [obj, setObj] = useState();
  const { account , chainId} = useWeb3React();
  const [isListingCancelled, setIsListingCancelled] = useState(false);
  const navigate = useNavigate();
  const getdetails = async () => {
    const netDetails = getNetworkInfo(network)
    const provider = new JsonRpcProvider(netDetails.dataNetwork.RPC);
    try {
      const contract = new Contract(netDetails.dataNetwork.SWAP_CONTRACT, netDetails.dataNetwork.SWAP_ABI, provider);
      let offer = await contract.readOfferById(offerId);
      offer = formatOffers([offer])[0];
      const {
        listingTokenAddress,
        offerTokenAddress,
        offerTokenOwner,
        listingTokenOwner,
        listingTokenId,
        offerTokenId,
        listingId,
      } = offer;
      setObj(offer);

      //Listing validity
      let listingValidityObj = await contract.readListingById(listingId);
      listingValidityObj = formatListings([listingValidityObj])[0];
      listingValidityObj.isCancelled ? setIsListingCancelled(true) : setIsListingCancelled(false);

      //Listing
      const listContract = new Contract(listingTokenAddress, ercAbi, provider);
      const listCollName = await listContract.name();
      const listUri = await listContract.tokenURI(listingTokenId);
      let listMeta;
      try {
        const result = await axios.get(metadataUrl(listUri));
        listMeta = result.data;
      } catch {
        listMeta = {
          image: noImage,
          name: listCollName,
          description: "",
        };
      }

      setListingObj({
        name: listCollName,
        metadata: listMeta,
        tokenId: listingTokenId,
        owner: listingTokenOwner,
        address: listingTokenAddress,
      });
     
      // Offer
      const offerContract = new Contract(offerTokenAddress, ercAbi, provider);
      const offerCollName = await offerContract.name();
      const offerUri = await offerContract.tokenURI(offerTokenId);
      let offerMeta;
      try {
        const result = await axios.get(metadataUrl(offerUri));
        offerMeta = result.data;
      } catch {
        offerMeta = {
          image: noImage,
          name: offerCollName,
          description: "",
        };
      }

      setOfferObj({
        name: offerCollName,
        metadata: offerMeta,
        tokenId: offerTokenId,
        owner: offerTokenOwner,
        address: offerTokenAddress,
      });

     
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getdetails();
  }, []);
  const dispatch = useDispatch();

  const handleDecline = async () => {
    try {
      dispatch(showTxDialog());
      const netDetails  = getNetworkInfo(network);
      if(chainId !== parseInt(netDetails.dataNetwork.CHAIN_ID)){
        await window.ethereum.request({method: "wallet_addEthereumChain", params: [netDetails.switch]})
      }
      const provider = new Web3Provider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const contract = new Contract(netDetails.dataNetwork.SWAP_CONTRACT, netDetails.dataNetwork.SWAP_ABI, signer);
      const txResult = await contract.declineOffer(obj.offerId, obj.listingId);
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      toast.success("Decline Offer Successful!");
      dispatch(setTxDialogSuccess(true));
        dispatch(setTxDialogPending(false));
        dispatch(setTxDialogFailed(false));
      dispatch({ type: "LOAD_ALL_OFFERS" });
      dispatch({ type: "LOAD_ALL_LISTING" });
      dispatch(getAllTrades());
      getdetails();
    } catch (err) {
      toast.error(err);
      dispatch(setTxDialogSuccess(false));
        dispatch(setTxDialogPending(false));
        dispatch(setTxDialogFailed(true));
    }
  };

  const handleRemoveOffer = async () => {
    try {
      dispatch(showTxDialog());
      const netDetails  = getNetworkInfo(network);
      if(chainId !== parseInt(netDetails.dataNetwork.CHAIN_ID)){
        await window.ethereum.request({method: "wallet_addEthereumChain", params: [netDetails.switch]})
      }
      const provider = new Web3Provider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const contract = new Contract(netDetails.dataNetwork.SWAP_CONTRACT, netDetails.dataNetwork.SWAP_ABI, signer);
      const txResult = await contract.removeOfferById(obj.offerId);
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      toast.success("Withdraw Offer Successful!");
      dispatch({ type: "LOAD_ALL_OFFERS" });
      dispatch({ type: "LOAD_ALL_LISTING" });
      dispatch(getAllTrades());
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(false));
      getdetails();
    } catch (err) {
      toast.error(err);
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(true));
    }
  };

  const handleComplete = async () => {
    try {
      dispatch(showTxDialog());
      const netDetails  = getNetworkInfo(network);
      if(chainId !== parseInt(netDetails.dataNetwork.CHAIN_ID)){
        await window.ethereum.request({method: "wallet_addEthereumChain", params: [netDetails.switch]})
      }
      const provider = new Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(netDetails.dataNetwork.SWAP_CONTRACT, netDetails.dataNetwork.SWAP_ABI, signer);
      const txResult = await contract.acceptOffer(obj.offerId, obj.listingId);
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(false));
      toast.success("Swap Successful!");
      dispatch({ type: "LOAD_ALL_OFFERS" });
      dispatch({ type: "LOAD_ALL_LISTING" });
      getdetails();
    } catch (err) {
      toast.error("Request Failed!");
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(true));
    }
  };
  return (
    <Box
      sx={{
        maxWidth: "1280px",
        m: "16px auto",
        height: "100%",
        minHeight: "65vh",
        color: "#f4f4f4",
        marginTop: "32px",
      }}
    >
      <Typography sx={{ fontSize: "20px", mt: 4, fontWeight: "bold", mb: 2 }}>
        SWAP OFFER #{obj ? obj.offerId : ""}
      </Typography>
      {obj && !showButtons(obj) && (
        <Box>
          {obj.isDeclined && (
            <Alert severity="error">
              This offer has been <b>declined</b>
            </Alert>
          )}
          {obj.isCancelled && (
            <Alert severity="error">
              This offer has been <b>withdrawn.</b>
            </Alert>
          )}
          {obj.isCompleted && (
            <Alert severity="success"> Swap Successful!</Alert>
          )}

          
        </Box>

      )}
      <Box>
      {
            isListingCancelled && (
              <Alert severity="error"> This listing is cancelled so offer is disabled!</Alert>
            )
          }
      </Box>
      <Grid container sx={{ mt: { xs: 3, md: 6, p: 0 } }}>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              bgcolor: "#262626",
              height: "100%",
              minHeight: "312px",
              width: "100%",
              borderRadius: "12px",
            }}
          >
            {listingObj && <DisplayCard offer={listingObj} />}
          </Box>
        </Grid>
        <Grid item xs={12} md={2} sx={{ alignSelf: "center" }}>
          <div
            style={{
              width: "53px",
              height: "53px",
              background: "#F4F4F4",
              borderRadius: "26px",
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <CachedIcon sx={{ color: "#262626", mt: 1 }} fontSize="large" />
          </div>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              bgcolor: "#262626",
              height: "100%",
              minHeight: "312px",
              width: "100%",
              borderRadius: "12px",
            }}
          >
            {offerObj && <DisplayCard offer={offerObj} />}
          </Box>
        </Grid>
      </Grid>

      {obj && showButtons(obj) && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            pt: { xs: 3, md: 6 },
          }}
        >
          {obj && (
            <>
              {account && obj.listingTokenOwner === account && (
                <>
                  <ErrorButton
                    onClick={handleDecline}
                    color="error"
                    variant="contained"
                  >
                    Decline Offer
                  </ErrorButton>
                  <ContainedButton onClick={handleComplete} variant="outlined">
                    SWAP
                  </ContainedButton>
                </>
              )}
            </>
          )}
          {obj && (
            <>
              {account && obj.offerTokenOwner === account && !isListingCancelled  && (
                <>
                  <ErrorButton onClick={handleRemoveOffer} color="error" variant="contained">
                    Withdraw Offer
                  </ErrorButton>
                </>
              )}
            </>
          )}
          
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          pt: { xs: 3, md: 6 },
        }}
      >
        <ContainedButton onClick={() => navigate(-1)} startIcon={<ArrowBack />} variant="outlined">
          Go Back
        </ContainedButton>
      </Box>
    </Box>
  );
};

const DisplayCard = (props) => {
  return (
    <Box
      sx={{
        bgcolor: "#262626",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <Grid container sx={{ "& .MuiGrid-item": { p: 0 } }}>
        <Grid item xs={4} sx={{ m: 2 }}>
          <Box
            sx={{
              bgcolor: "#6c6c6c",
              height: "156px",
              width: "156px",
              borderRadius: "12px",
            }}
          >
            <img
              style={{
                height: "156px",
                width: "156px",
              }}
              src={getImageUrl(props.offer.metadata.image)}
              alt={props.offer.name}
            />
          </Box>
        </Grid>
        <Grid item xs={7} sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: "bold" }}>
            {props.offer.metadata.name}
          </Typography>
          <Typography variant="subtitle1">#{props.offer.tokenId}</Typography>
          <Typography variant="caption">
            {props.offer.metadata.description}
          </Typography>
        </Grid>
      </Grid>
      <Typography sx={{ mt: 3, fontSize: "16px", pl: 2, fontWeight: "700" }}>
        OWNER ID
      </Typography>
      <Typography
        sx={{
          m: "16px 16px",
          bgcolor: "#262626",
          color: "#f4f4f4",
          borderRadius: "12px",
          lineHeight: "36px",
          pl: 2,
        }}
      >
        {props.offer.owner}
      </Typography>
    </Box>
  );
};

const ContainedButton = styled(Button)(({ theme }) => ({
  color: "#262626",
  backgroundColor: "#f4f4f4",
  border: "1px solid #f4f4f4",
  borderRadius: "12px",
  padding: "10px 72px",
  lineHeight: "24px",
  margin: "8px 16px",
  width: "248px",
  "&:hover": {
    backgroundColor: "#262626",
    color: "#f4f4f4",
  },
}));
const ErrorButton = styled(Button)(({ theme }) => ({
  border: "1px solid #f4f4f4",
  borderRadius: "12px",
  padding: "10px 72px",
  lineHeight: "24px",
  margin: "8px 16px",
  "&:hover": {
    backgroundColor: "#262626",
    color: "#f4f4f4",
  },
}));

function showButtons(offer) {
  if (offer.isCompleted || offer.isCancelled || offer.isDeclined) {
    return false;
  } else {
    return true;
  }
}
