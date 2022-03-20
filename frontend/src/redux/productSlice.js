import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import req from "express/lib/request";

const url = "http://127.0.0.1:5000/";

const initialProductState = {
  products: [],
  loading: false,
  error: "",
  product: { reviews: [] },
  message: "",
  reviewLoading: false,
  reviewError: "",
  page: "",
  pages: "",
  topRatedProducts: [],
};
export const getProducts = createAsyncThunk(
  "api/v1/products",
  async ({ keyword, pageNumber }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${url}api/v1/products?keyword=${keyword ? keyword : ""}&pageNumber=${
          pageNumber ? pageNumber : pageNumber
        }`
      );
      let data;

      if (res.status === 200 || res.status === 201) {
        data = res.data;

        console.log(data, "data");

        return data;
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw Error(err);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  "api/v1/getProductDetails",
  async (id) => {
    const { data } = await axios.get(url + "api/v1/products/details/" + id);
    return { ...data };
  }
);

export const createProductReview = createAsyncThunk(
  "reateProductReview",
  async ({ id, rating, comment }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const review = {
        rating,
        comment,
      };

      const res = await axios.post(
        `${url}api/v1/products/create/${id}/reviews`,
        review,
        config
      );

      console.log(res, 111);

      let data;

      if (res.status === 201 || res.status === 200) {
        data = res.data;

        return data;
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      console.log("Error", err);
      throw Error(err);
    }
  }
);

export const getTopRatedProducts = createAsyncThunk(
  "api/v1/products/top",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${url}api/v1/products/top`);
      let data;

      if (res.status === 200) {
        data = res.data;
        return data;
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw Error(err);
    }
  }
);

const initialProductSlice = createSlice({
  name: "productsReducers",
  initialState: initialProductState,
  reducers: {
    resetCreateProductReview(state, action) {
      state.message = "";
      state.reviewError = "";
      state.reviewLoading = "";
      state.message = "";
    },
  },
  extraReducers: {
    [getProducts.pending]: (state, action) => {
      state.products = [];
      state.loading = true;
    },
    [getProducts.fulfilled]: (state, action) => {
      state.products = action.payload.products;

      state.page = action.payload.page;

      state.pages = action.payload.pages;

      state.loading = false;
    },
    [getProducts.rejected]: (state, action) => {
      state.products = [];
      state.loading = false;
      state.error = action.error.message;
    },
    [getProductDetails.pending]: (state, action) => {
      // state.product = {reviews:[]}
      state.loading = true;
    },
    [getProductDetails.fulfilled]: (state, action) => {
      state.product = action.payload.product;
      state.loading = false;
    },
    [getProductDetails.rejected]: (state, action) => {
      // state.product = {reviews:[]};
      state.loading = false;
      state.error = action.error.message;
    },

    [createProductReview.pending]: (state, action) => {
      // state.product = {reviews:[]}
      // state.loading = true;
      state.reviewLoading = true;
    },
    [createProductReview.fulfilled]: (state, action) => {
      // state.loading = false;
      state.message = action.payload.message;
      state.reviewLoading = false;
    },
    [createProductReview.rejected]: (state, action) => {
      // state.product = {reviews:[]};
      // state.loading = false;
      state.reviewLoading = false;
      state.reviewError = action.error.message;
    },

    [getTopRatedProducts.pending]: (state, action) => {
      // state.product = {reviews:[]}
      // state.loading = true;
      state.loading = true;
    },
    [getTopRatedProducts.fulfilled]: (state, action) => {
      // state.loading = false;
      state.topRatedProducts = action.payload;
      state.loading = false;
    },
    [getTopRatedProducts.rejected]: (state, action) => {
      // state.product = {reviews:[]};
      // state.loading = false;
      state.loading = false;
      state.reviewError = action.error.message;
    },
  },
});

export const productAction = initialProductSlice.actions;

export default initialProductSlice.reducer;
