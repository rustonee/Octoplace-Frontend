/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Box, Typography } from "@mui/material";
// import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import verifiedLogo from "../../../assets/verified.svg";
import flameLogo from "../../../assets/flame.svg";
import { useDispatch } from "react-redux";
import { getMarketNFTDetail } from "../../../redux/thunk/getNftDetail";
// import { formatEther, parseEther } from "@ethersproject/units";

export const NFTMarketCard = ({ view, marketItem, selected }) => {
  const [imgUrl, setImgUrl] = useState();
  const dispatch = useDispatch();

  const styles = {
    root: {
      boxSizing: "border-box",
      color: "#fff",
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.25)",
      borderRadius: ".75rem",
      cursor: "pointer",
      width: "100%",
      "&:hover": {
        border: "1px solid #F78C09",
        boxSizing: "border-box",
      },
    },
    selected: {
      boxSizing: "border-box",
      color: "#fff",
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.25)",
      borderRadius: ".75rem",
      cursor: "pointer",
      width: "100%",
      // border: "1px solid transparent", // Add transparent border
      marginBottom: "1rem",
      border: "3px solid #F78C09",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "1rem",
      backgroundColor: "#262626",
      borderBottomLeftRadius: ".75rem",
      borderBottomRightRadius: ".75rem",
      width: "100%",
    },
    meta: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: ".5rem",
    },
    title: {
      fontWeight: "500",
      fontSize: ".875em",
      letterSpacing: "1px",
    },
    network: {
      fontSize: ".625em",
      fontWeight: "400",
      color: "#6C6C6C",
    },
  };

  const truncate = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {
    dispatch(
      getMarketNFTDetail({
        contractAddress: marketItem.contractAddress,
        tokenId: marketItem.tokenId,
        listingId: marketItem.id,
      })
    );
  }, []);

  useEffect(() => {
    if (marketItem && marketItem.metadata) {
      try {
        if (marketItem.metadata.image.includes("ipfs://")) {
          let url = marketItem.metadata.image;
          const newUrl = url.replace("ipfs://", "https://ipfs.io/ipfs/");
          setImgUrl(newUrl);
        } else {
          setImgUrl(marketItem.metadata.image);
        }
      } catch {
        setImgUrl("https://thereisnoimage.com/image");
      }
    } else {
      setImgUrl("https://thereisnoimage.com/image");
    }
  }, [marketItem]);

  return (
    <>
      {marketItem && (
        <Link
          className="nft-card-link"
          // to={`/nft/${marketItem.network}/${marketItem.contractAddress}/${marketItem.tokenId}`}
          to={""}
        >
          <Box
            // sx={styles.root}
            sx={selected ? styles.selected : styles.root}
          >
            <img
              src={imgUrl}
              style={{
                borderTopLeftRadius: ".75rem",
                borderTopRightRadius: ".75rem",
                objectFit: "cover",
                width: view === 3 ? "200px" : "100%",
                aspectRatio: "1/1",
              }}
              loading="lazy"
              alt="NFT Market Card"
            />
            {marketItem.metadata && (
              <Box sx={styles.content}>
                <Box style={styles.meta}>
                  <Typography className="strokeme" sx={styles.title}>
                    {truncate(
                      marketItem.metadata
                        ? marketItem.metadata.name
                        : `${marketItem.metadata.name} #${marketItem.tokenId}`,
                      15
                    )}
                  </Typography>
                  <img src={verifiedLogo} alt="verified" />
                </Box>
                <Typography
                  sx={styles.network}
                >{`#${marketItem.network}`}</Typography>
                <Box style={styles.meta}>
                  <Typography>#{marketItem.tokenId}</Typography>
                  <Box style={styles.meta}>
                    <img src={flameLogo} alt="flame" />
                    <Typography>{marketItem.price}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          {/* </Box> */}
        </Link>
      )}
    </>
  );
};
