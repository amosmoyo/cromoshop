import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import {getProductDetails} from './productSlice'

// const url = "http://127.0.0.1:5000/";
const url = '/'

const initialState = {
  loading: false,
  error: "",
  userList: [],
  success: false,
  message: "",
  userDetails: {},
  successUpdate: false,
  successDelete: false,
  successCreate: false,
  successDelivered: false,
  productDetails: {reviews:[]},
  orders: []
};

export const getallUsers = createAsyncThunk(
  "get all users",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(`${url}api/v1/auth/users`, config);

      let data;

      if (res.status === 200 || res.status === 201) {
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

export const deleteUser = createAsyncThunk(
  "delete users",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.delete(
        `${url}api/v1/auth/users/delete/${id}`,
        config
      );

      let data;

      if (res.status === 200 || res.status === 201) {
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

export const getUsersById = createAsyncThunk(
  "get  user by Id",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(`${url}api/v1/auth/users/${id}`, config);

      let data;

      if (res.status === 200 || res.status === 201) {
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

export const updateUsersById = createAsyncThunk(
  "update user by id",
  async ({ id, isAdmin, name, email }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      let updateData = {
        isAdmin,
        name,
        email,
      };

      const res = await axios.put(
        `${url}api/v1/auth/users/${id}`,
        updateData,
        config
      );

      let data;

      if (res.status === 200 || res.status === 201) {
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

export const deleteProduct = createAsyncThunk(
  "admin delete product",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.delete(
        `${url}api/v1/products/delete/${id}`,
        config
      );

      let data;

      if (res.status === 200 || res.status === 201 || res.status === 204) {
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

export const createProduct = createAsyncThunk(
  "admin create product",
  async (product, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        `${url}api/v1/products/create`,
        product,
        config
      );

      let data;

      if (res.status === 200 || res.status === 201 || res.status === 204) {
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

export const updateProductById = createAsyncThunk(
  "update product by id",
  async ({id, dataProduct}, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };


      const res = await axios.put(
        `${url}api/v1/products/update/${id}`,
        dataProduct,
        config
      );

      let data;

      if (res.status === 200 || res.status === 201) {
        data = res.data;

        thunkAPI.dispatch(getProductDetails(id))

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

export const getallOrders = createAsyncThunk(
  "get all users",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(`${url}api/v1/order/allorders`, config);

      let data;

      if (res.status === 200 || res.status === 201) {
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

export const updateDeliveredOrder = createAsyncThunk(
  "update delivered orders",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${url}api/v1/order/update/${id}/delivered`,
        {},
        config
      );

      let data;

      if (response.status === 200 || response.status === 201) {
        data = response.data;
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

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    resetUserList(state, action) {
      state.userList = [];
    },
    resetUserDetails(state, action) {
      state.userDetails = {};
      state.successUpdate = false;
    },
    resetCreate(state, action) {
      state.successCreate = false;
    },
    resetUpdate(state, action) {
      state.successUpdate = false;
    },
    resetDelivered(state, action) {
      state.successDelivered = false;
      state.success = false;
    }
  },
  extraReducers: {
    [getallUsers.pending]: (state, action) => {
      state.loading = true;
    },
    [getallUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.userList = action.payload.users;
    },
    [getallUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [deleteUser.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload;
    },
    [deleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getUsersById.pending]: (state, action) => {
      state.loading = true;
    },
    [getUsersById.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = true;
      state.userDetails = action.payload;
    },
    [getUsersById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [updateUsersById.pending]: (state, action) => {
      state.loading = true;
      state.successUpdate = false;
    },
    [updateUsersById.fulfilled]: (state, action) => {
      state.loading = false;
      state.successUpdate = true;
    },
    [updateUsersById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successUpdate = false;
    },

    [deleteProduct.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.successDelete = true
    },
    [deleteProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [createProduct.pending]: (state, action) => {
      state.loading = true;
    },
    [createProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.successCreate = true
    },
    [createProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [updateProductById.pending]: (state, action) => {
      state.loading = true;
      state.successUpdate = false;
    },
    [updateProductById.fulfilled]: (state, action) => {
      state.loading = false;
      state.successUpdate = true;
      state.productDetails = action.payload
    },
    [updateProductById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successUpdate = false;
    },

    [getallOrders.pending]: (state, action) => {
      state.loading = true;
    },
    [getallOrders.fulfilled]: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    [getallOrders.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [updateDeliveredOrder.pending]: (state, action) => {
      state.loading = true;
    },
    [updateDeliveredOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = true;
      state.successDelivered = true;
    },
    [updateDeliveredOrder.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const adminActions = adminSlice.actions;

export default adminSlice.reducer;
