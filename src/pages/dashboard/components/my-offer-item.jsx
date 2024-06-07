/* eslint-disable react-hooks/exhaustive-deps */
import { JsonRpcProvider } from "@ethersproject/providers";
import CachedIcon from "@mui/icons-material/Cached";
import React from "react";
import { useEffect } from "react";
import ercAbi from "../../../abi/erc721.json";
import { Contract } from "@ethersproject/contracts";
import axios from "axios";
import { metadataUrl } from "../../../utils/format-listings";
import { useState } from "react";
import { Box } from "@mui/system";
import { getImageUrl, shortenAddress } from "../../../utils/string-util";
import { Button, Chip, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getNetworkInfo } from "../../../connectors/networks";
const noImage =
  "data:image/png;base64,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";
export const MyOfferItem = (props) => {
  const {
    listingTokenAddress,
    offerTokenAddress,
    offerTokenOwner,
    listingTokenOwner,
    listingTokenId,
    offerTokenId,
    network
  } = props.item;
  const [listingObj, setListingObj] = useState();
  const [offerObj, setOfferObj] = useState();
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const getDetails = async () => {
    try {
      const net = getNetworkInfo(network);
      const provider = new JsonRpcProvider(net.dataNetwork.RPC);

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
    } catch {}
  };

  useEffect(() => {
    getDetails();
  }, []);
  return (
    <>
      <Box
        sx={{
          p: 1,
          width: "186px",
          backgroundColor: "#262626",
          borderRadius: "8px",
        }}
        display="flex"
        flexDirection="column"
      >
        {listingObj && (
          <>
            <img
              style={{
                width: "170px",
                display: imgLoaded ? "block" : "none",
                borderRadius: "6px",
                height: "150px",
              }}
              alt={listingObj.name}
              onLoad={() => setImgLoaded(true)}
              src={getImageUrl(listingObj.metadata.image)}
            />
            {!imgLoaded && (
              <Box display="flex" width="170px" alignItems="center">
                <CircularProgress />
              </Box>
            )}
            <Typography
              sx={{ mt: "4px" }}
              color="primary"
              variant="caption"
            >{`${listingObj.name} #${listingObj.tokenId}`}</Typography>
            <Typography sx={{ mt: "4px" }} color="primary" variant="caption">
              Owner: {shortenAddress(listingObj.owner)}
            </Typography>
          </>
        )}
      </Box>

      <Box
        display="flex"
        sx={{ alignItems: "center", flexDirection: "row", width: "100px", ml:4, mr:4 }}
      >
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
      </Box>
      <Box
        sx={{
          p: 1,
          width: "186px",
          backgroundColor: "#262626",
          borderRadius: "8px",
        }}
        display="flex"
        flexDirection="column"
      >
        {offerObj && (
          <>
            <img
              style={{
                width: "170px",
                display: imgLoaded ? "block" : "none",
                borderRadius: "6px",
                height: "150px",
              }}
              alt={offerObj.name}
              onLoad={() => setImgLoaded(true)}
              src={getImageUrl(offerObj.metadata.image)}
            />
            {!imgLoaded && (
              <Box display="flex" width="170px" alignItems="center">
                <CircularProgress />
              </Box>
            )}
            <Typography
              sx={{ mt: "4px" }}
              color="primary"
              variant="caption"
            >{`${offerObj.name} #${offerObj.tokenId}`}</Typography>
            <Typography sx={{ mt: "4px" }} color="primary" variant="caption">
              Owner: {shortenAddress(offerObj.owner)}
            </Typography>
          </>
        )}
      </Box>
      <Box
        sx={{
          ml: 4,
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Chip
          sx={{ width: "150px", color: "white", fontSize: "15px", letterSpacing: "0.1em" }}
          label={getStatus(props.item)}
          color={getColor(getStatus(props.item))}
        />
      </Box>
      <Box
        sx={{
          ml: 4,
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button onClick={() => navigate(`/swap/${network}/${props.item.offerId}`)} sx={{ borderRadius: "20px" }} variant="outlined">
          View Offer
        </Button>
      </Box>
    </>
  );
};

function getStatus(offer) {
  if (offer.isCancelled) {
    return "Cancelled";
  }
  if (offer.isCompleted) {
    return "Completed";
  }
  if (offer.isDeclined) {
    return "Declined";
  }
  return "Active";
}

function getColor(status){
    switch(status){
        case "Active": return "info";
        case "Cancelled": return "warning";
        case "Completed": return "success";
        case "Declined": return "error";
        default: return "info";
    }
} 
