/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Grid, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { getActiveListings } from "../../utils/format-listings";
import { addMyListings } from "../../redux/slices/my-nft-slice";
import { NFTListingCard } from "../listings/components/ListingCard";

export const MyListedNFT = (props) => {
  // eslint-disable-next-line no-unused-vars
  const {view } = props;
  const loading = useSelector((state) => state.app.isLoading);
  const { account } = useWeb3React();
  const listings = useSelector((state) => state.listings.allListings);
  const dispatch = useDispatch();
  const userListings = useSelector((state) => state.myNFT.nftListings);

  useEffect(() => {
    if (listings.length > 0) {
      const active = getActiveListings(listings);
      const myListings = active.filter(
        (item) => item.listingDetails.tokenOwner === account
      );
      dispatch(addMyListings(myListings));
    }
  }, [listings, account]);
  return (
    <Grid container spacing={2}>
      {!account && (
        <div style={{ textAlign: "center", width: "100%", marginTop: "10vh" }}>
          <Typography variant="h4" sx={{ color: "grey", textAlign: "center" }}>
            Connect your wallet to browse your listings.
          </Typography>
        </div>
      )}
      {account && userListings.length === 0 && !loading && (
        <div style={{ textAlign: "center", width: "100%", marginTop: "10vh" }}>
          <Typography variant="h4" sx={{ color: "grey", textAlign: "center" }}>
            You have not listed any NFT's.
          </Typography>
        </div>
      )}
      {view !== 1 &&
        userListings.map((item, index) => {
          return (
            <Grid key={`index_${index}`} item xs={12} sm={6} md={view}>
              {<NFTListingCard listingItem={item} view={view} />}
            </Grid>
          );
        })}
      {loading && (
        <div style={{ textAlign: "center", width: "100%", marginTop: "10vh" }}>
          <CircularProgress color="primary" />
        </div>
      )}
    </Grid>
  );
};
