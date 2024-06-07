import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getCollectionDiscussions, getNftDiscussions } from "../thunk/get-discussions";

const initialState = {
  isLoading: false,
  selectedNFTDiscussions: [],
  selectedCollectionDiscussions: [],
  
};

export const discussionSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setNFTDiscussions: (state, action) => {
      state.selectedNFTDiscussions = action.payload;
    },
    setCollectionDiscussions: (state, { payload }) => {
      state.selectedCollectionDiscussions = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNftDiscussions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getNftDiscussions.fulfilled, (state, { payload }) => {
      state.selectedNFTDiscussions = payload;
      state.isLoading = false;
    });
    builder.addCase(getNftDiscussions.rejected, (state) => {
      state.isLoading = false;
      toast.error("Error occured while loading nft discussions.");
    });
    builder.addCase(getCollectionDiscussions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCollectionDiscussions.fulfilled, (state, { payload }) => {
      state.selectedCollectionDiscussions = payload;
      state.isLoading = false;
    });
    builder.addCase(getCollectionDiscussions.rejected, (state) => {
      state.isLoading = false;
      toast.error("Error occured while loading collection discussions.");
    });
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setCollectionDiscussions, setNFTDiscussions } =
  discussionSlice.actions;

export default discussionSlice.reducer;
