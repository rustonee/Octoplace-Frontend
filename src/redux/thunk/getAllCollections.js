import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getAllCollections = createAsyncThunk(
  "collections/getAllCollections",
  async (params, thunkAPI) => {
    let items = [];
    const result = await axios.get(`${apiUrl}/collections/categories`);
    items = result.data.categories.map((item) => {
      let slug = slugify(item.name);
      return { ...item, slug };
    });
    // items =items.filter(item => item.site !== "thetadrop");
    return items;
  }
);

export const getCollections = async (params) => {
  let items = [];
  const result = await axios.get(`${apiUrl}/collections`, {
    params,
  });

  items = result.data.collections.map((item) => {
    let slug = slugify(item.name);
    return { ...item, slug };
  });

  return {
    collections: items,
    totalPages: result.data.totalPages,
    currentPage: result.data.currentPage,
    totalCounts: result.data.totalCounts,
  };
};

export const getCollection = async (address) => {
  const result = await axios.get(`${apiUrl}/collections/${address}`);
  return result.data;
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
