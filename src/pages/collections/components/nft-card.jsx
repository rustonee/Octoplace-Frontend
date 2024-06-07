/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import brokenImage from "./../../../assets/broken.png";
import verifiedLogo from "../../../assets/verified.svg";
import ThetaLogo from "../../../assets/chains/thetaLogo.svg";
import KavaLogo from "../../../assets/chains/kavaLogo.svg";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

export const NFTCard = ({ view, nft, isSwiper, where }) => {
  const sendDataToGTM = useGTMDispatch();

  const handleCardClick = (name, network, address, tokenId) => {
    if (where.length > 0) {
      sendDataToGTM({
        event: "Opened Popular NFT",
        customData: {
          name: name,
          network: network,
          "Collection Address": address,
          "token Id": tokenId,
        },
      });
    } else {
      sendDataToGTM({
        event: "Opened Collection NFT",
        customData: {
          name: name,
          network: network,
          "Collection Address": address,
          "token Id": tokenId,
        },
      });
    }
  };

  const styles = {
    root: {
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.25)",
      borderRadius: "12px",
      cursor: "pointer",
      width: "100%",
      boxSizing: "border-box",
      mb: 2,
      border: "1px solid transparent", // Add transparent border
      "&:hover": {
        border: "1px solid #F78C09",
        boxSizing: "border-box",
      },
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
      textWrap: "nowrap",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    network: {
      width: "24px",
      height: "24px",
    },
    verified: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: ".5rem",
      paddingTop: "10px",
    },
    loading: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      fontWeight: "500",
      fontSize: ".875em",
      letterSpacing: "1px",
    },
  };

  return (
    <>
      {nft && nft.name && nft.contractAddress !== "none" && (
        <Link
          className="nft-card-link"
          to={`${where}/nft/${nft.network ? nft.network : "theta"}/${
            nft.contractAddress
          }/${Number(nft.tokenId)}`}
          onClick={() =>
            handleCardClick(
              nft.name,
              nft.network,
              nft.contractAddress,
              nft.tokenId
            )
          }
          key={nft.contractAddress}
        >
          <Box sx={styles.root}>
            <Box
              style={{
                borderTopLeftRadius: "0.75rem",
                borderTopRightRadius: "0.75rem",
                objectFit: "cover",
                width: "100%",
                aspectRatio: "1/1",
                // backgroundImage: `url(${brokenImage})`,
              }}
            >
              <img
                alt=""
                src={`https://wsrv.nl/?url=${nft.imageUrl.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                )}&w=200&h=200&fit=outside`} //const newUrl = url.replace("ipfs://", "https://ipfs.io/ipfs/");
                onError={(event) => (event.target.style.display = "none")}
                style={{
                  borderTopLeftRadius: "0.75rem",
                  borderTopRightRadius: "0.75rem",
                  objectFit: "cover",
                  width: "100%",
                  aspectRatio: "1/1",
                }}
              />
            </Box>
            <Box sx={styles.content}>
              <Box style={styles.meta}>
                <Typography className="strokeme" sx={styles.title}>
                  {nft.name}
                </Typography>
                <img src={verifiedLogo} alt="verified" />
              </Box>
              {/* <Typography sx={styles.network}>{`#${
                nft.network ? nft.network : "theta"
              }`}</Typography> */}
              <img
                style={styles.network}
                src={nft.network === "kava" ? KavaLogo : ThetaLogo}
                alt="network"
              />
              {/* <Box style={styles.verified}>
                <img src={verifiedLogo} alt="verified" />
              </Box> */}
            </Box>
          </Box>
        </Link>
      )}
      {nft && nft.contractAddress === "none" && (
        <Box sx={styles.root}>
          <Box
            style={{
              // borderTopLeftRadius: "0.75rem",
              // borderTopRightRadius: "0.75rem",
              // backgroundSize: "cover",
              width: "100%",
              aspectRatio: "1/1",
              // backgroundImage: `url(${brokenImage})`,
            }}
          >
            <img
              alt=""
              src={brokenImage}
              style={{
                borderTopLeftRadius: "0.75rem",
                borderTopRightRadius: "0.75rem",
                objectFit: "cover",
                width: "100%",
                aspectRatio: "1/1",
              }}
            />
          </Box>
          <Box sx={styles.content}>
            <Box style={styles.loading}>
              <Typography className="strokeme">Loading ...</Typography>
            </Box>
            <Box style={styles.verified}></Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NFTCard;
