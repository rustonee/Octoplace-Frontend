/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { Box, Typography, Button, TextField } from "@mui/material";
import { Container } from "react-bootstrap";
import InputAdornment from "@mui/material/InputAdornment";
import { useDropzone } from "react-dropzone";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import BuildIcon from "@mui/icons-material/Build";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { FacebookRounded } from "@mui/icons-material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTiktok, FaInstagram, FaDiscord } from "react-icons/fa";
import { BsMedium } from "react-icons/bs";
import {
  registerOrFetchUserSetting,
  fetchUserSetting,
  updateUserSetting,
  loggingUserRegistration,
} from "../../redux/thunk/user-setting";
import bgImage from "../../assets/GrayBackground.jpeg";
import avatarImage from "../../assets/default-user.jpg";
import brokenImage from "../../assets/broken.png";
import PickDialog from "./components/pickDialog";
import { styled } from "@mui/system";

import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";
import { setToken } from "../../redux/slices/accout-slice";

import { generateToken, verifyToken } from "../../utils/auth-utils";

const styles = {
  container: {
    position: "relative",
    display: "inline-block",
  },
  buildIcon: {
    position: "absolute",
    top: "35vh",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 5,
  },
  photoIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 5,
    color: "#F4F4F4",
  },
  editIcon: {
    color: "#F4F4F4",
    fontSize: "4rem",
  },
  imagess: {
    display: "block",
    width: "180px",
    height: "180px",
  },
  containerHovered: {
    "& $buildIcon": {
      opacity: 1,
    },
  },
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
    "&.Mui-disabled": {
      color: "#6c6c6c",
    },
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
    width: "100%",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    mt: 3,
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
  },
  aboutContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "100%",
  },
  socialcontent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    width: "100%",
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
  basic: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

