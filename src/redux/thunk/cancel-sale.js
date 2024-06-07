import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAllMarketItems } from "./get-all-market-items";

const apiUrl = process.env.REACT_APP_API_URL;

export const cancelListing = createAsyncThunk(
  "market/cancelListing",
  async (listing, thunkAPI) => {
    console.log(listing);
    const result = await axios.post(`${apiUrl}/marketplace/cancel-sale`, listing);
    if(result.status === 200){
        thunkAPI.dispatch(getAllMarketItems());
    }
  }
);
