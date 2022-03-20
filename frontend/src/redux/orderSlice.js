import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://127.0.0.1:5000/";

const initialState = {
  loading: false,
  error: "",
  order: {},
  success: false,
  orderDetails: {},
  paypalSuccess: false,
  myOrderList: [],
  loadMyOrderList: false
};

export const createOrder = createAsyncThunk(
  "/api/v1/order/add",
  async ({ myOrder }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${url}api/v1/order/add`,
        myOrder,
        config
      );

      let data;

      if (response.status === 200 || response.status === 201) {
        data = response.data;

        //   thunkAPI.dispatch(cartSliceActions.cartClearItems());

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

export const getOrderDetails = createAsyncThunk(
  "get order by ID",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${url}api/v1/order/getorder/${id}`,
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

export const updatePaidOrder = createAsyncThunk(
  "update paid order",
  async ({ id, paymentResult }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      let token = state?.authReducers?.userData?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put(
        `${url}api/v1/order/update/${id}/pay`,
        paymentResult,
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

export const getMyOrderList = createAsyncThunk(
  "get my orderlist",
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

      const response = await axios.get(
        `${url}api/v1/order/myorders`,
        config
      );

      let data;

      if (response.status === 200 || response.status === 201) {
        console.log(response)
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

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder(state, action) {
      state.paypalSuccess = false;
      // state.orderDetails = {};
    },
    myOrderReset(state, action) {
      state.myOrderList = [];
    }
  },
  extraReducers: {
    [createOrder.pending]: (state, action) => {
      state.loading = true;
      state.success = false;
    },
    [createOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      console.log(action.payload, 111);
      state.success = true;
      console.log(state.success);
    },
    [createOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    [getOrderDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [getOrderDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    },
    [getOrderDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [updatePaidOrder.pending]: (state, action) => {
      state.loading = true;
      state.paypalSuccess = false;
    },
    [updatePaidOrder.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = true;
      state.paypalSuccess = true;
    },
    [updatePaidOrder.rejected]: (state, action) => {
      state.loading = false;
      state.paypalSuccess = false;
    },

    [getMyOrderList.pending]: (state, action) => {
      state.loading = true;
      state.loadMyOrderList = true;
    },
    [getMyOrderList.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = true;
      state.myOrderList = action.payload?.orders;
      state.loadMyOrderList = false
    },
    [getMyOrderList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.loadMyOrderList = false;
    },

  },
});

export const orderAction = orderSlice.actions;

export default orderSlice.reducer;
