/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { swapAbi } from "../../connectors/address";
import { Contract } from "@ethersproject/contracts";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { NFTDetails } from "../../components/nft-details";
import { NFTCardDetails } from "../../components/nft-card-details";
import { OfferList } from "../../components/offer-list/offer-list";
import { ListNFTDialog } from "./dialogs/list-nft-dlg";
import { toast } from "react-toastify";
import { OfferNFTDialog } from "./dialogs/offer-nft-dlg";
import { getNetworkInfo } from "../../connectors/networks";
import {
  setTxDialogFailed,
  setTxDialogHash,
  setTxDialogPending,
  setTxDialogSuccess,
  showTxDialog,
} from "../../redux/slices/app-slice";
import { SendNFT } from "./dialogs/send-nft";
import { NFTDiscussions } from "../../components/discussions/nft-discussions";

import { getCommonNFTDetail } from "../../redux/thunk/getNftDetail";
import { SellNFT } from "./dialogs/nft-sell";
import { parseUnits } from "@ethersproject/units";
import { Container } from "react-bootstrap";
import { styled } from "@mui/system";

import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

//create your forceUpdate hook
function useForceUpdate() {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}

export const NFTView = () => {
  const { network, address, tokenId } = useParams();
  const sendDataToGTM = useGTMDispatch();
  const [market, setMarket] = useState();
  const [listDlgOpen, setListDlgOpen] = useState(false);
  const [offerDlgOpen, setOfferDlgOpen] = useState(false);
  const [metadata, setMetadata] = useState();
  const marketItems = useSelector((state) => state.market.markets);
  const [collectionName, setCollectionName] = useState("");
  const [owner, setOwner] = useState("");
  // const [network, setNetwork] = useState("");
  const [isListed, setListed] = useState(false);
  const [listing, setListing] = useState();
  const { account, chainId } = useWeb3React();
  const [sendOpen, setSendOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [isUpdatePrice, setIsUpdatePrice] = useState(false);
  const listings = useSelector((state) => state.listings.allListings);
  const loading = useSelector((state) => state.app.isLoading);
  const forceUpdate = useForceUpdate();
  const dispatch = useDispatch();

  const styles = {
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 3,
    },
    orangeButton: {
      width: "100%",
      backgroundColor: "#F78C09",
      boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.25)",
      borderRadius: ".625rem",
      color: "#262626",
      fontSize: "1rem",
      fontWeight: 600,
      mb: 2,
    },
  };

  const getDetailsFromContract = async () => {
    try {
      const netDetails = getNetworkInfo(network);
      const provider = new JsonRpcProvider(netDetails.dataNetwork.RPC);
      const contract = new Contract(
        address,
        netDetails.dataNetwork.ERC_ABI,
        provider
      );
      let url = await contract.tokenURI(tokenId);
      url = metaUrl(url);
      let meta;
      try {
        const result = await axios.get(url);
        meta = result.data;
      } catch (e) {
        meta = undefined;
      }
      const name = await contract.name();
      const ownerAddress = await contract.ownerOf(tokenId);

      setOwner(ownerAddress);
      setCollectionName(name);
      setMetadata(meta);
    } catch {}
  };

  const getDetailsFromSite = async () => {
    const nftDetails = await getCommonNFTDetail({
      contractAddress: address,
      tokenId: tokenId,
    });

    if (nftDetails) {
      setOwner(nftDetails.wallet_address || "");
      setCollectionName(nftDetails.collection_name || "");
      setMetadata(nftDetails.metadata);
      // setNetwork(nftDetails.network || "");
    } else {
      getDetailsFromContract();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getDetailsFromSite();
  }, []);

  useEffect(() => {
    if (listings.length > 0 && address && tokenId) {
      const found = listings.find(
        (x) =>
          x.listingDetails.tokenAddress.toLowerCase() ===
            address.toLowerCase() &&
          x.listingDetails.tokenId === Number(tokenId) &&
          x.listingDetails.isCompleted === false &&
          x.listingDetails.isCancelled === false
      );
      if (found) {
        console.log("found", found);
        setListed(true);
        setListing(found);
      }
    }
  }, [listings, address, tokenId]);

  useEffect(() => {
    if (marketItems.length > 0) {
      const index = marketItems.findIndex(
        (obj) =>
          !obj.isSold &&
          obj.tokenId === Number(tokenId) &&
          obj.nftContract === address &&
          obj.network === network
      );
      setMarket(marketItems[index]);
    }
  }, [network, marketItems]);

  const handleOfferSwap = () => {
    if (account) {
      sendDataToGTM({
        event: "Clicked Offer Swap CTA",
        customData: {
          "Collection Address": address,
          "token Id": tokenId,
        },
      });

      if (account.toLowerCase() !== owner.toLowerCase()) {
        setOfferDlgOpen(true);
      }
    } else {
      toast.info("Please connect your wallet!");
    }
  };

  const handleUpdatePrice = async () => {
    setIsUpdatePrice(true);
    setSellOpen(true);
  };

  const handleRemoveNFT = async () => {
    try {
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
        swapAbi,
        signer
      );
      const txResult = await contract.removeListingById(
        listing.listingDetails.listingid
      );
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      dispatch({ type: "LOAD_ALL_LISTING" });
      setListed(false);
      toast.success("NFT Listing removed!");
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(false));
    } catch (error) {
      console.log("Error on handleRemoveNFT", error);
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(true));
    }
    forceUpdate();
  };

  const cancelSale = async () => {
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
    try {
      const contract = new Contract(
        netDetails.dataNetwork.MARKETPLACE_CONTRACT,
        netDetails.dataNetwork.MARKET_ABI,
        signer
      );
      const txResult = await contract.createMarketCancel(
        address,
        market.marketId
      );
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();

      await getDetailsFromSite();

      dispatch(setTxDialogFailed(false));
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      toast.success("NFT Listing Successful!");
      setSellOpen(false);
    } catch (err) {
      console.log("Error on cancelSale", err);
      dispatch(setTxDialogFailed(true));
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
    }
    forceUpdate();
  };

  const buyNFT = async () => {
    sendDataToGTM({
      event: "Click Buy NFT",
      customData: { "Collection Address": address, "token Id": tokenId },
    });

    if (account) {
      if (account.toUpperCase() === market.seller.toUpperCase()) {
        return;
      }

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
      try {
        const contract = new Contract(
          netDetails.dataNetwork.MARKETPLACE_CONTRACT,
          netDetails.dataNetwork.MARKET_ABI,
          signer
        );
        const overRides = {
          value: parseUnits(market.price.toString(), "ether"),
        };
        const txResult = await contract.createMarketSale(
          address,
          market.marketId,
          overRides
        );
        dispatch(setTxDialogHash(txResult.hash));
        await txResult.wait();

        await getDetailsFromSite();

        dispatch(setTxDialogFailed(false));
        dispatch(setTxDialogSuccess(true));
        dispatch(setTxDialogPending(false));
        toast.success("NFT Listing Successful!");

        sendDataToGTM({
          event: "View NFT Buy Transaction Successful Popup",
          customData: { "Collection Address": address, "token Id": tokenId },
        });
      } catch (err) {
        console.log("Error on buyNFT", err);
        dispatch(setTxDialogFailed(true));
        dispatch(setTxDialogSuccess(false));
        dispatch(setTxDialogPending(false));

        sendDataToGTM({
          event: "View NFT Buy Transaction Failed Popup",
          customData: { "Collection Address": address, "token Id": tokenId },
        });
      }
      forceUpdate();
    } else {
      toast.info("Please connect your wallet!");
    }
  };

  return (
    <Fragment>
      <Container>
        <NFTCardContainer>
          <NFTCardDetails
            metadata={metadata}
            tokenId={tokenId}
            owner={owner}
            name={collectionName}
          />
          <NFTCardActionContaniner>
            {!loading &&
              account &&
              account.toLowerCase() === owner.toLowerCase() &&
              !isListed && (
                <Box sx={styles.row}>
                  <Button
                    sx={styles.orangeButton}
                    variant="contained"
                    onClick={() => setListDlgOpen(true)}
                  >
                    LIST TO SWAP
                  </Button>
                  <Button
                    sx={styles.orangeButton}
                    variant="contained"
                    onClick={() => setSellOpen(true)}
                  >
                    LIST TO SELL
                  </Button>
                  <Button
                    sx={styles.orangeButton}
                    variant="contained"
                    onClick={() => setSendOpen(true)}
                  >
                    SEND NFT
                  </Button>
                </Box>
              )}
            {!loading &&
              account &&
              account.toLowerCase() === owner.toLowerCase() &&
              isListed && (
                <>
                  <Button
                    sx={styles.orangeButton}
                    color="error"
                    variant="contained"
                    onClick={handleRemoveNFT}
                  >
                    Remove Listing
                  </Button>
                </>
              )}
            {!loading &&
              market &&
              account &&
              market.seller &&
              account.toUpperCase() === market.seller.toUpperCase() &&
              market.isSold === false &&
              !isListed && (
                <Box sx={styles.row}>
                  <Button
                    sx={styles.orangeButton}
                    color="error"
                    variant="contained"
                    onClick={cancelSale}
                  >
                    Remove Listing
                  </Button>
                  <Button
                    sx={styles.orangeButton}
                    variant="contained"
                    onClick={handleUpdatePrice}
                  >
                    Update Price
                  </Button>
                </Box>
              )}
            {!loading &&
              market &&
              // account &&
              market.seller &&
              account.toUpperCase() !== market.seller.toUpperCase() &&
              market.isSold === false &&
              !isListed && (
                <Box sx={styles.row}>
                  <Button
                    sx={styles.orangeButton}
                    variant="contained"
                    onClick={buyNFT}
                  >
                    Buy
                  </Button>
                </Box>
              )}
            {!loading &&
              account &&
              account.toLowerCase() !== owner.toLowerCase() &&
              isListed && (
                <Box sx={styles.row}>
                  <Button
                    sx={styles.orangeButton}
                    variant="contained"
                    onClick={handleOfferSwap}
                  >
                    Offer SWAP
                  </Button>
                </Box>
              )}
            {market && market.price && (
              <Typography variant="h6" sx={{ mt: 2, mb: 2, color: "#FFFFFF" }}>
                Price: {`${market.price}`} TFUEL
              </Typography>
            )}
            <NFTDetails
              metadata={metadata}
              address={address}
              tokenId={tokenId}
              chainId={network}
            />

            {listing && (
              <OfferList
                network={network}
                listingId={listing.listingDetails.listingid}
              />
            )}
            <NFTDiscussions
              metadata={metadata}
              address={address}
              tokenId={tokenId}
              network={network}
              isAccordion={true}
            />
          </NFTCardActionContaniner>
        </NFTCardContainer>
      </Container>
      <ListNFTDialog
        metadata={metadata}
        tokenId={tokenId}
        owner={owner}
        open={listDlgOpen}
        onClose={(isSuccess) => {
          setListDlgOpen(false);
          if (isSuccess) {
            dispatch({ type: "LOAD_ALL_LISTING" });
          }
        }}
        network={network}
        address={address}
      />
      {listing && (
        <OfferNFTDialog
          tokenAddress={address}
          listingId={listing.listingDetails.listingid}
          open={offerDlgOpen}
          network={network}
          onClose={(isSuccess) => {
            setOfferDlgOpen(false);
            if (isSuccess) {
              setListed(true);
            }
          }}
        />
      )}
      <SendNFT
        isOpen={sendOpen}
        tokenId={tokenId}
        contractAddress={address}
        network={network}
        onCloseDlg={() => {
          setSendOpen(false);
          getDetailsFromSite();
        }}
      />
      <SellNFT
        isOpen={sellOpen}
        tokenId={tokenId}
        contractAddress={address}
        network={network}
        metadata={metadata}
        isUpdate={isUpdatePrice}
        itemPrice={market ? market.price : 0}
        marketId={market ? market.marketId : 0}
        listingId={market ? market.id : 0}
        onCloseDlg={() => {
          setSellOpen(false);
          getDetailsFromSite();
          setIsUpdatePrice(false);
        }}
      />
    </Fragment>
  );
};

const metaUrl = (url) => {
  if (url.includes("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return url;
};

const NFTCardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "20px",
  [theme.breakpoints.down(992)]: {
    flexDirection: "column",
  },
}));

const NFTCardActionContaniner = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "50%",
  [theme.breakpoints.down(992)]: {
    width: "100%",
  },
}));
