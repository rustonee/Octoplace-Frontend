/* eslint-disable no-unused-vars */
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Paper,
} from "@mui/material";
import React, {  useRef, useState } from "react";
import { Container } from "react-bootstrap";
import NFTlist from "./NFTlist";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";

function Content({ activeListings, view }) {
  const videoRef = useRef(null);
  const [isOwner, setIsOwner] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [openAddVideo, setOpenAddVideo] = useState(false);
  const [chipData, setChipData] = useState([
    { key: 0, label: "2160p" },
    { key: 1, label: "1080p" },
    { key: 2, label: "720p" },
    { key: 3, label: "480p" },
    { key: 4, label: "360p" },
  ]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  const styles = {
    videoContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
      my: 3,
    },
    videoBox: {
      width: "100%",
      height: "100%",
      borderRadius: "1rem",
      position: "relative",
      overflow: "hidden",
    },
    playIconButton: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 2,
      backgroundColor: "rgba(0,0,0,0.5)",
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.5)",
      },
    },
    playIcon: {
      color: "#fff",
      fontSize: "3rem",
    },
    descriptionContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 5,
      color: "#f4f4f4",
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
    },
    h1: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "0.875rem",
    },
    p: {
      fontWeight: 400,
      fontSize: "1rem",
    },
    pGray: {
      fontWeight: 400,
      fontSize: ".75rem",
      color: "#6C6C6C",
    },
    pWhite: {
      fontWeight: 400,
      fontSize: ".75rem",
      color: "#f4f4f4",
    },
    rContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
    },
    ownerContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 1,
      border: "0.792651px solid #6C6C6C",
      borderRadius: "0.594rem",
    },
    ownerBox: {
      display: "flex",
      flexDirection: "column",
      width: "200px",
      gap: 1,
      px: 3,
      py: 2,
    },
    orangeButton: {
      backgroundColor: "#F78C09",
      color: "#262626",
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1rem",
      borderRadius: "0.594rem",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      gap: 3,
      my: 3,
      color: "#f4f4f4",
    },
    textInput: {
      color: "#f4f4f4",
      borderColor: "#f4f4f4",
    },
  };

  const onDrop = (acceptedFiles) => {
    // Handle dropped files logic here
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handlePlayVideo = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Container>
      {openAddVideo ? (
        <Box sx={styles.formContainer}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "1rem",
            }}
          >
            <Typography sx={styles.h1}>New Video</Typography>

            <TextField
              type="url"
              variant="standard"
              hiddenLabel
              InputProps={{
                style: {
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                },
                disableUnderline: true,
                size: "small",
                placeholder: "| Enter URL",
              }}
            />

            <Typography sx={styles.h1}>or</Typography>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "25vh",
                backgroundColor: "#3D3D3D",
                borderRadius: "0.594rem",
                cursor: "pointer",
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <p>Drag &amp; Drop Input (Video File)</p>
              )}
            </div>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Paper
                sx={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  listStyle: "none",
                  gap: 2,
                  py: 0.5,
                  px: 2,
                  m: 0,
                  backgroundColor: "transparent",
                  border: "1px solid white",
                  color: "white",
                }}
                component="ul"
              >
                {chipData.map((data) => {
                  return (
                    <Box key={data.key}>
                      <Chip
                        clickable={true}
                        label={data.label}
                        onDelete={handleDelete(data)}
                        sx={{
                          border: "1px solid white",
                          borderRadius: "0.594rem",
                          color: "white",
                          //change color of delete icon
                          "& .MuiChip-deleteIcon": {
                            color: "white",
                          },
                        }}
                        deleteIcon={<CloseIcon />}
                      />
                    </Box>
                  );
                })}
              </Paper>
              <FormControl variant="standard" sx={{ display: "flex", flex: 1 }}>
                <Select
                  sx={{
                    color: "white",
                    backgroundColor: "transparent",
                    border: "1px solid white",
                    borderRadius: "0.594rem",
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: "transparent",
                    },
                    "& .MuiSelect-select:not(:focus):not([multiple]):not([disabled])":
                      {
                        color: "white",
                      },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                  }}
                  value={""}
                >
                  <MenuItem value="">Select an option</MenuItem>
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              type="text"
              variant="standard"
              hiddenLabel
              InputProps={{
                style: {
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                  "& .MuiInputBase-input": {
                    padding: 0,
                  },
                },
                disableUnderline: true,
                size: "small",
                placeholder: "| Enter Video Name",
              }}
            />
            <TextField
              type="text"
              variant="standard"
              hiddenLabel
              InputProps={{
                style: {
                  backgroundColor: "#3D3D3D",
                  color: "white",
                  border: "1px solid white",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                  "& .MuiInputBase-input": {
                    padding: 0,
                  },
                  // make zero the padding of the input text
                },
                disableUnderline: true,
                size: "small",
                placeholder: "| Collection Address (Optional)",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 3,
                color: "white",
              }}
            >
              <Typography sx={styles.h3}>Select NFT Network</Typography>
              <FormControl
                variant="standard"
                sx={{ display: "flex", flex: 1 / 2 }}
              >
                <Select
                  sx={{
                    color: "white",
                    backgroundColor: "transparent",
                    border: "1px solid white",
                    borderRadius: "0.594rem",
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: "transparent",
                    },
                    "& .MuiSelect-select:not(:focus):not([multiple]):not([disabled])":
                      {
                        color: "white",
                      },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                  }}
                  value={""}
                >
                  <MenuItem value="">Select an option</MenuItem>
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Typography
              sx={{
                color: "#6C6C6C",
                fontSize: "1.125rem",
              }}
            >
              If a collection address is added, users MUST have at least one NFT
              from the specified collection in order to view the video
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "justify-between",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#3D3D3D",
                  color: "#151515",
                  flex: 1,
                }}
                type="submit"
                variant="contained"
              >
                CANCEL
              </Button>
              <Button
                sx={{
                  backgroundColor: "#F78C09",
                  color: "#151515",
                  flex: 1,
                }}
                type="submit"
                variant="contained"
                color="primary"
              >
                SAVE
              </Button>
            </Box>
          </form>
        </Box>
      ) : (
        <Box sx={styles.videoContainer}>
          <Box sx={styles.videoBox}>
            {showButton && (
              <IconButton sx={styles.playIconButton} onClick={handlePlayVideo}>
                {isPlaying ? (
                  <PauseRounded sx={styles.playIcon} />
                ) : (
                  <PlayArrowRounded sx={styles.playIcon} />
                )}
              </IconButton>
            )}
            <video
              muted
              playsInline
              width="100%"
              height={800}
              controls
              ref={videoRef}
              src="https://d21ozv67drxbfu.cloudfront.net/appietoday.test/media/2017/09/04/asset-1175875-1504515710530864.mp4"
            ></video>
          </Box>
          <Box sx={styles.descriptionContainer}>
            <Box sx={styles.textContainer}>
              <Typography sx={styles.h1}>Video Title</Typography>
              <Typography sx={styles.p}>
                MATRËSHKA (Matryoshka) dollhouse is an NFT-based project
                revolving around storytelling and a series of tasks to be
                completed by the holders to acquire a prize with a real-life
                value in the end. The collection aims to entertain the
                supporters, while pushing the boundaries of classic
                straightforward lore development by adding interactivity and the
                need for progression. Lore-friendly breeding-like mechanic,
                advantages for completing a set, unique merchandise, blockchain
                DRM technologies and various tangible utilities - expect these
                and many more perks!
              </Typography>
            </Box>
            {/* <Box sx={styles.rContainer}>
              <Box sx={styles.ownerContainer}>
                <Box sx={styles.ownerBox}>
                  <Typography sx={styles.h2}>Theta Punks</Typography>
                  <Typography sx={styles.pGray}>Theta Punks</Typography>
                  <Typography sx={styles.pWhite}>
                    Following NFT Collection is required to Play the video.
                  </Typography>
                </Box>
                <img
                  src={thetaImage}
                  alt="profile-image"
                  style={{
                    width: "140px",
                    height: "100%",
                    borderRadius: ".594rem",
                  }}
                />
              </Box>
              {isOwner ? (
                <Button
                  onClick={() => setOpenAddVideo(true)}
                  sx={styles.orangeButton}
                >
                  Add Video
                </Button>
              ) : null}
            </Box> */}
          </Box>
        </Box>
      )}
      <NFTlist activeListings={activeListings.slice(0, 6)} view={view} />
    </Container>
  );
}

export default Content;
