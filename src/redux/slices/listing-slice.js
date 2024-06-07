import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allListings: [],
  activeListings: [],
  completedListings: [],
  offers: [],
  selectedTab: 0,
};

export const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setAllListings: (state, action) => {
      const searchRes = state.allListings.filter(
        (item) =>
          item.listingDetails.tokenAddress.toLowerCase() ===
            action.payload.listingDetails.tokenAddress.toLowerCase() &&
          item.listingDetails.tokenId ===
            action.payload.listingDetails.tokenId &&
          item.listingDetails.listingid ===
            action.payload.listingDetails.listingid
      );
      if (searchRes.length === 0) {
        state.allListings = [...state.allListings, action.payload];
      }
    },
    setActiveListings: (state, action) => {
      state.activeListings = action.payload;
    },
    setCompletedListings: (state, action) => {
      state.completedListings = action.payload;
    },
    setOffers: (state, action) => {
      state.offers = action.payload;
    },
    resetListings: (state) => {
      state.activeListings = [];
      state.allListings = [];
      state.completedListings = [];
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAllListings,
  setActiveListings,
  setCompletedListings,
  setOffers,
  resetListings,
  setSelectedTab,
} = listingSlice.actions;

export default listingSlice.reducer;
