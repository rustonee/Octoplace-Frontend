/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
// import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Link } from "react-router-dom";
import broken from "./../../../assets/broken.png";

import verifiedLogo from "../../../assets/verified.svg";
import ThetaLogo from "../../../assets/chains/thetaLogo.svg";
import KavaLogo from "../../../assets/chains/kavaLogo.svg";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

export const CollectionCard = (props) => {
  const { collectionItem,  where } = props;
  const sendDataToGTM = useGTMDispatch();
  const boxRef = useRef(null);
  // const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });
  // const [titleLength, setTitleLength] = useState(0);
  const [imgUrl, setImgUrl] = useState(
    `https://wsrv.nl/?url=${collectionItem.projectImage}&w=200&h=400&fit=outside`
  );
  // const [imageLoaded, setImageLoaded] = useState(false);

  const styles = {
    root: {
      boxSizing: "border-box",
      color: "#fff",
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.25)",
      borderRadius: ".75rem",
      cursor: "pointer",
      flex: "0 0 auto",
      width: "100%",
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
  };

  // useEffect(() => {
  //   function handleResize() {
  //     const boxRect = boxRef.current.getBoundingClientRect();
  //     if (boxRect.top < window.innerHeight && boxRect.bottom > 0) {
  //       // Box is currently visible in viewport, update size
  //       setBoxSize({
  //         width: boxRef.current.offsetWidth,
  //         height: boxRef.current.offsetHeight,
  //       });
  //       setTitleLength(Math.floor(boxRef.current.offsetWidth / 18));
  //     }
  //   }

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const handleCardClick = (name, address) => {
    if (where.length > 0) {
      sendDataToGTM({
        event: "Opened Popular Collection",
        customData: { name: name, contractAddress: address },
      });
    } else {
      sendDataToGTM({
        event: "Viewed Collection",
        customData: { name: name, contractAddress: address },
      });
    }
  };

  // const handleImageLoad = () => {
  //   // setImageLoaded(true);
  // };

  const handleImageError = () => {
    setImgUrl(broken);
  };

  // useEffect(() => {
  //   setImgUrl(
  //     `https://wsrv.nl/?url=${collectionItem.projectImage}&w=200&h=400&fit=outside`
  //   );
  // }, [props.collectionItem]);

  return (
    <>
      {props.collectionItem &&
        props.collectionItem.contractAddress !== "none" && (
          <Link
            className="nft-card-link"
            to={`${where}/collection/${collectionItem.contractAddress}`}
            onClick={() =>
              handleCardClick(
                where,
                collectionItem.name,
                collectionItem.contractAddress
              )
            }
          >
            <Box ref={boxRef} sx={styles.root}>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // height: "168px",
                }}
              >
                <img
                  src={imgUrl}
                  // onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    borderTopLeftRadius: "0.75rem",
                    borderTopRightRadius: "0.75rem",
                    objectFit: "cover",
                    width: "100%",
                    aspectRatio: "1/1",
                  }}
                  alt="nft_image"
                  // loading="lazy"
                />
              </Box>

              <Box sx={styles.content}>
                <Box style={styles.meta}>
                  <Typography className="strokeme" sx={styles.title}>
                    {collectionItem.name}
                  </Typography>
                  <img src={verifiedLogo} alt="verified" />
                </Box>
                {/* <Typography
                  sx={styles.network}
                >{`#${collectionItem.network}`}</Typography> */}
                <img
                  style={styles.network}
                  src={collectionItem.network === "kava" ? KavaLogo : ThetaLogo}
                  alt="network"
                />
              </Box>
            </Box>
          </Link>
        )}
      {props.collectionItem &&
        props.collectionItem.contractAddress === "none" && (
          <Box ref={boxRef} sx={styles.root}>
            <img
              src={broken}
              // onLoad={handleImageLoad}
              // onError={handleImageError}
              style={{
                // borderTopLeftRadius: "0.75rem",
                // borderTopRightRadius: "0.75rem",
                borderRadius: "0.75rem",
                objectFit: "cover",
                width: "100%",
                aspectRatio: "1/1",
              }}
              alt="nft_image"
              loading="lazy"
            />
          </Box>
        )}
    </>
  );
};
