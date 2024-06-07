import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getCommonNFTDetail = async (params) => {
  const result = await axios.get(
    `${apiUrl}/items/${params.contractAddress}/${params.tokenId}`
  );

  if (result.data.success) {
    return result.data.nft;
  }

  return null;
};

export const getMarketNFTDetail = createAsyncThunk(
  "market/getMarketNFTDetails",
  async (nftDetails, thunkAPI) => {
    let items = [];
    const result = await axios.get(
      `${apiUrl}/items/${nftDetails.contractAddress}/${nftDetails.tokenId}`
    );
    items = result.data;
    items = { ...items, listingId: nftDetails.listingId };
    return items;
  }
);