function DashboardSettings() {
  const sendDataToGTM = useGTMDispatch();

  const dispatch = useDispatch();
  const { library, account } = useWeb3React();
  const token = useSelector((state) => state.account.token);

  const [userSetting, setUserSetting] = useState({});
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [youtube, setYT] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [medium, setMedium] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [bannerSrc, setBannerSrc] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("");
  const [isAvatarUpdated, avatarUpdated] = useState(false);
  const [isBannerUpdated, bannerUpdated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [hoveredBG, setHoveredBG] = useState(false);
  const [hoveredPP, setHoveredPP] = useState(false);
  const [hoveredNFT1, setHoveredNFT1] = useState(false);
  const [hoveredNFT2, setHoveredNFT2] = useState(false);
  const [hoveredNFT3, setHoveredNFT3] = useState(false);
  const [openNFT1, setOpenNFT1] = useState(false);
  const [openNFT2, setOpenNFT2] = useState(false);
  const [openNFT3, setOpenNFT3] = useState(false);

  const onDrop = (acceptedFiles) => {
    // Handle dropped files logic here
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const loadData = async () => {
      try {
        let fetchedData = await fetchUserSetting(account);
        if (!fetchedData) {
          let newToken = "";
          if (!token || !(await verifyToken(token))) {
            newToken = await generateToken(library);
            dispatch(setToken(newToken));
          }

          fetchedData = await registerOrFetchUserSetting(
            newToken ? newToken : token,
            account,
            "theta"
          );

          // logging
          loggingUserRegistration(account);
        }

        setUserSetting(fetchedData);

        if (fetchedData !== undefined) {
          setTitle(fetchedData.title || "");
          setAbout(fetchedData.description || "");
          setTelegram(fetchedData.telegram || "");
          setTwitter(fetchedData.twitter || "");
          setDiscord(fetchedData.discord || "");
          setInstagram(fetchedData.instagram || "");
          setFacebook(fetchedData.facebook || "");
          setYT(fetchedData.youtube || "");
          setMedium(fetchedData.medium || "");
          setTiktok(fetchedData.tictok || "");
        }
      } catch (error) {
        console.log("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [account]);

  const handleBannerClick = () => {
    const bannerInput = document.getElementById("bannerInput");
    bannerInput.click();
  };

  const handleAvatarClick = () => {
    const avatarInput = document.getElementById("avatarInput");
    avatarInput.click();
  };

  const handleBannerSelection = (event) => {
    const bannerInput = document.getElementById("bannerInput");
    if (bannerInput && bannerInput.files && bannerInput.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        setBannerSrc(e.target.result);
        bannerUpdated(true);
      };
      const val = reader.readAsDataURL(bannerInput.files[0]);
      // console.log(val);
    }
  };

  const handleAvatarSelection = (event) => {
    const avatarInput = document.getElementById("avatarInput");
    if (avatarInput && avatarInput.files && avatarInput.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        setAvatarSrc(e.target.result);
        avatarUpdated(true);
      };
      const val = reader.readAsDataURL(avatarInput.files[0]);
      // console.log(val);
    }
  };

  const handleSave = async () => {
    let saveObj = {};

    if (isBannerUpdated) {
      saveObj = {
        ...saveObj,
        bannerImage: bannerSrc,
      };
    }

    if (isAvatarUpdated) {
      saveObj = {
        ...saveObj,
        avatarImage: avatarSrc,
      };
    }

    saveObj = {
      ...saveObj,
      // walletAddress: account,
      title: title,
      description: about,
      facebook: facebook,
      twitter: twitter,
      instagram: instagram,
      discord: discord,
      tictok: tiktok,
      youtube: youtube,
      medium: medium,
      telegram: telegram,
    };

    try {
      let newToken = "";
      if (!token || !(await verifyToken(token))) {
        newToken = await generateToken(library);
        dispatch(setToken(newToken));
      }

      const fetchedData = await updateUserSetting(
        newToken ? newToken : token,
        saveObj
      );
      toast.success(fetchedData.message, {
        position: "top-center",
      });

      bannerUpdated(false);
      avatarUpdated(false);

      sendDataToGTM({
        event: "Save profile",
        customData: `address: ${account}`,
      });

      setLoading(false);
    } catch (error) {
      // Handle error here, e.g. show an error message
      console.log("Error loading data:", error);
      toast.error(error.message, {
        position: "top-center",
      });

      bannerUpdated(false);
      avatarUpdated(false);
      setLoading(false);
    }
  };

  const onClosePickDialog = async () => {
    try {
      const fetchedData = await registerOrFetchUserSetting(account, "theta");
      setUserSetting(fetchedData);
    } catch (error) {
      // Handle error here, e.g. show an error message
      console.log("Error loading data:", error);
    }
  };

  return (
    <Box>
      {openNFT1 && (
        <PickDialog
          open={openNFT1}
          setOpen={setOpenNFT1}
          onClose={onClosePickDialog}
          wallet={account}
          nftIndex={1}
        />
      )}
      {openNFT2 && (
        <PickDialog
          open={openNFT2}
          setOpen={setOpenNFT2}
          onClose={onClosePickDialog}
          wallet={account}
          nftIndex={2}
        />
      )}
      {openNFT3 && (
        <PickDialog
          open={openNFT3}
          setOpen={setOpenNFT3}
          onClose={onClosePickDialog}
          wallet={account}
          nftIndex={3}
        />
      )}
      <div>
        <input
          //   {...getInputProps()}
          onChange={handleBannerSelection}
          id="bannerInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
        <div
          onMouseEnter={() => setHoveredBG(true)}
          onMouseLeave={() => setHoveredBG(false)}
        >
          <img
            src={
              bannerSrc
                ? bannerSrc
                : userSetting.bannerImage
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
          {hoveredBG && (
            <Button
              onClick={handleBannerClick}
              component="label"
              sx={styles.buildIcon}
            >
              <AddAPhotoIcon sx={styles.editIcon} />
            </Button>
          )}
        </div>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container>
          <UserContainer>
            <AvatarGroupContainer>
              <UserAvatarContainer>
                <div
                  onMouseEnter={() => setHoveredPP(true)}
                  onMouseLeave={() => setHoveredPP(false)}
                  style={styles.container}
                >
                  <img
                    src={
                      avatarSrc
                        ? avatarSrc
                        : userSetting.avatarImage
                        ? process.env.REACT_APP_API_URL +
                          userSetting.avatarImage
                        : avatarImage
                    }
                    alt="USer avatar"
                    style={styles.image}
                    width="180px"
                    height="180px"
                  />
                  <input
                    id="avatarInput"
                    type="file"
                    onChange={handleAvatarSelection}
                    style={{ display: "none" }}
                  />
                  {hoveredPP && (
                    <Button sx={styles.photoIcon} onClick={handleAvatarClick}>
                      <AddAPhotoRoundedIcon sx={styles.editIcon} />
                    </Button>
                  )}
                </div>
                <Box sx={styles.column}>
                  <UserTextField
                    type="url"
                    variant="standard"
                    hiddenLabel
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#6c6c6c",
                      },
                    }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-wo-padding"
                    InputProps={{
                      disableUnderline: true,
                      size: "small",
                      placeholder: "| User Title",
                    }}
                  />
                </Box>
              </UserAvatarContainer>
              <Box sx={styles.rightRow}>
                <div
                  onMouseEnter={() => setHoveredNFT1(true)}
                  onMouseLeave={() => setHoveredNFT1(false)}
                  //center the button inside the div on image
                  style={styles.container}
                >
                  <NFT1Image
                    src={
                      (userSetting &&
                        userSetting.nft1 &&
                        userSetting.nft1.bannerImage) ||
                      brokenImage
                    }
                    alt="bg-image"
                  />
                  {hoveredNFT1 && (
                    <Button
                      onClick={() => setOpenNFT1(true)}
                      sx={styles.photoIcon}
                    >
                      <BuildIcon sx={styles.editIcon} />
                    </Button>
                  )}
                </div>
                <div
                  onMouseEnter={() => setHoveredNFT2(true)}
                  onMouseLeave={() => setHoveredNFT2(false)}
                  style={styles.container}
                >
                  <NFT2Image
                    src={
                      (userSetting &&
                        userSetting.nft2 &&
                        userSetting.nft2.bannerImage) ||
                      brokenImage
                    }
                    alt="bg-image"
                  />
                  {hoveredNFT2 && (
                    <Button
                      sx={styles.photoIcon}
                      onClick={() => setOpenNFT2(true)}
                    >
                      <BuildIcon sx={styles.editIcon} />
                    </Button>
                  )}
                </div>
                <div
                  onMouseEnter={() => setHoveredNFT3(true)}
                  onMouseLeave={() => setHoveredNFT3(false)}
                  style={styles.container}
                >
                  <NFT1Image
                    src={
                      (userSetting &&
                        userSetting.nft3 &&
                        userSetting.nft3.bannerImage) ||
                      brokenImage
                    }
                    alt="bg-image"
                  />
                  {hoveredNFT3 && (
                    <Button
                      sx={styles.photoIcon}
                      onClick={() => setOpenNFT3(true)}
                    >
                      <BuildIcon sx={styles.editIcon} />
                    </Button>
                  )}
                </div>
              </Box>
            </AvatarGroupContainer>
            <UserDetailsContainer>
              <Box sx={styles.aboutContent}>
                <Typography sx={styles.h2}>About</Typography>
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#3D3D3D",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| Input Description",
                    rows: 5,
                    multiline: true,
                  }}
                />
                <Button
                  sx={styles.orangeButton}
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                >
                  Save
                </Button>
              </Box>
              <Box sx={styles.socialcontent}>
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#151515",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| telegram.com/username",
                    startAdornment: (
                      <InputAdornment position="start">
                        <TelegramIcon sx={styles.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#151515",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| twitter.com/username",
                    startAdornment: (
                      <InputAdornment position="start">
                        <TwitterIcon sx={styles.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#151515",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| facebook.com/username",
                    startAdornment: (
                      <InputAdornment position="start">
                        <FacebookRounded sx={styles.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#151515",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| instagram.com/username",
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaInstagram style={styles.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#151515",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| discord.gg/username",
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaDiscord style={styles.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#151515",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| tiktok.com/@username",
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaTiktok style={styles.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={youtube}
                  onChange={(e) => setYT(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#151515",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| youtube.com/channel/username",
                    startAdornment: (
                      <InputAdornment position="start">
                        <YouTubeIcon sx={styles.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="url"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  InputProps={{
                    style: {
                      backgroundColor: "#151515",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| medium.com/username",
                    startAdornment: (
                      <InputAdornment position="start">
                        <BsMedium style={styles.icon} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </UserDetailsContainer>
          </UserContainer>
        </Container>
      </Box>
    </Box>
  );
}

const UserContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
}));

const AvatarGroupContainer = styled(Box)(({ theme }) => ({
  marginTop: "-10vh",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  [theme.breakpoints.down(992)]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "24px",
  },
}));

const UserAvatarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  gap: "24px",
  width: "100%",
  [theme.breakpoints.down(570)]: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const UserDetailsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "24px",
  mt: 3,
  [theme.breakpoints.down(768)]: {
    flexDirection: "column",
  },
}));

const NFT1Image = styled("img")(({ theme }) => ({
  width: "120px",
  height: "120px",
  objectFit: "cover",
  borderRadius: "1.2rem",
  border: "4px solid #F78C09",
  [theme.breakpoints.down(480)]: {
    width: "80px",
    height: "80px",
  },
}));

const NFT2Image = styled("img")(({ theme }) => ({
  width: "150px",
  height: "150px",
  objectFit: "cover",
  borderRadius: "1.2rem",
  border: "4px solid #F78C09",
  [theme.breakpoints.down(480)]: {
    width: "100px",
    height: "100px",
  },
}));

const UserTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: "#3D3D3D",
  color: "#6C6C6C",
  border: "1px solid #6C6C6C",
  borderRadius: "0.594rem",
  padding: "0.5rem",
  width: "20rem",
  [theme.breakpoints.down(992)]: {
    width: "100%",
  },
  "& .": {
    padding: "0px",
  },
}));

export default DashboardSettings;
