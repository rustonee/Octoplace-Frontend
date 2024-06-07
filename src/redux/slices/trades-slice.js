import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllTrades } from "../thunk/get-trades";

const initialState = {
  isLoading: false,
  trades: [],
  myTrades: [],
};

export const tradeSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTrades: (state, action) => {
      state.trades = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTrades.pending, (state) => {
        state.isLoading = true;
    })
    builder.addCase(getAllTrades.fulfilled, (state, {payload}) => {
        state.trades = payload;
        state.isLoading = false;
    })
    builder.addCase(getAllTrades.rejected, (state) => {
        state.isLoading = false;
        toast.error("Error occured while loading trades.")
    })
  }
});

// Action creators are generated for each case reducer function
export const { setLoading, setTrades } = tradeSlice.actions;

export default tradeSlice.reducer;
