/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { getImageUrl, shortenAddress } from "../utils/string-util";
import copy from "clipboard-copy";
import { toast } from "react-toastify";

import verifiedLogo from "../assets/verified.svg";
import { ContentCopy } from "@mui/icons-material";
import { styled } from "@mui/system";

export const NFTCardDetails = (props) => {
  const { metadata, tokenId, owner } = props;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isAnimation, setAnimation] = useState(false);
  const [imgUrl, setUrl] = useState("");

  const styles = {
    card: (theme) => ({
      width: "50%",
      height: "100%",
      bgcolor: "#262626",
      borderRadius: ".75rem",
      border: "1px solid #6C6C6C",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      [theme.breakpoints.down(992)]: {
        width: "100%",
      },
    }),
    nftImg: {
      width: "100%",
      height: "100%",
      maxHeight: "500px",
      objectFit: "cover",
      borderTopLeftRadius: ".75rem",
      borderTopRightRadius: ".75rem",
      display: `${imgLoaded ? "block" : "none"}`,
    },
    imgBox: {
      width: "100%",
      height: "500px",
      borderTopLeftRadius: ".75rem",
      borderTopRightRadius: ".75rem",
      backgroundColor: "#3c3c3c",
    },
    textContainer: {
      py: 1,
      px: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1,
      color: "#f4f4f4",
    },
    title: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: "105.02%",
    },
    metabox: {
      display: "flex",
      justifyContent: "space-between",
    },
    p: {
      color: "#6C6C6C",
      fontWeight: 300,
      fontSize: "1.125rem",
      // color: "#262626",
    },
    tokenId: {
      fontWeight: 400,
      fontSize: "1.125rem",
      lineHeight: "105.02%",
    },
    spanAddress: {
      fontWeight: "bold",
      fontSize: "1.125rem",
      cursor: "pointer",
      color: "#f4f4f4",
    },
    attBox: {
      width: "100%",
      borderRadius: 2,
      justifyContent: "space-between",
    },
    accordion: {
      backgroundColor: "transparent",
      color: "white",
      border: "1px solid #fff",
      borderRadius: "5px",
    },
    accordion2: {
      backgroundColor: "transparent",
      color: "white",
      border: "1px solid  #6C6C6C",
      borderRadius: "5px",
    },
    chip: {
      color: "white",
      marginRight: "4px",
      marginLeft: "4px",
      marginBottom: "8px",
    },
    copyButton: {
      color: "#6C6C6C",
      fontSize: ".75rem",
    },
  };

  useEffect(() => {
    if (metadata) {
      try {
        if (metadata.image) {
          setUrl(
            `https://wsrv.nl/?url=${getImageUrl(
              metadata.image
            )}&w=400&h=400&fit=outside`
          );
        } else if (metadata.aimation_url) {
          setAnimation(true);
          setUrl(
            `https://wsrv.nl/?url=${getImageUrl(
              metadata.animation_url
            )}&w=400&h=400&fit=outside`
          );
        }
      } catch (e) {
        setUrl("");
      }
    }
  }, [metadata]);
  return (
    <>
      <Box sx={styles.card}>
        {metadata && (
          <Img
            alt="kjbhv"
            src={imgUrl}
            style={{ display: imgLoaded ? "block" : "none" }}
            onLoad={() => setImgLoaded(true)}
          />
        )}
        {!imgLoaded && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={styles.imgBox}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
        <Box sx={styles.textContainer}>
          <Box sx={styles.metabox}>
            <Typography sx={styles.title}>
              {metadata ? metadata.name : props.name}
            </Typography>
            <img src={verifiedLogo} alt="verified" />
          </Box>
          <Typography sx={styles.tokenId}>{`#${tokenId}`}</Typography>
          <Typography style={styles.p}>
            owned by{" "}
            <span
              style={styles.spanAddress}
              onClick={() =>
                window.open(
                  `https://explorer.thetatoken.org/account/${owner}`,
                  "_blank"
                )
              }
            >
              {owner === "" ? "" : shortenAddress(owner)}
            </span>
            <IconButton
              onClick={() => {
                copy(owner);
                toast.success("Address copied!");
              }}
              sx={styles.copyButton}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

const Img = styled("img")(({ theme }) => ({
  height: "100%",
  width: "100%",
  maxHeight: "636.02px",
  objectFit: "contain",
  borderTopLeftRadius: ".75rem",
  borderTopRightRadius: ".75rem",
  [theme.breakpoints.down(992)]: {
    maxHeight: "694px",
  },
}));
