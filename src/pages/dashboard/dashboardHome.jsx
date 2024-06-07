/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getActiveListings } from "../../utils/format-listings";
import { setActiveListings } from "../../redux/slices/listing-slice";
import { getCollectionOwner } from "../../redux/thunk/get-collection-owner";
import { useWeb3React } from "@web3-react/core";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Container } from "react-bootstrap";
import Tooltip from "@mui/material/Tooltip";
import { ContentCopy, FacebookRounded } from "@mui/icons-material";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTiktok, FaInstagram, FaDiscord } from "react-icons/fa";
import { BsMedium } from "react-icons/bs";
import { createAction } from "@reduxjs/toolkit";
import styled from "styled-components";
import { fetchUserSetting } from "../../redux/thunk/user-setting";
import bgImage from "../../assets/GrayBackground.jpeg";
import avatarImage from "../../assets/default-user.jpg";
import brokenImage from "../../assets/broken.png";
import NFTlist from "./components/NFTlist";
import Content from "./components/Content";
import { toast } from "react-toastify";
import copy from "clipboard-copy";
import { getSocialUrl } from "../../utils/string-util";

function DashboardHome() {
  const dispatch = useDispatch();
  const acctDetails = useSelector((state) => state.account);
  const [balance, setBalance] = useState(null);
  const listings = useSelector((state) => state.listings.allListings);
  // const activeListings = useSelector((state) => state.listings.activeListings);
  const isLoading = useSelector((state) => state.myNFT.isLoading);
  const myNFTs = useSelector((state) => state.myNFT.nfts);
  // const [myNFTListings, setMyNFTListings] = useState([]);
  const [view, setView] = useState(2);
  // const [isOwner, setIsOwner] = useState(false);
  const [activeMenu, setActiveMenu] = useState("nft");
  const { account, chainId } = useWeb3React();
  const [userSetting, setUserSetting] = useState({});
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {},
    background: {
      width: "100%",
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
    imageContainer: (theme) => ({
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      gap: 3,
      [theme.breakpoints.down(1240)]: {
        flexDirection: "column",
        alignItems: "flex-start",
      },
    }),
    image: {
      width: "160px",
      height: "160px",
      WebkitClipPath:
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
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    icon: {
      color: "#f4f4f4",
      fontSize: "1.625rem",
      marginTop: "0.7rem",
    },
    statsRow: {
      display: "flex",
      gap: 2,
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
      flexWrap: "wrap",
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
      color: "#6C6C6C !important",
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
    rightRow: (theme) => ({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 1,
      [theme.breakpoints.down(992)]: {
        display: "none",
      },
    }),
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

  // Convert 1 TFUEL to USD using the CoinGecko API
  const setTFUELtoUSD = async (tfuelAmount) => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=theta-fuel&vs_currencies=usd"
      );
      const exchangeRate = response.data["theta-fuel"].usd;
      const usdAmount = tfuelAmount * exchangeRate;
      setBalance(usdAmount.toFixed(2));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchUserSetting(account);
        setUserSetting(fetchedData);
        setLoading(false);
      } catch (error) {
        // Handle error here, e.g. show an error message
        console.log("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();

    dispatch(createAction("LOAD_MY_NFTS_API")({ account: account }));

    // Calc balance
    setTFUELtoUSD(acctDetails.balance);

    // if (myNFTs.length > 0) {
    //   setMyNFTListings(transformData(myNFTs));
    // }

    if (listings.length > 0) {
      const active = getActiveListings(listings);
      dispatch(setActiveListings(active));
    }

    dispatch(getCollectionOwner({ address: account, network: "theta" }));
  }, [account]);

  const getAccountString = (_hash) => {
    const hash = String(_hash);
    const first = hash.substring(0, 3);
    const len = hash.length;
    const last = hash.substring(len - 4, len);
    return `${first}...${last}`;
  };
  console.log("myDashboard isLoading", isLoading);
  return (
    <Box>
      <img
        src={
          userSetting.bannerImage
            ? process.env.REACT_APP_API_URL + userSetting.bannerImage
            : bgImage
        }
        alt="User Banner"
        style={{
          width: "100%",
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
                src={
                  userSetting.avatarImage
                    ? process.env.REACT_APP_API_URL + userSetting.avatarImage
                    : avatarImage
                }
                alt="User Avatar"
                className="octagon-image"
                width="180px"
                height="180px"
              />
              <Box sx={styles.column}>
                <Typography sx={styles.h1}>{userSetting.title}</Typography>
                <Typography sx={styles.h3}>
                  {getAccountString(acctDetails.address)}
                  <IconButton
                    onClick={() => {
                      copy(acctDetails.address);
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
                  src={
                    (userSetting &&
                      userSetting.nft1 &&
                      userSetting.nft1.bannerImage) ||
                    brokenImage
                  }
                  alt="User NFT"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "1.2rem",
                    border: "4px solid #F78C09",
                  }}
                />
                <img
                  src={
                    (userSetting &&
                      userSetting.nft2 &&
                      userSetting.nft2.bannerImage) ||
                    brokenImage
                  }
                  alt="User NFT"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "1.2rem",
                    border: "4px solid #F78C09",
                  }}
                />
                <img
                  src={
                    (userSetting &&
                      userSetting.nft3 &&
                      userSetting.nft3.bannerImage) ||
                    brokenImage
                  }
                  alt="User NFT"
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
                {userSetting.facebook &&
                  getSocialUrl("facebook.com", userSetting.facebook) && (
                    <a
                      href={getSocialUrl("facebook.com", userSetting.facebook)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconButton>
                        <FacebookRounded sx={styles.icon} />
                      </IconButton>
                    </a>
                  )}

                {userSetting.telegram &&
                  getSocialUrl("telegram.com", userSetting.telegram) && (
                    <a
                      href={getSocialUrl("telegram.com", userSetting.telegram)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconButton>
                        <TelegramIcon sx={styles.icon} />
                      </IconButton>
                    </a>
                  )}

                {userSetting.twitter &&
                  getSocialUrl("twitter.com", userSetting.twitter) && (
                    <a
                      href={getSocialUrl("twitter.com", userSetting.twitter)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconButton>
                        <TwitterIcon sx={styles.icon} />
                      </IconButton>
                    </a>
                  )}

                {userSetting.instagram &&
                  getSocialUrl("instagram.com", userSetting.instagram) && (
                    <a
                      href={getSocialUrl(
                        "instagram.com",
                        userSetting.instagram
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconButton>
                        <FaInstagram style={styles.icon} />
                      </IconButton>
                    </a>
                  )}

                {userSetting.discord &&
                  getSocialUrl("discord.com", userSetting.discord) && (
                    <a
                      href={getSocialUrl("discord.com", userSetting.discord)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconButton>
                        <FaDiscord style={styles.icon} />
                      </IconButton>
                    </a>
                  )}

                {userSetting.tictok &&
                  getSocialUrl("tiktok.com", userSetting.tictok) && (
                    <a
                      href={getSocialUrl("tiktok.com", userSetting.tictok)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconButton>
                        <FaTiktok style={styles.icon} />
                      </IconButton>
                    </a>
                  )}

                {userSetting.youtube &&
                  getSocialUrl("youtube.com", userSetting.youtube) && (
                    <a
                      href={getSocialUrl("youtube.com", userSetting.youtube)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconButton>
                        <YouTubeIcon sx={styles.icon} />
                      </IconButton>
                    </a>
                  )}

                {userSetting.medium &&
                  getSocialUrl("medium.com", userSetting.medium) && (
                    <a
                      href={getSocialUrl("medium.com", userSetting.medium)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconButton>
                        <BsMedium style={styles.icon} />
                      </IconButton>
                    </a>
                  )}
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
                <Typography sx={styles.h2}>
                  {balance ? `$${balance}` : "Loading..."}
                </Typography>
                <Typography sx={styles.h3}>Balance</Typography>
              </Box>
              {/* <Box sx={styles.statsCol}>
                <Typography sx={styles.h2}>11</Typography>
                <Typography sx={styles.h3}>Currencies</Typography>
              </Box> */}
              <Box sx={styles.statsCol}>
                <Typography sx={styles.h2}>
                  {myNFTs && myNFTs.length > 0 ? myNFTs.length : "0"}
                </Typography>
                <Typography sx={styles.h3}>NFTs</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={styles.rowAbout}>
            <Box sx={styles.aboutContent}>
              <Typography sx={styles.h2}>About</Typography>
              <Typography sx={styles.h5}>{userSetting.description}</Typography>
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
            <Tooltip
              title={<Typography fontSize={"0.83rem"}>Coming soon!</Typography>}
            >
              <Spin>
                <Button
                  onClick={() => setActiveMenu("inbox")}
                  disabled
                  sx={
                    activeMenu === "inbox"
                      ? styles.activeButton
                      : styles.regularButton
                  }
                >
                  Inbox
                  <span style={styles.orangeText}></span>
                </Button>
              </Spin>
            </Tooltip>
            <Tooltip
              title={<Typography fontSize={"0.83rem"}>Coming soon!</Typography>}
            >
              <Spin>
                <Button
                  onClick={() => setActiveMenu("offers")}
                  disabled
                  sx={
                    activeMenu === "offers"
                      ? styles.activeButton
                      : styles.regularButton
                  }
                >
                  Offers
                  <span style={styles.orangeText}></span>
                </Button>
              </Spin>
            </Tooltip>
            <Tooltip
              title={<Typography fontSize={"0.83rem"}>Coming soon!</Typography>}
            >
              <Spin>
                <Button
                  onClick={() => setActiveMenu("content")}
                  disabled
                  sx={
                    activeMenu === "content"
                      ? styles.activeButton
                      : styles.regularButton
                  }
                >
                  Content
                  <span style={styles.orangeText}></span>
                </Button>
              </Spin>
            </Tooltip>
            <Tooltip
              title={<Typography fontSize={"0.83rem"}>Coming soon!</Typography>}
            >
              <Spin>
                <Button
                  onClick={() => setActiveMenu("wall")}
                  disabled
                  sx={
                    activeMenu === "wall"
                      ? styles.activeButton
                      : styles.regularButton
                  }
                >
                  Wall
                </Button>
              </Spin>
            </Tooltip>
          </Box>

          {activeMenu === "nft" && (
            <NFTlist
              activeListings={myNFTs}
              view={view}
              isLoading={isLoading}
            />
          )}
          {activeMenu === "inbox" && (
            <Content activeListings={myNFTs} view={view} />
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardHome;

const Spin = styled.div`
  font-size: smaller;
  margin-top: "0px";
`;
