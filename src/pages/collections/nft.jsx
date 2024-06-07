/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Container } from "react-bootstrap";
import {
  Facebook,
  Telegram,
  Twitter,
  Instagram,
  Settings,
} from "@mui/icons-material";
import { BsMedium } from "react-icons/bs";
import { FaDiscord, FaTiktok, FaYoutube } from "react-icons/fa";
import { useWeb3React } from "@web3-react/core";
import { getCollection } from "../../redux/thunk/getAllCollections";
import { setCollectionDiscussions } from "../../redux/slices/discussions-slice";
import NFTlist from "./components/NFTlist";
import Content from "./components/Content";
import RecentMessages from "./components/RecentMessages";
import { CollectionDiscussions } from "../../components/discussions/collection-discussion";
import defaultImage from "../../assets/GrayBackground.jpeg";
import { styled } from "@mui/system";
import { getSocialUrl } from "../../utils/string-util";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

const NFTPage = () => {
  const sendDataToGTM = useGTMDispatch();

  const { address } = useParams();
  const navigate = useNavigate();
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const [collection, setCollection] = useState(null);
  const [asset, setAsset] = useState(null);
  const [nftCounts, setNftCounts] = useState(0);
  const [discussions, setDiscussions] = useState(null);

  const [view, setView] = useState(2);
  const [activeMenu, setActiveMenu] = useState("collection");

  const fetchCollectionSetting = async () => {
    const result = await getCollection(address);
    setCollection(result.collection);
    setDiscussions(result.discussions);
    setAsset(result.asset);
    setNftCounts(result.nftCounts);
  };

  useEffect(() => {
    dispatch(setCollectionDiscussions([]));
    fetchCollectionSetting();
    window.scrollTo(0, 0);
  }, []);

  return (
    collection && (
      <Box>
        <Box
          style={{
            width: "100vw",
            height: "45vh",
            objectFit: "cover",
            backgroundImage: `url(${defaultImage})`,
          }}
        >
          <Img
            src={
              collection.bannerImage.startsWith("https://")
                ? // ? collection.bannerImage
                  `https://wsrv.nl/?url=${collection.bannerImage}&w=1290&h=260&fit=outside&n=-1`
                : // : process.env.REACT_APP_API_URL + collection.bannerImage
                  `https://wsrv.nl/?url=${
                    process.env.REACT_APP_API_URL + collection.bannerImage
                  }&w=1290&h=260&fit=outside&n=-1`
            }
            onError={(event) => (event.target.style.display = "none")}
            alt="Collection banner"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Container>
            <Box style={styles.overlayContainer}>
              <Box sx={styles.imageContainer}>
                <Box
                  className="octagon-image"
                  style={{ backgroundImage: `url(${defaultImage})` }}
                >
                  <img
                    alt="NFT Project"
                    src={
                      collection.projectImage.startsWith("https://")
                        ? collection.projectImage
                        : process.env.REACT_APP_API_URL +
                          collection.projectImage
                    }
                    onError={(event) => (event.target.style.display = "none")}
                    // sx={styles.image}
                    className="octagon-image"
                    // width="180px"
                    // height="180px"
                  />
                </Box>
                <Box sx={styles.column}>
                  <Typography sx={styles.h1}>{collection.name}</Typography>
                  <Typography sx={styles.h3}>
                    {collection.contractAddress}
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.column}>
                {/* <Button sx={styles.orangeButton} variant="contained">
                Mint
              </Button> */}
                {collection.social && (
                  <Box sx={styles.row}>
                    {collection.social.telegram &&
                      getSocialUrl(
                        "telegram.com",
                        collection.social.telegram
                      ) && (
                        <IconButton
                          LinkComponent={"a"}
                          href={getSocialUrl(
                            "telegram.com",
                            collection.social.telegram
                          )}
                          target="_blank"
                        >
                          <Telegram sx={styles.icon} />
                        </IconButton>
                      )}
                    {collection.social.twitter &&
                      getSocialUrl(
                        "twitter.com",
                        collection.social.twitter
                      ) && (
                        <IconButton
                          LinkComponent={"a"}
                          href={getSocialUrl(
                            "twitter.com",
                            collection.social.twitter
                          )}
                          target="_blank"
                        >
                          <Twitter sx={styles.icon} />
                        </IconButton>
                      )}
                    {collection.social.discord &&
                      getSocialUrl(
                        "discord.com",
                        collection.social.discord
                      ) && (
                        <IconButton
                          LinkComponent={"a"}
                          href={getSocialUrl(
                            "discord.com",
                            collection.social.discord
                          )}
                          target="_blank"
                        >
                          <FaDiscord color="#fff" sx={styles.icon} />
                        </IconButton>
                      )}
                    {collection.social.facebook &&
                      getSocialUrl(
                        "facebook.com",
                        collection.social.facebook
                      ) && (
                        <IconButton
                          LinkComponent={"a"}
                          href={getSocialUrl(
                            "facebook.com",
                            collection.social.facebook
                          )}
                          target="_blank"
                        >
                          <Facebook sx={styles.icon} />
                        </IconButton>
                      )}
                    {collection.social.instagram &&
                      getSocialUrl(
                        "instagram.com",
                        collection.social.instagram
                      ) && (
                        <IconButton
                          LinkComponent={"a"}
                          href={getSocialUrl(
                            "instagram.com",
                            collection.social.instagram
                          )}
                          target="_blank"
                        >
                          <Instagram sx={styles.icon} />
                        </IconButton>
                      )}
                    {collection.social.youtube &&
                      getSocialUrl(
                        "youtube.com",
                        collection.social.youtube
                      ) && (
                        <IconButton
                          LinkComponent={"a"}
                          href={getSocialUrl(
                            "youtube.com",
                            collection.social.youtube
                          )}
                          target="_blank"
                        >
                          <FaYoutube color="#fff" sx={styles.icon} />
                        </IconButton>
                      )}
                    {collection.social.medium &&
                      getSocialUrl("medium.com", collection.social.medium) && (
                        <IconButton
                          LinkComponent={"a"}
                          href={getSocialUrl(
                            "medium.com",
                            collection.social.medium
                          )}
                          target="_blank"
                        >
                          <BsMedium color="#fff" sx={styles.icon} />
                        </IconButton>
                      )}
                    {collection.social.tikTok &&
                      getSocialUrl("tiktok.com", collection.social.tikTok) && (
                        <IconButton
                          LinkComponent={"a"}
                          href={getSocialUrl(
                            "tiktok.com",
                            collection.social.tikTok
                          )}
                          target="_blank"
                        >
                          <FaTiktok color="#fff" sx={styles.icon} />
                        </IconButton>
                      )}

                    {account === collection.ownerAddr && (
                      <IconButton
                        onClick={() => {
                          navigate(
                            `/collections/settings/${collection.contractAddress}`
                          );
                        }}
                      >
                        <Settings color="#fff" sx={styles.icon} />
                      </IconButton>
                    )}
                  </Box>
                )}
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
                  <Typography sx={styles.h2}>{nftCounts}</Typography>
                  <Typography sx={styles.h3}>Items</Typography>
                </Box>
                {/* <Box sx={styles.statsCol}>
                <Typography sx={styles.h2}>583</Typography>
                <Typography sx={styles.h3}>Owners</Typography>
              </Box>
              <Box sx={styles.statsCol}>
                <Typography sx={styles.h2}>183,000</Typography>
                <Typography sx={styles.h3}>Volume</Typography>
              </Box>
              <Box sx={styles.statsCol}>
                <Typography sx={styles.h2}>4900</Typography>
                <Typography sx={styles.h3}>Floor</Typography>
              </Box> */}
                <Box sx={styles.statsCol}>
                  <Typography sx={styles.h2}>
                    {discussions ? discussions.length : 0}
                  </Typography>
                  <Typography sx={styles.h3}>Comments</Typography>
                </Box>
              </Box>
              {collection.ownerAddr === address && (
                <Button sx={styles.whiteButton}>Collection settings</Button>
              )}
            </Box>
            <Box sx={styles.rowAbout}>
              <Box sx={styles.aboutContent}>
                {collection.description && (
                  <>
                    <Typography sx={styles.h2}>About</Typography>
                    <Typography sx={styles.h5}>
                      {collection.description}
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={styles.aboutContent}>
                <Typography sx={styles.h2}>Recent messages</Typography>
                <RecentMessages messages={discussions} />
              </Box>
            </Box>
            <Box sx={styles.menu}>
              <Button
                onClick={() => setActiveMenu("collection")}
                sx={
                  activeMenu === "collection"
                    ? styles.activeButton
                    : styles.regularButton
                }
              >
                Collection
              </Button>
              <Button
                onClick={() => setActiveMenu("content")}
                style={{ color: "#FFFFFF" }}
                sx={
                  activeMenu === "content"
                    ? styles.activeButton
                    : styles.regularButton
                }

                /*
                style={{
                  color:
                    asset.video === "" && account !== collection.ownerAddr
                      ? "#6d6c6c"
                      : "#FFFFFF",
                }}
                */
                //disabled={ asset.video === "" && account !== collection.ownerAddr } // this had the button content disabled if no content present
              >
                Content
              </Button>
              <Button
                onClick={() => {
                  sendDataToGTM({
                    event: "Opened Collection Discussion",
                    customData: `address: ${collection.contractAddress}`,
                  });
                  setActiveMenu("discussion");
                }}
                sx={
                  activeMenu === "discussion"
                    ? styles.activeButton
                    : styles.regularButton
                }
              >
                Discussion
              </Button>
            </Box>

            {activeMenu === "collection" && (
              <NFTlist address={collection.contractAddress} view={view} />
            )}
            {activeMenu === "content" && (
              <Content
                isOwner={account === collection.ownerAddr}
                address={collection.contractAddress}
                activeListings={{}} // {activeListings}
                view={view}
                videoTitle={asset.name}
                videoDesc={asset.description}
                videoUrl={asset.video}
              />
            )}
            {activeMenu === "discussion" && (
              <CollectionDiscussions
                address={collection.contractAddress}
                // network={network}
                // discussions={discussions}
                isAccordion={false}
              />
            )}
          </Container>
        </Box>
      </Box>
    )
  );
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
  imageContainer: (theme) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 3,
    [theme.breakpoints.down(768)]: {
      flexDirection: "column",
      gap: 1,
      alignItems: "flex-start",
    },
  }),
  image: {
    width: "180px",
    height: "180px",
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
  column: (theme) => ({
    display: "flex",
    flexDirection: "column",
    gap: 1,
    [theme.breakpoints.down(768)]: {
      marginLeft: "0.5rem",
      gap: "4px",
    },
  }),
  row: {
    display: "flex",
    gap: 0.25,
  },
  h1: (theme) => ({
    fontWeight: 600,
    fontSize: "2.25rem",
    lineHeight: "2.5rem",
    color: "#F4F4F4",
    [theme.breakpoints.down(768)]: {
      fontSize: "1.25rem",
      lineHeight: "1.25rem",
      paddingTop: "1.25rem",
    },
  }),
  h2: {
    fontWeight: 600,
    fontSize: "1.5rem",
    color: "#F4F4F4",
    lineHeight: "1.5rem",
  },
  h5: {
    fontWeight: 400,
    fontSize: "1.125rem",
    color: "#F4F4F4",
  },
  h3: (theme) => ({
    fontWeight: 400,
    fontSize: "1.125rem",
    color: "#6C6C6C",
    [theme.breakpoints.down(768)]: {
      fontSize: "0.875rem",
    },
  }),
  icon: {
    color: "#f4f4f4",
    fontSize: "1.625rem",
  },
  iconImg: {
    color: "#f4f4f4",
    height: "2.1rem",
    width: "2.1rem",
  },
  statsRow: (theme) => ({
    display: "flex",
    gap: 2,
    ml: "3rem",
    my: 2,
    [theme.breakpoints.down(768)]: {
      ml: "0.5rem",
    },
  }),
  statsCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0.5,
  },
  rowAbout: (theme) => ({
    display: "flex",
    gap: 5,
    my: 2,
    [theme.breakpoints.down(992)]: {
      flexDirection: "column",
    },
  }),
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
  activeButton: (theme) => ({
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
    [theme.breakpoints.down(450)]: {
      fontSize: "1.2rem",
    },
  }),
  regularButton: (theme) => ({
    fontWeight: 400,
    fontSize: "1.5rem",
    color: "#F4F4F4",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#f78c09",
    },
    [theme.breakpoints.down(450)]: {
      fontSize: "1.2rem",
    },
  }),
};

const Img = styled("img")(({ theme }) => ({
  width: "100%",
  height: "45vh",
  objectFit: "cover",
}));

export default NFTPage;
