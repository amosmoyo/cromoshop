import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {orderAction} from './orderSlice'
import {adminActions} from './adminSlice'

// const url = "http://127.0.0.1:5000/";
// const url = '/'

// initialize state
const authInitialState = { loading: false, error: "", userData: {}, user: {} };

export const profile = createAsyncThunk(
  "/api/v1/auth/profile",
  async (_, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().authReducers.userData;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`/api/v1/auth/profile`, config);

      let data = response.data;

      if (response.status === 200) {
        localStorage.setItem("auth", data.token);

        return data;
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      console.log("error", err);
      // return thunkAPI.rejectWithValue(err)
      throw Error(err);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "/api/v1/auth/updateProfile",
  async (updateData, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().authReducers.userData;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      };

      const response = await axios.put(`/api/v1/auth/profile`, updateData, config);

      let data = response.data;

      if (response.status === 200 || response.status === 201 ) {
        localStorage.setItem("auth", data.token);
        return data;
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      console.log("error", err);
      throw Error(err);
    }
  }
);

export const register = createAsyncThunk(
  "/api/v1/auth/register",
  async (registerData, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `/api/v1/auth/register`,
        registerData,
        config
      );

      let data = response.data;

      if (response.status === 200) {
        localStorage.setItem("auth", data.token);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {

      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      thunkAPI.dispatch(authAction.setMessage(err));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const login = createAsyncThunk(
  "/api/vi/auth/login",
  async (loginData, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `/api/v1/auth/login`,
        loginData,
        config
      );

      let data = response.data;

      if (response.status === 200) {

        localStorage.setItem("auth", data.token);

        return data;
      }
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      console.log("error", err);
      // return thunkAPI.rejectWithValue(err)
      throw Error(err);
    }
  }
);

export const logout = createAsyncThunk("/api/vi/auth/logout", async (_, thunkAPI) => {
  localStorage.removeItem("auth");
  localStorage.removeItem('cartItems');
  localStorage.removeItem('userData');
  localStorage.removeItem('shippingAddress');
  localStorage.removeItem('payment');

  thunkAPI.dispatch(authAction.resetUser())
  thunkAPI.dispatch(orderAction.myOrderReset())
  thunkAPI.dispatch(adminActions.resetUserList())
  document.location.href = '/login';
});

// define the reducer
const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setMessage(state, action) {
      return { error: action.payload };
    },
    clearMessage(state){
      return { message: "" };
    },
    resetUser(state, action) {
      state.userData = {}
    }
  },
  extraReducers: {
    // register
    [register.pending]: (state, action) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
    },
    // login
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(state.userData))
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    // profile
    [profile.pending]: (state, action) => {
      state.loading = true;
    },
    [profile.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem('userData', JSON.stringify(state.userData))
    },
    [profile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    // update profile
    [updateProfile.pending]: (state, action) => {
      state.loading = true;
    },

    [updateProfile.fulfilled]: (state, action) => {
      state.loading = false;

      state.userData = action.payload;

      state.user = action.payload;

      state.error = ""

      localStorage.setItem('userData', JSON.stringify(state.userData))
    },
    [updateProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [logout.fulfilled]: (state, action) => {
      state.userData = {};
    },
  },
});

export const authAction = authSlice.actions;

export default authSlice.reducer;
