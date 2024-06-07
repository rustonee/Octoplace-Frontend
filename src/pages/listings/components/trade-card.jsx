/* eslint-disable react-hooks/exhaustive-deps */
import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { defaultImage, ercAbi } from "../../../connectors/address";
import { metadataUrl } from "../../../utils/format-listings";
import { getImageUrl } from "../../../utils/string-util";
import { Cached } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { getNetworkInfo } from "../../../connectors/networks";

export const TradeCard = (props) => {
  const [listingObj, setListingObj] = useState(undefined);
  const [offerObj, setOfferObj] = useState(undefined);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [img2Loaded, setImg2Loaded] = useState(false);
  const { tradeId, listing, offer, network } = props.trade;
  const styles = {
    root2: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    root3: {
      height: 80,
      width: "100%",
      backgroundColor: "#3c3c3c",
      borderRadius: 2,
      mt: 2,
      p: 1,
    },
    root: {
      height: "280px",
      width: "100%",
      backgroundColor: "#6c6c6c",
      borderRadius: "10px",
      p: 2,
    },
    img: {
      width: "150px",
      height: "150px",
      display: imgLoaded ? "block" : "none",
      borderRadius: "5px",
    },
    img2: {
      width: "150px",
      height: "150px",
      display: img2Loaded ? "block" : "none",
      borderRadius: "5px",
    },
    imgBox: {
      width: "150px",
      height: "150px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      borderRadius: "5px",
    },
    middle: {
      backgroundColor: "white",
      width: "50px",
      height: "50px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      ml: 2,
      mr: 2,
    },
  };

  async function getListingDetails() {
    const net = getNetworkInfo(network);
    const provider = new JsonRpcProvider(net.dataNetwork.RPC);
    const contract = new Contract(listing.tokenAddress, ercAbi, provider);
    const listingName = await contract.name();
    const tokenUri = await contract.tokenURI(listing.tokenId);
    let metadata;
    try {
      metadata = await axios.get(metadataUrl(tokenUri));
      metadata = metadata.data;
      if (metadata.image && metadata.name) {
        setListingObj({
          tokenId: listing.tokenId,
          name: listingName,
          uri: tokenUri,
          metadata,
        });
      } else {
        setListingObj({
          tokenId: listing.tokenId,
          name: listingName,
          uri: tokenUri,
          metadata: {
            name: listingName,
            image: defaultImage,
          },
        });
      }
    } catch {
      setListingObj({
        tokenId: listing.tokenId,
        name: listingName,
        uri: tokenUri,
        metadata: {
          name: listingName,
          image: defaultImage,
        },
      });
    }
  }
  async function getOfferDetails() {
    const net = getNetworkInfo(network);
    const provider = new JsonRpcProvider(net.dataNetwork.RPC);
    const contract = new Contract(offer.offerTokenAddress, ercAbi, provider);
    const offerName = await contract.name();
    const tokenUri = await contract.tokenURI(offer.offerTokenId);
    let metadata;
    try {
      metadata = await axios.get(metadataUrl(tokenUri));
      metadata = metadata.data;
      if (metadata.image && metadata.name) {
        setOfferObj({
          tokenId: offer.offerTokenId,
          name: offerName,
          uri: tokenUri,
          metadata,
        });
      } else {
        setOfferObj({
          tokenId: offer.offerTokenId,
          name: offerName,
          uri: tokenUri,
          metadata: {
            name: offerName,
            image: defaultImage,
          },
        });
      }
    } catch {
      setOfferObj({
        tokenId: offer.offerTokenId,
        name: offerName,
        uri: tokenUri,
        metadata: {
          name: offerName,
          image: defaultImage,
        },
      });
    }
  }
  useEffect(() => {
    if (props.trade) {
      getListingDetails();
      getOfferDetails();
    }
  }, [props.trade]);

  return (
    <Box sx={styles.root}>
      <Box sx={styles.root2}>
        {listingObj && (
          <img
            onLoad={() => setImgLoaded(true)}
            style={styles.img}
            src={getImageUrl(listingObj.metadata.image)}
            alt="listing pic"
          />
        )}
        {!imgLoaded && (
          <Box sx={styles.imgBox}>
            <CircularProgress color="primary" />
          </Box>
        )}

        <Box sx={styles.middle} disabled>
          <Cached sx={{ color: "#262626" }} fontSize="large" />
        </Box>
        {offerObj && (
          <img
            onLoad={() => setImg2Loaded(true)}
            style={styles.img2}
            src={getImageUrl(offerObj.metadata.image)}
            alt="listing pic"
          />
        )}
        {!img2Loaded && (
          <Box sx={styles.imgBox}>
            <CircularProgress color="primary" />
          </Box>
        )}
      </Box>
      <Box sx={styles.root3}>
        <Link to={`/swap/${network}/${offer.offerId}`}>
          {" "}
          <Typography
            sx={{
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >{`Trade #${tradeId} (${network.toUpperCase()} NETWORK)`}</Typography>
        </Link>
        {listingObj && offerObj && (
          <Typography
            sx={{ color: "white", fontSize: "16px", fontWeight: 500 }}
          >{`${listingObj.name} #${listingObj.tokenId} & ${offerObj.name} #${offerObj.tokenId}`}</Typography>
        )}
      </Box>
    </Box>
  );
};
