/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveListings } from "../../utils/format-listings";
import { setActiveListings } from "../../redux/slices/listing-slice";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Container } from "react-bootstrap";
import { ContentCopy, FacebookRounded } from "@mui/icons-material";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTiktok, FaInstagram, FaDiscord } from "react-icons/fa";
import { BsMedium } from "react-icons/bs";
import bgImage from "../../assets/GrayBackground.jpeg";
import ppImage from "../../assets/pp.png";
import NFTlist from "./components/NFTlist";
import { toast } from "react-toastify";
import copy from "clipboard-copy";

function DashboardGuest() {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.allListings);
  const activeListings = useSelector((state) => state.listings.activeListings);
  const [view, setView] = useState(2);
  const [isOwner, setIsOwner] = useState(false);
  const [activeMenu, setActiveMenu] = useState("nft");

  const metadata = {
    name: "E.R.V Gandalf #54",
    description: "E.R.V Gandalf 2930 Unique NFT Collection.",
    image:
      "https://ipfs.io/ipfs/bafybeieo45rmgccoldjv6mq426zb5xnpqmvoifp2z4xfzwmq2hkffnmpje/54.png",
    dna: "88553cc70d9f4eaea8e3d7380fe3e160458a1458",
    edition: 54,
    date: 1656787121637,
    attributes: [
      {
        trait_type: "Background",
        value: "Blue Lightning ",
      },
      {
        trait_type: "Base",
        value: "Base ",
      },
      {
        trait_type: "Robe",
        value: "Robe 2 Purple ",
      },
      {
        trait_type: "Familiar",
        value: "Lizard Bright Green ",
      },
      {
        trait_type: "Beard",
        value: "Red Wide Beard ",
      },
      {
        trait_type: "Eyebrows",
        value: "White Eyebrows ",
      },
      {
        trait_type: "Eyes",
        value: "Normal Eyes ",
      },
      {
        trait_type: "Hat",
        value: "Black ",
      },
      {
        trait_type: "Staff",
        value: "Crystal Purple ",
      },
      {
        trait_type: "Mouth",
        value: "Normal ",
      },
    ],
    compiler: "HashLips Art Engine",
  };

  const styles = {
    container: {},
    background: {
      width: "100vw",
      height: "50vh",
      objectFit: "cover",
    },
    overlayContainer: {
      // height: "50vh",
      marginTop: "-10vh",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      zIndex: 3,
    },
    imageContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      gap: 3,
    },
    image: {
      width: "160px",
      height: "160px",
      webkitClipPath:
        "polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%,71% 100%, 29% 100%, 0% 71%, 0% 29%)",
      clipPath:
        "polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%,71% 100%, 29% 100%, 0% 71%, 0% 29%)",
      // filter drop shadow
      filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.25))",
    },
    orangeButton: {
      backgroundColor: "#F78C09",
      color: "#262626",
      textTransform: "none",
      fontWeight: 700,
      fontSize: "1rem",
    },
    whiteButton: {
      backgroundColor: "#F4F4F4",
      color: "#262626",
      textTransform: "none",
      fontWeight: 700,
      fontSize: "1rem",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
    },
    row: {
      display: "flex",
      gap: 0.5,
    },
    h1: {
      fontWeight: 600,
      fontSize: "2.25rem",
      lineHeight: "2.5rem",
      color: "#F4F4F4",
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#F4F4F4",
    },
    h5: {
      fontWeight: 400,
      fontSize: "1.125rem",
      color: "#F4F4F4",
    },
    h3: {
      fontWeight: 400,
      fontSize: "1.125rem",
      color: "#6C6C6C",
    },
    icon: {
      color: "#f4f4f4",
      fontSize: "1.625rem",
      marginTop: "0.7rem",
    },
    statsRow: {
      display: "flex",
      gap: 2,
      ml: "3rem",
      my: 2,
    },
    statsCol: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0.5,
    },
    rowAbout: {
      display: "flex",
      gap: 5,
      my: 2,
    },
    aboutContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 1,
    },
    menu: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      width: "100%",
      my: 2,
    },
    activeButton: {
      fontWeight: 400,
      fontSize: "1.5rem",
      color: "#F4F4F4",
      textTransform: "none",
      textDecoration: "underline",
      textUnderlinePosition: "under",
      textDecorationColor: "#f78c09",
      textUnderlineOffset: ".2rem",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#f78c09",
      },
    },
    regularButton: {
      fontWeight: 400,
      fontSize: "1.5rem",
      color: "#6C6C6C",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#f78c09",
      },
    },
    rightColumn: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 1,
    },
    rightRow: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 1,
    },
    orangeText: {
      color: "#F78C09",
      fontSize: "1.5rem",
      marginLeft: 2,
    },
    copyButton: {
      color: "#6C6C6C",
      fontSize: ".75rem",
    },
  };

  useEffect(() => {
    if (listings.length > 0) {
      const active = getActiveListings(listings);
      dispatch(setActiveListings(active));
    }
  }, [listings]);

  return (
    <Box>
      <img
        src={bgImage}
        alt="bg-artwork"
        style={{
          width: "100vw",
          height: "45vh",
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container>
          <Box style={styles.overlayContainer}>
            <Box sx={styles.imageContainer}>
              <img
                src={ppImage}
                alt="profileImage"
                className="octagon-image"
                width="180px"
                height="180px"
              />
              <Box sx={styles.column}>
                <Typography sx={styles.h1}>King Wasabi</Typography>
                <Typography sx={styles.h3}>
                  0xA366C1E80642Abcaa190Ed4Fd7C9bA642228053b
                  <IconButton
                    onClick={() => {
                      copy(0xa366c1e80642abcaa190ed4fd7c9ba642228053b);
                      toast.success("Address copied!");
                    }}
                    sx={styles.copyButton}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Typography>
              </Box>
            </Box>
            <Box sx={styles.rightColumn}>
              <Box sx={styles.rightRow}>
                <img
                  src={bgImage}
                  alt="bg-img"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "1.2rem",
                    border: "4px solid #F78C09",
                  }}
                />
                <img
                  src={bgImage}
                  alt="bg-img"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "1.2rem",
                    border: "4px solid #F78C09",
                  }}
                />
                <img
                  src={bgImage}
                  alt="bg-img"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "1.2rem",
                    border: "4px solid #F78C09",
                  }}
                />
              </Box>
              <Box sx={styles.row}>
                <IconButton>
                  <FacebookRounded sx={styles.icon} />
                </IconButton>
                <IconButton>
                  <TwitterIcon sx={styles.icon} />
                </IconButton>
                <IconButton>
                  <FaInstagram style={styles.icon} />
                </IconButton>
                <IconButton>
                  <FaDiscord style={styles.icon} />
                </IconButton>
                <IconButton>
                  <FaTiktok style={styles.icon} />
                </IconButton>
                <IconButton>
                  <YouTubeIcon sx={styles.icon} />
                </IconButton>
                <IconButton>
                  <BsMedium style={styles.icon} />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={styles.statsRow}>
              <Box sx={styles.statsCol}>
                <Typography sx={styles.h2}>$7,183</Typography>
                <Typography sx={styles.h3}>Balance</Typography>
              </Box>
              <Box sx={styles.statsCol}>
                <Typography sx={styles.h2}>11</Typography>
                <Typography sx={styles.h3}>Currencies</Typography>
              </Box>
              <Box sx={styles.statsCol}>
                <Typography sx={styles.h2}>138</Typography>
                <Typography sx={styles.h3}>NFTs</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={styles.rowAbout}>
            <Box sx={styles.aboutContent}>
              <Typography sx={styles.h2}>About</Typography>
              <Typography sx={styles.h5}>
                Never DM first. Auctioned pieces are non-negotiable...unless you
                offer me a Lambo lol
              </Typography>
            </Box>
          </Box>
          <Box sx={styles.menu}>
            <Button
              onClick={() => setActiveMenu("nft")}
              sx={
                activeMenu === "nft"
                  ? styles.activeButton
                  : styles.regularButton
              }
            >
              NFTs
            </Button>
            <Button
              onClick={() => setActiveMenu("wall")}
              sx={
                activeMenu === "wall"
                  ? styles.activeButton
                  : styles.regularButton
              }
            >
              Wall
            </Button>
          </Box>

          {activeMenu === "nft" && (
            <NFTlist activeListings={activeListings} view={view} />
          )}
          {activeMenu === "wall" && (
            // <Content activeListings={activeListings} view={view} />
            <div>Wall</div>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardGuest;
