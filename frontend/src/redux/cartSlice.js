import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const url = "http://127.0.0.1:5000/";
const url = '/'

const initalCartState = {
  loading: false,
  error: "",
  cartItems: [],
  qty: 0,
  shippingAddress: {},
  payment: "",
};

export const addItemsToCart = createAsyncThunk(
  "api/v1/products/add",
  async ({ id, qty }, thunkAPI) => {
    try {
      let data = {};

      const state = thunkAPI.getState();

      if (id === undefined) {
        if (localStorage.getItem("cartItems") !== "undefined") {
          localStorage.setItem(
            "cartItems",
            JSON.stringify(state.cartReducers.cartItems)
          );
        }
      } else {
        let response = await axios.get(url + "api/v1/products/details/" + id);

        data = response.data;
      }

      // localStorage.setItem('cartItems', JSON.stringify(state.cartItems));

      if (localStorage.getItem("cartItems") !== "undefined") {
        localStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartReducers.cartItems)
        );
      }

      qty = Number(qty);

      return { ...data.product, qty };
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw Error(err);
    }
  },
  {}
);

export const RemoveItemsTFromCart = createAsyncThunk(
  "api/v1/products/remove",
  async (id) => {
    try {
      // const { data } = await axios.get(url + "api/v1/products/details/" + id);
      return id;
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw Error(err);
    }
  }
);

export const SaveShippingAddress = createAsyncThunk(
  "api/v1/products/shipping",
  async (formData) => {
    try {
      return formData;
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw Error(err);
    }
  }
);

export const SavePaymentMethod = createAsyncThunk(
  "api/v1/products/payment",
  async (payment) => {
    try {
      return payment;
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      throw Error(err);
    }
  }
);

// export const cartClearItems = createAsyncThunk(
//   "creare cart items",
//   async ()  => {
//     try {

//     } catch (error) {
//       const err =
//       error.response && error.response.data.message
//         ? error.response.data.message
//         : error.message;
//     throw Error(err);
//     }
//   }
// )

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: initalCartState,
  reducers: {
    cartClearItems(state, action) {
      state.cartItems = [];
    },
  },
  extraReducers: {
    [addItemsToCart.pending]: (state, action) => {
      state.loading = true;
    },
    [addItemsToCart.fulfilled]: (state, action) => {
      const item = action.payload;

      if (item._id !== undefined) {
        const inCartItems = state.cartItems.find((x) => x._id === item._id);

        if (inCartItems) {
          state.cartItems = state.cartItems.map((x) => {
            if (x._id === item._id) {
              return item;
            }
            return x;
          });
          //  localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        } else {
          state.cartItems.push(item);
          //  localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
      // localStorage.setItem('cartItems', JSON.stringify(state.cartItems));

      // localStorage.setItem('cartItems', JSON.stringify(state.cartReducers.cartItems));

      state.loading = false;
    },
    [addItemsToCart.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [RemoveItemsTFromCart.pending]: (state, action) => {
      state.loading = true;
    },
    [RemoveItemsTFromCart.fulfilled]: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.loading = false;
    },
    [RemoveItemsTFromCart.rejected]: (state, action) => {
      state.loading = false;
    },
    [SaveShippingAddress.pending]: (state, action) => {
      state.loading = true;
    },
    [SaveShippingAddress.fulfilled]: (state, action) => {
      state.loading = false;
      state.shippingAddress = action.payload;
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(state.shippingAddress)
      );
    },
    [SaveShippingAddress.rejected]: (state, action) => {
      state.loading = false;
    },
    [SavePaymentMethod.pending]: (state, action) => {
      state.loading = true;
    },
    [SavePaymentMethod.fulfilled]: (state, action) => {
      state.loading = false;
      state.payment = action.payload;
      localStorage.setItem("payment", JSON.stringify(`${state.payment}`));
    },
    [SavePaymentMethod.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const cartSliceActions = cartSlice.actions;

export default cartSlice.reducer;
