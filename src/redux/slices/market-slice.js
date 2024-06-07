import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllMarketItems } from "../thunk/get-all-market-items";
import { getMyMarketItems } from "../thunk/get-all-market-items";
import { getMarketNFTDetail } from "../thunk/getNftDetail";

const initialState = {
  isLoading: false,
  markets: [],
  myMarketItems: [],
};

export const marketSlice = createSlice({
  name: "markets",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setMarkets: (state, action) => {
      state.markets = action.payload;
    },
    setMyMarketItems: (state, action) => {
      state.myMarketItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllMarketItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllMarketItems.fulfilled, (state, { payload }) => {
      state.markets = payload;
      state.isLoading = false;
    });
    builder.addCase(getAllMarketItems.rejected, (state) => {
      state.isLoading = false;
      toast.error("Error occured while loading markets.");
    });

    builder.addCase(getMyMarketItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMyMarketItems.fulfilled, (state, { payload }) => {
      state.myMarketItems = payload;
      state.isLoading = false;
    });
    builder.addCase(getMyMarketItems.rejected, (state) => {
      state.isLoading = false;
      toast.error("Error occured while loading my markets.");
    });

    builder.addCase(getMarketNFTDetail.fulfilled, (state, { payload }) => {
      const listingId = payload.listingId;
      const objIndex = state.markets.findIndex((obj) => obj.id === listingId);
      let items = state.markets;
      let item = items[objIndex];
      item = {
        ...item,
        nftDetails: payload.nft,
      };

      items[objIndex] = item;
      state.markets = items;
    });
    builder.addCase(getMarketNFTDetail.rejected, (state) => {
      toast.error("Error occured while loading NFT Details.");
    });
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setMarkets } = marketSlice.actions;

export default marketSlice.reducer;
