import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getPopularCollections, getPopularNFTs } from "../thunk/get-analytics";

const initialState = {
  isNFTLoading: false,
  isCollectionLoading: false,
  popularNFTs: [],
  popularCollections: []
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isNFTLoading = action.payload;
      state.isCollectionLoading = action.payload;
    },
    setPopularNFTs: (state, action) => {
      state.collections = action.payload;
    },
    setPopularCollections: (state, { payload }) => {
      state.selectedCollection = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPopularCollections.pending, (state) => {
      state.isCollectionLoading = true;
    });
    builder.addCase(getPopularCollections.fulfilled, (state, { payload }) => {
      state.popularCollections = payload;
      state.isCollectionLoading = false;
    });
    builder.addCase(getPopularCollections.rejected, (state) => {
      state.isCollectionLoading = false;
      toast.error("Error occured while loading popular collections.");
    });
    builder.addCase(getPopularNFTs.pending, (state) => {
      state.isNFTLoading = true;
    });
    builder.addCase(getPopularNFTs.fulfilled, (state, { payload }) => {
      state.isNFTLoading = false;
      state.popularNFTs = payload;
    });
    builder.addCase(getPopularNFTs.rejected, (state) => {
      state.isNFTLoading = false;
      toast.error("Error occured while loading popular NFTs.");
    });
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setPopularCollections, setPopularNFTs } =
  analyticsSlice.actions;

export default analyticsSlice.reducer;
