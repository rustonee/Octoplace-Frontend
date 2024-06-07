/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Box, Typography } from "@mui/material";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/string-util";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateNFT } from "../redux/slices/my-nft-slice";
import { defaultImage } from "../connectors/address";

export const NFTCard = (props) => {
  const [imgUrl, setImgUrl] = useState();
  const dispatch = useDispatch();
  const { metadata, collectionName, tokenId, contractAddress, url, network } =
    props.nft;
  const styles = {
    root: {
      width: "100%",
      bgcolor: "#262626",
      borderRadius: "12px",
      position: "relative",
      color: "white",
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: "cover",
      cursor: "pointer",
    },
    flex: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      height: "100%",
      padding: "10px",
    },
    meta: {
      display: "flex",
    },
    title: {
      fontWeight: "500",
      fontSize: "1.1em",
      letterSpacing: "1px",
    },
  };

  useEffect(() => {
    const getMetadata = async () => {
      try {
        const result = await axios.get(getImageUrl(url));
        dispatch(
          updateNFT({
            address: contractAddress,
            tokenId: tokenId,
            metadata: result.data,
          })
        );
      } catch {
        dispatch(
          updateNFT({
            address: contractAddress,
            tokenId: tokenId,
            metadata: {
              name: "Unnamed Collection",
              image: defaultImage,
            },
          })
        );
      }
    };
    if (!metadata) {
      getMetadata();
    }
  }, [metadata]);

  useEffect(() => {
    if (metadata !== undefined && metadata !== null) {
      if (metadata.image && metadata.image.includes("ipfs://")) {
        let url = metadata.image;
        const newUrl = url.replace("ipfs://", "https://ipfs.io/ipfs/");
        setImgUrl(newUrl);
      } else {
        setImgUrl(metadata.image);
      }
    } else {
      setImgUrl("https://thereisnoimage.com/image");
    }
  }, [metadata]);

  return (
    <>
      <Link
        className="nft-card-link"
        to={`/nft/${network ? network : "theta"}/${contractAddress}/${tokenId}`}
      >
        <Box sx={styles.root}>
          <Box sx={styles.flex}>
            <div style={styles.meta}>
              <Typography className="strokeme" sx={styles.title}>
                {metadata ? metadata.name : `${collectionName} #${tokenId}`}
              </Typography>
              <VerifiedOutlinedIcon sx={{ ml: "8px" }} />
            </div>
            <Typography>{`#${tokenId}`}</Typography>
          </Box>
        </Box>
      </Link>
    </>
  );
};
