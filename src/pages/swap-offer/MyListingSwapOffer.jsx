/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import ercAbi from "../../abi/erc721.json";
import { Contract } from "@ethersproject/contracts";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { metadataUrl } from "../../utils/format-listings";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { SwapCard } from "./components/swapcard";
import { getNetworkInfo } from "../../connectors/networks";
import {
  setTxDialogFailed,
  setTxDialogHash,
  setTxDialogPending,
  setTxDialogSuccess,
  showTxDialog,
} from "../../redux/slices/app-slice";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

export const MyListingSwapOffer = () => {
  const sendDataToGTM = useGTMDispatch();
  const { listingId, offerNft, offerTokenId, network } = useParams();
  const listings = useSelector((state) => state.listings.allListings);
  const [myNft, setMyNft] = useState();
  const [listingNFT, setListingNFT] = useState();
  const [isApproved, setIsApproved] = useState(false);
  const [offerOwner, setOfferOwner] = useState("");
  const myNfts = useSelector((state) => state.myNFT.nfts);
  const { account, chainId } = useWeb3React();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getApprovedStatus = async () => {
    try {
      const netDetails = getNetworkInfo(network);
      const provider = new JsonRpcProvider(netDetails.dataNetwork.RPC);
      const contract = new Contract(offerNft, ercAbi, provider);
      const status = await contract.isApprovedForAll(
        offerOwner,
        netDetails.dataNetwork.SWAP_CONTRACT
      );
      setIsApproved(status);
    } catch {
      setIsApproved(false);
    }
  };

  const getListingNft = async () => {
    const found = listings.find(
      (x) =>
        x.listingDetails.listingid === Number(listingId) &&
        x.listingDetails.network === network
    );
    if (found) {
      setListingNFT(found);
    }
  };
  const getMyNft = async () => {
    const netDetails = getNetworkInfo(network);
    const found = myNfts.find(
      (x) =>
        Number(x.tokenId) === Number(offerTokenId) &&
        x.contractAddress === offerNft &&
        x.network === network
    );
    if (found) {
      const provider = new JsonRpcProvider(netDetails.dataNetwork.RPC);
      const contract = new Contract(offerNft, ercAbi, provider);
      const owner = await contract.ownerOf(offerTokenId);
      setOfferOwner(owner);
      setMyNft(found);
    } else {
      try {
        const provider = new JsonRpcProvider(netDetails.dataNetwork.RPC);
        const contract = new Contract(offerNft, ercAbi, provider);
        const owner = await contract.ownerOf(offerTokenId);
        setOfferOwner(owner);
        if (account && owner !== account) {
          toast.error("You are not holding the NFT being offered");
          navigate("/");
        }
        const name = await contract.name();
        const uri = await contract.tokenURI(offerTokenId);
        let metadata;
        try {
          const res = await axios.get(metadataUrl(uri));
          metadata = res.data;
        } catch {
          metadata = undefined;
        }
        setMyNft({
          collectionName: name,
          contractAddress: offerNft,
          tokenId: offerTokenId,
          url: uri,
          metadata,
        });
      } catch {}
    }
  };

  useEffect(() => {
    getMyNft();
  }, []);

  useEffect(() => {
    if (account && offerOwner !== "") {
      getApprovedStatus();
    }
  }, [account, offerOwner]);

  useEffect(() => {
    if (listings.length > 0) {
      getListingNft();
    }
  }, [listings]);

  const handleApprove = async () => {
    sendDataToGTM({
      event: "Clicked Approve Swap",
      customData: {
        "Collection Address": listingNFT.listingDetails.tokenAddress,
        "token Id": listingNFT.listingDetails.tokenId,
      },
    });

    const netDetails = getNetworkInfo(network);
    dispatch(showTxDialog());
    try {
      if (chainId !== parseInt(netDetails.dataNetwork.CHAIN_ID)) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [netDetails.switch],
        });
      }
      const provider = new Web3Provider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const contract = new Contract(offerNft, ercAbi, signer);
      //Old code requesting access to ALL NFT's in the collection
      const txResult = await contract.setApprovalForAll(
        netDetails.dataNetwork.SWAP_CONTRACT,
        true
      );
      /* // New code requesting ONLY access to the swapped NFT, as per shivam request 
         // this is rolled back as the contract needs to be modified later on
      const txResult = await contract.approve(
        netDetails.dataNetwork.SWAP_CONTRACT,
        offerTokenId
      );*/
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      toast.success("Approval Successful!");
      setIsApproved(true);
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(false));
    } catch (err) {
      console.log("Error on handleApprove", err);
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(true));
    }
  };

  const handleAddOffer = async () => {
    sendDataToGTM({
      event: "Clicked Offer Button (Swap)",
      customData: {
        "Collection Address": listingNFT.listingDetails.tokenAddress,
        "token Id": listingNFT.listingDetails.tokenId,
      },
    });

    dispatch(showTxDialog());
    const netDetails = getNetworkInfo(network);
    if (chainId !== parseInt(netDetails.dataNetwork.CHAIN_ID)) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [netDetails.switch],
      });
    }
    const provider = new Web3Provider(window.ethereum, "any");
    const signer = await provider.getSigner();
    const contract = new Contract(
      netDetails.dataNetwork.SWAP_CONTRACT,
      netDetails.dataNetwork.SWAP_ABI,
      signer
    );
    const txResult = await contract.createOffer(
      offerTokenId,
      offerNft,
      listingId
    );
    dispatch(setTxDialogHash(txResult.hash));
    await txResult.wait();
    dispatch(setTxDialogSuccess(true));
    dispatch(setTxDialogPending(false));
    dispatch(setTxDialogFailed(false));
    toast.success("Swap offer sent successfully!");
    dispatch({ type: "LOAD_ALL_OFFERS" });

    navigate(
      `/nft/${listingNFT.listingDetails.network}/${listingNFT.listingDetails.tokenAddress}/${listingNFT.listingDetails.tokenId}`
    );
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
      <Typography sx={{ cursor: "pointer" }}>
        <Link
          className="nft-card-link"
          to={
            listingNFT
              ? `/nft/${network}/${listingNFT.listingNFT.contractAddress}/${listingNFT.listingNFT.tokenId}`
              : ""
          }
        >
          {"<"} Back
        </Link>
      </Typography>
      <Typography sx={{ fontSize: "20px", mt: 4, fontWeight: "bold", mb: 2 }}>
        SWAP OFFER{" "}
        {listingNFT
          ? `${listingNFT.listingNFT.name} #${listingNFT.listingDetails.tokenId}`
          : ""}
      </Typography>
      <Grid container sx={{ mt: { xs: 3, md: 6, p: 0 } }}>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              bgcolor: "#262626",
              height: "312px",
              width: "100%",
              borderRadius: "12px",
            }}
          >
            {listingNFT ? (
              <SwapCard
                nft={listingNFT.listingNFT}
                owner={listingNFT.listingDetails.tokenOwner}
              />
            ) : (
              <Box
                width="100%"
                height="100%"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress />
              </Box>
            )}
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
              height: "312px",
              width: "100%",
              borderRadius: "12px",
            }}
          >
            {myNft && myNft.metadata ? (
              <SwapCard owner={offerOwner} nft={myNft} />
            ) : (
              <Box
                width="100%"
                height="100%"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      {account && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            pt: { xs: 3, md: 6 },
          }}
        >
          <ContainedButton
            disabled={isApproved}
            onClick={handleApprove}
            variant="outlined"
          >
            Approve
          </ContainedButton>
          <ContainedButton
            disabled={!isApproved}
            onClick={handleAddOffer}
            variant="outlined"
          >
            Offer
          </ContainedButton>
        </Box>
      )}
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
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#262626",
    color: "#f4f4f4",
  },
}));
