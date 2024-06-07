/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NFTListingCard } from "./ListingCard";
import { getActiveListings } from "../../../utils/format-listings";
import { setActiveListings } from "../../../redux/slices/listing-slice";

export const ActiveListings = (props) => {
  const { view } = props;

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.allListings);
  const activeListings = useSelector((state) => state.listings.activeListings);

  useEffect(() => {
    if (listings.length > 0) {
      const active = getActiveListings(listings);
      dispatch(setActiveListings(active));
    }
  }, [listings]);

  return (
    <Fragment>
      <Grid container spacing={2}>
        {view !== 1 &&
          activeListings.length > 0 &&
          activeListings.map((item, index) => {
            return (
              <Grid key={`index_${index}`} item xs={12} sm={6} md={view}>
                <NFTListingCard listingItem={item} view={view} />
              </Grid>
            );
          })}
      </Grid>
    </Fragment>
  );
};
