import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getAllCollectionNFTs = createAsyncThunk(
  "collections/getAllCollectionNFTs",
  async (address, thunkAPI) => {
    const result = await axios.get(
      `${apiUrl}/nft/get-collection-items/${address}`
    );
    return result.data;
  }
);

export const getNFTsForCollection = async (address, params) => {
  const result = await axios.get(`${apiUrl}/items/${address}`, {
    params,
  });
  return result.data;
};
