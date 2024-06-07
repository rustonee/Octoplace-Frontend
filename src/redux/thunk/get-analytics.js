import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getPopularNFTs = createAsyncThunk(
  "analytics/getPopularNFTs",
  async (address, thunkAPI) => {
    const result = await axios.get(`${apiUrl}/analytics/popular-nfts`);
    // console.log("/////////////////////////// getPopularNFTs", result.data);
    return result.data;
  }
);

export const getPopularCollections = createAsyncThunk(
  "analytics/getPopularCollections",
  async (address, thunkAPI) => {
    const result = await axios.get(`${apiUrl}/analytics/popular-collections`);
    return result.data;
  }
);
