/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, TextField, Tooltip } from "@mui/material";
import { Container } from "react-bootstrap";
import InputAdornment from "@mui/material/InputAdornment";

import bgImage from "../../assets/GrayBackground.jpeg";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

import { FacebookRounded, Info, SaveAlt, Settings } from "@mui/icons-material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTiktok, FaInstagram, FaDiscord } from "react-icons/fa";
import { BsMedium } from "react-icons/bs";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionSettings } from "../../redux/thunk/get-collection-setting";
import { updateCollectionSettings } from "../../redux/thunk/update-collection-settings";
import { getRoyaltyInfo } from "../../redux/thunk/get-royalty-info";
import { useWeb3React } from "@web3-react/core";
import { getCollectionOwner } from "../../redux/thunk/get-collection-owner";
import { useTheme } from "@mui/material";
import {
  setTxDialogFailed,
  setTxDialogHash,
  setTxDialogPending,
  setTxDialogSuccess,
  showTxDialog,
} from "../../redux/slices/app-slice";
import { getNetworkInfo } from "../../connectors/networks";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { toast } from "react-toastify";

function CollectionSettings() {
  const [hoveredBG, setHoveredBG] = useState(false);
  const [hoveredPP, setHoveredPP] = useState(false);
  const { collectionAddress, network } = useParams();
  const [about, setAbout] = useState(null);
  const [title, setTitle] = useState(null);
  const [telegram, setTelegram] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [discord, setDiscord] = useState(null);
  const [youtube, setYT] = useState(null);
  const [tiktok, setTiktok] = useState(null);
  const [medium, setMedium] = useState(null);
  const [insta, setInsta] = useState(null);
  const [facebook, setFacebook] = useState(null);
  const [bannerSrc, setBannerSrc] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [isAvatarUpdated, avatarUpdated] = useState(false);
  const [isBannerUpdated, bannerUpdated] = useState(false);
  const [royaltyReceiver, setRoyaltyReceiver] = useState(null);
  const [royaltyBips, setRoyaltyBips] = useState(null);
  const { account, chainId } = useWeb3React();
  const onDrop = (acceptedFiles) => {
    // Handle dropped files logic here
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const owner = useSelector(
    (state) => state.collection.selectedCollectionSetting.owner
  );
  const royalty = useSelector(
    (state) => state.collection.selectedCollectionSetting.royalty
  );

  const dispatch = useDispatch();
  const settings = useSelector(
    (state) => state.collection.selectedCollectionSetting.settings
  );

  useEffect(() => {
    if (collectionAddress && network) {
      dispatch(
        getCollectionSettings({ address: collectionAddress, network: network })
      );
      dispatch(
        getRoyaltyInfo({ address: collectionAddress, network: network })
      );
      dispatch(
        getCollectionOwner({ address: collectionAddress, network: network })
      );
    }
  }, [collectionAddress, network]);
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  useEffect(() => {
    if (settings !== {} && settings !== undefined) {
      setAbout(settings.AboutText);
      setTelegram(settings.Telegram);
      setTitle(settings.CollectionName);
      setTwitter(settings.Twitter);
      setDiscord(settings.Discord);
      setInsta(settings.Instagram);
      setFacebook(settings.Facebook);
      setYT(settings.Youtube);
      setMedium(settings.Medium);
      setTiktok(settings.TikTok);
      if (settings.BannerImage !== null && settings.BannerImage !== undefined) {
        setBannerSrc(Buffer.from(settings.BannerImage).toString());
      }
      if (settings.Avatar !== null && settings.Avatar !== undefined) {
        setAvatarSrc(Buffer.from(settings.Avatar).toString());
      }
    }
  }, [settings]);
  useEffect(() => {
    if (royalty) {
      setRoyaltyReceiver(
        royalty.address !== zeroAddress ? royalty.address : null
      );
      setRoyaltyBips(
        Number(royalty.bips) / 100 > 0 ? Number(royalty.bips) / 100 : null
      );
    }
  }, [royalty]);
  const theme = useTheme();
  const listing = {
    listingNFT: {
      name: "NFT Name",
      contractAddress: "0x1234567890",
      metadata: {
        image: "https://picsum.photos/200",
        description: "NFT Description",
      },
    },
  };
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
      avatarUpdated(true);
    }
  };
  const handleAvatarSelection = (event) => {
    const avatarInput = document.getElementById("avatarInput");
    if (avatarInput && avatarInput.files && avatarInput.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        setAvatarSrc(e.target.result);
        avatarUpdated(true);
        console.log(e);
      };
      const val = reader.readAsDataURL(avatarInput.files[0]);
      console.log(val);
    }
  };

  const handleSave = () => {
    let saveObj = {};
    if (isAvatarUpdated) {
      saveObj = {
        ...saveObj,
        avatar: { updated: isAvatarUpdated, data: avatarSrc },
      };
    }
    if (isBannerUpdated) {
      saveObj = {
        ...saveObj,
        banner: { updated: isBannerUpdated, data: bannerSrc },
      };
    }
    saveObj = {
      ...saveObj,
      name: title,
      aboutText: about,
      facebook,
      twitter,
      instagram: insta,
      discord,
      tikTok: tiktok,
      youtube,
      medium,
      telegram,
      network,
      address: collectionAddress,
      id: settings.Id,
    };

    dispatch(updateCollectionSettings(saveObj));
  };

  const isOwner = () => {
    return account === owner;
  };

  const handleSaveRoyalty = async () => {
    dispatch(showTxDialog());
    const netDetails = getNetworkInfo(network);
    if (chainId !== parseInt(netDetails.dataNetwork.CHAIN_ID)) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [netDetails.switch],
      });
    }
    const provider = new Web3Provider(window.ethereum, "any");
    const signer = await provider.getSigner();
    try {
      const contract = new Contract(
        netDetails.dataNetwork.MARKETPLACE_CONTRACT,
        netDetails.dataNetwork.MARKET_ABI,
        signer
      );
      const txResult = await contract.setCreatorFeeBasisPointsByCreator(
        Number(royaltyBips) * 100,
        royaltyReceiver,
        collectionAddress
      );
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      dispatch(setTxDialogFailed(false));
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      toast.success("Royalty Settings Saved!");
    } catch (err) {
      console.log(err);
      dispatch(setTxDialogFailed(true));
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
    }
  };
  return (
    <Box>
      <div {...getRootProps()}>
        <input
          {...getInputProps()}
          onChange={handleBannerSelection}
          id="bannerInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
        {isDragActive ? (
          <div>
            <img
              src={bgImage}
              alt="bg-img"
              style={{
                width: "100vw",
                height: "45vh",
                objectFit: "cover",
                opacity: 0.5,
              }}
            />
            <Typography variant="h5" sx={styles.photoIcon}>
              Drop the image here ...
            </Typography>
          </div>
        ) : (
          <div
            onMouseEnter={() => setHoveredBG(true)}
            onMouseLeave={() => setHoveredBG(false)}
          >
            <img
              src={bannerSrc ? bannerSrc : bgImage}
              alt="bg-img"
              style={{
                width: "100vw",
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
        )}
      </div>
      {/* <div
        onMouseEnter={() => setHoveredBG(true)}
        onMouseLeave={() => setHoveredBG(false)}
      >
        <img
          src={bannerSrc ? bannerSrc : bgImage}
          alt="bg-img"
          style={{
            width: "100vw",
            height: "45vh",
            objectFit: "cover",
          }}
        />
        <input
          onChange={handleBannerSelection}
          id="bannerInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
        {hoveredBG && (
          <Button onClick={handleBannerClick} sx={styles.buildIcon}>
            <AddAPhotoRoundedIcon sx={styles.editIcon} />
          </Button>
        )}
      </div> */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container>
          <Box style={styles.overlayContainer}>
            <Box sx={styles.imageContainer}>
              <div
                onMouseEnter={() => setHoveredPP(true)}
                onMouseLeave={() => setHoveredPP(false)}
                style={styles.container}
              >
                <img
                  src={avatarSrc ? avatarSrc : "https://picsum.photos/200"}
                  alt="profileImage"
                  className="octagon-image"
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
                <TextField
                  type="url"
                  variant="standard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  hiddenLabel
                  className="input-wo-padding"
                  disabled={!isOwner()}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  InputProps={{
                    style: {
                      backgroundColor: "#3D3D3D",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                      width: "20rem",
                      "& .MuiInputBaseInputMuiInputInput": {
                        padding: 0,
                      },
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| Collection Title",
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.aboutContent}>
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
                  disabled={!isOwner()}
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
                  disabled={!isOwner()}
                  sx={styles.orangeButton}
                  onClick={handleSave}
                  variant="contained"
                >
                  Save
                </Button>
              </Box>
              <Box sx={styles.aboutContent}>
                <Typography sx={styles.h2}>
                  Royalty Info{" "}
                  <Tooltip
                    placement="top-start"
                    title="Please note that setting up the royalty information here will override EIP2981 defined royalty settings."
                  >
                    <Info sx={{ color: theme.palette.grey[700] }} />
                  </Tooltip>{" "}
                </Typography>
                <TextField
                  type="text"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  disabled={!isOwner()}
                  value={royaltyReceiver}
                  onChange={(e) => {
                    setRoyaltyReceiver(e.target.value);
                  }}
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
                    placeholder: "| Royalty Receiving Address",
                    rows: 1,
                    multiline: false,
                  }}
                />
                <TextField
                  type="number"
                  variant="standard"
                  hiddenLabel
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#6c6c6c",
                    },
                  }}
                  disabled={!isOwner()}
                  value={royaltyBips}
                  onChange={(e) => {
                    setRoyaltyBips(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography>%</Typography>
                      </InputAdornment>
                    ),
                    style: {
                      backgroundColor: "#3D3D3D",
                      color: "#6C6C6C",
                      border: "1px solid #6C6C6C",
                      borderRadius: "0.594rem",
                      padding: "0.5rem",
                    },
                    disableUnderline: true,
                    size: "small",
                    placeholder: "| Royalty %",
                    rows: 1,
                    multiline: false,
                  }}
                />
                <Button
                  disabled={!isOwner()}
                  sx={styles.orangeButton}
                  onClick={handleSaveRoyalty}
                  variant="contained"
                >
                  Setup Royalty
                </Button>
              </Box>
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
                disabled={!isOwner()}
                onChange={(e) => setTelegram(e.target.value)}
                InputProps={{
                  style: {
                    backgroundColor: "#151515",
                    color: "#6C6C6C !important",
                    border: "1px solid #6C6C6C",
                    borderRadius: "0.594rem",
                    padding: "0.5rem",
                    "& :disabled": {
                      color: "#fff",
                    },
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
                disabled={!isOwner()}
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
                disabled={!isOwner()}
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
                value={insta}
                disabled={!isOwner()}
                onChange={(e) => setInsta(e.target.value)}
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
                disabled={!isOwner()}
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
                disabled={!isOwner()}
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
                disabled={!isOwner()}
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
                disabled={!isOwner()}
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
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
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
  },
  editIcon: {
    color: "#fff",
    fontSize: "5rem",
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
  },
  socialcontent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
};
export default CollectionSettings;
