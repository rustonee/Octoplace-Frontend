/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import GridPng from "../../assets/grid.png";
import { useWeb3React } from "@web3-react/core";
import { PRICE_WEI, SPACE_WIDTH } from "../../constants/nftMillions";
import Spots from "./Spots";
import contract from "../../contracts";
import { ethers } from "ethers";
import useGrid from "../../hook/useGrid";

export const NFTMillion = () => {
  let { grid, spots, receivedSpots, totalSpots, pixelsUsed, isGridLoading } =
    useGrid();

  const [dim, setDim] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [buying, setBuying] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("https://");
  const [linkUrl, setLinkUrl] = useState("https://");
  const [editIndex, setEditIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useWeb3React();

  const isConnected = () => {
    if (account && account !== "" && account.length > 0) {
      return true;
    }
    return false;
  };

  spots = spots.filter((s) => s !== undefined);

  const hideInfo = () => setIsInfoVisible(false);
  const dragStop = (x, y) => {
    setDim({ ...dim, x, y });
    setIsInfoVisible(true);
  };

  const spot = {
    x: Math.round(dim.x / SPACE_WIDTH),
    y: Math.round(dim.y / SPACE_WIDTH),
    width: Math.round(dim.width / SPACE_WIDTH),
    height: Math.round(dim.height / SPACE_WIDTH),
    title,
    image: imageUrl,
    link: linkUrl,
    owner: isConnected() ? account : "-",
    _index: editIndex,
  };

  let isOverlapping = false;
  if (buying && isInfoVisible) {
    // calculate minimal cost
    for (let i = 0; i < spot.width; i += 1) {
      for (let k = 0; k < spot.height; k += 1) {
        if (grid[spot.x + i][spot.y + k]) {
          isOverlapping = true;
          break;
        }
      }
    }
  }
  const totalPixels = dim.width * dim.height;
  const weiValue = PRICE_WEI.mul(totalPixels);
  const costText = ethers.utils.commify(
    ethers.utils.formatEther(weiValue).slice(0, -2)
  ); // slice removes the '.0' at the end
  // let enoughFunds = false;

  let mySpots = [];
  if (isConnected()) {
    const myAddress = account.toLowerCase();
    const balance = (mySpots = spots.filter(
      (s) => s.owner.toLowerCase() === myAddress
    ));
    // enoughFunds = connection.balanceBigNumber.gte(weiValue);
  }

  function selectSpot(idStr) {
    if (idStr === "-1") {
      // unset
      setTitle("");
      setImageUrl("https://");
      setLinkUrl("https://");
      setEditIndex(-1);
      return;
    }
    const index = parseInt(idStr, 10);
    const spot = spots.find((s) => s._index === index);
    if (!spot) {
      return;
    }
    setBuying(false);
    setDim({
      x: spot.x * SPACE_WIDTH,
      y: spot.y * SPACE_WIDTH,
      width: spot.width * SPACE_WIDTH,
      height: spot.height * SPACE_WIDTH,
    });
    setTitle(spot.title);
    setImageUrl(spot.image);
    setLinkUrl(spot.link);
    setEditIndex(index);
  }

  function buy() {
    setDim({
      x: 400,
      y: 100,
      width: 200,
      height: 200,
    });
    setTitle("");
    setImageUrl("https://");
    setLinkUrl("https://");
    setEditIndex(-1);
    setBuying(true);
  }

  const isEditing = editIndex !== -1;

  let spotInfo;
  if (totalSpots === -1) {
    spotInfo = "Loading information from blockchain...";
  } else if (receivedSpots === totalSpots) {
    spotInfo = (
      <>
        Available: {(1_000_000 - pixelsUsed).toLocaleString("en")} pixels /
        Sold: {pixelsUsed.toLocaleString("en")} pixels
      </>
    );
  } else {
    spotInfo = (
      <strong>
        Downloading spots... {receivedSpots}/{totalSpots}
      </strong>
    );
  }

  async function contractBuy() {
    setIsLoading(true);
    await contract.buySpot(spot, weiValue);
    setIsLoading(false);
    setBuying(false);
  }

  async function contractUpdate() {
    setIsLoading(true);
    await contract.updateSpot(spot);
    setIsLoading(false);
    selectSpot("-1");
  }

  return (
    <NFTMillionContainer>
      {isGridLoading || totalSpots === -1 || isLoading ? (
        <LoaderContainer>
          <CircularProgress
            style={{ width: "100px", height: "100px", color: "#1976d2" }}
          />
        </LoaderContainer>
      ) : (
        <Spots
          spots={spots}
          editIndex={editIndex}
          editImageUrl={isEditing ? imageUrl : ""}
          editLinkUrl={isEditing ? linkUrl : ""}
          editTitle={isEditing ? title : ""}
        />
      )}
      {/* {
                (buying || isEditing) && 
                <Box sx={{ left: `${Math.min(dim.x, 600)}px`, top: dim.y < 500 ? `${dim.y + dim.height + 20}px` : undefined, bottom: dim.y >= 500 ? `${1000 - dim.y + 20}px` : undefined }}>

                </Box>
            } */}
    </NFTMillionContainer>
  );
};

const NFTMillionContainer = styled(Box)(({ theme }) => ({
  width: "1000px",
  height: "1000px",
  margin: "10px auto",
  position: "relative",
  background: `#eee url(${GridPng})`,
  boxShadow: "0 0 4px 1px rgba(0, 0, 0, 0.5)",
  userSelect: "none",
  marginBottom: '40px',
  [theme.breakpoints.down(1076)]: {
    display: 'none'
  }
}));

const LoaderContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
