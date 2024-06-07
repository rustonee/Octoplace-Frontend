/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Container } from "react-bootstrap";
import { Box } from "@mui/material";

import CarouselHome from "../components/CarouselHome";
import { getActiveListings } from "../utils/format-listings";
import { setActiveListings } from "../redux/slices/listing-slice";
import { PopularNFTs } from "./analytics/popular-nfts";
import { PopularCollections } from "./analytics/popular-collections";
// import Market from "./market/Market";
// import Swap from "./market/Swap";
// import Auction from "./market/Auction";
// import TableComponent from "../components/TableComponent";
import { NFTMillion } from "./NFTMillion";
import { styled } from "@mui/system";

export const Home = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.allListings);
  // const activeListings = useSelector((state) => state.listings.activeListings);
  // const [view, setView] = useState(3);
  // const [orderMethod, setOrderMethod] = useState("Price: Low to High");
  // const [activeTab, setActiveTab] = useState("Market");

  // const collections = useSelector((state) => state.listings.collections);

  useEffect(() => {
    if (listings.length > 0) {
      const active = getActiveListings(listings);
      dispatch(setActiveListings(active));
    }
  }, [listings]);

  return (
    <Box>
      <CarouselHome />
      <NFTDataContainer>
        <PopularCollections title="Popular Collections" />
        <PopularNFTs title="Popular NFTs" />
        {/* <TableComponent list={activeListings} /> */}
        <NFTMillion />
      </NFTDataContainer>
      {/* <Container>
        <Box className="market-menu">
          <Button
            onClick={() => {
              setActiveTab("Market");
            }}
            className={activeTab === "Market" ? "active-button" : "regular-btn"}
          >
            Market
          </Button>
          <Button
            onClick={() => {
              setActiveTab("Swap");
            }}
            className={activeTab === "Swap" ? "active-button" : "regular-btn"}
          >
            Swap
          </Button>
          <Button
            onClick={() => {
              setActiveTab("Auction");
            }}
            className={
              activeTab === "Auction" ? "active-button" : "regular-btn"
            }
          >
            Auction
          </Button>
        </Box>
        {activeTab === "Market" && <Market isHome={true} />}
        {activeTab === "Swap" && <Swap isHome={true} />}
        {activeTab === "Auction" && <Auction isHome={true} />}
      </Container> */}
    </Box>
  );
};

const NFTDataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
}));
