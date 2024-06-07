import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getCollectionDiscussions = createAsyncThunk(
  "discussion/getCollectionDiscussions",
  async (collection, thunkAPI) => {
    const params = {
      address: collection.address,
      network: collection.network,
      owner: collection.owner,
      limits: collection.limits,
    };

    const result = await axios.get(`${apiUrl}/discussions/collection`, {
      params,
    });
    return result.data;
  }
);

export const createCollectionDiscussion = createAsyncThunk(
  "discussion/createCollectionDiscussion",
  async (collection, thunkAPI) => {
    const result = await axios.post(`${apiUrl}/discussions/collection`, {
      address: collection.address,
      network: collection.network,
      sender: collection.sender,
      message: collection.message,
    });

    thunkAPI.dispatch(
      getCollectionDiscussions({
        address: collection.address,
        network: collection.network,
        owner: collection.sender,
      })
    );
    return result.data;
  }
);

export const getNftDiscussions = createAsyncThunk(
  "discussion/getNftDiscussions",
  async (nft, thunkAPI) => {
    const params = {
      contract: nft.address,
      network: nft.network,
      tokenId: nft.tokenId,
    };

    const result = await axios.get(`${apiUrl}/discussions/nft`, { params });
    return result.data;
  }
);

export const createNFTDiscussion = createAsyncThunk(
  "discussion/createNFTDiscussion",
  async (nft, thunkAPI) => {
    const result = await axios.post(`${apiUrl}/discussions/nft`, {
      contract: nft.address,
      network: nft.network,
      tokenId: nft.tokenId,
      sender: nft.sender,
      message: nft.message,
    });

    thunkAPI.dispatch(
      getNftDiscussions({
        address: nft.address,
        tokenId: nft.tokenId,
        network: nft.network,
      })
    );
    return result.data;
  }
);
