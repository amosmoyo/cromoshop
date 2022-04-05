import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { orderAction } from "./orderSlice";
import { adminActions } from "./adminSlice";

// const url = "http://127.0.0.1:5000/";
// const url = '/'

// initialize state
const authInitialState = {
  loading: false,
  error: "",
  userData: {},
  user: {},
  message: "",
  success: false,
  forgotPasswordMessage: "",
  resetPasswordMessage: "",
};

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
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put(
        `/api/v1/auth/profile`,
        updateData,
        config
      );

      let data = response.data;

      if (response.status === 200 || response.status === 201) {
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

      let data;

      console.log(response);

      if (response.status === 200 || response.status === 201) {
        data = response.data;
        // localStorage.setItem("auth", data.token);
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

export const activateEmail = createAsyncThunk(
  "activation email",
  async (activation_token) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "/api/v1/auth/activation",
        { activation_token },
        config
      );

      console.log(res);

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
      console.log("error", err);
      // return thunkAPI.rejectWithValue(err)
      throw Error(err);
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
        withCredentials: true,
        crossdomain: true,
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

export const getAccessToken = createAsyncThunk("get access token", async () => {
  try {
    const config = {
      // method: 'POST',
      headers: {
        // 'Access-Control-Allow-Origin': 'http://localhost:5000',
        // 'Access-Control-Allow-Credentials': true
      },
      // withCredentials: true,
      withCredentials: true,
      // crossdomain: true,
      // body: {}
    };

    const response = await axios.post(
      "/api/v1/auth/refresh_token",
      null,
      config
    );

    // const response = await fetch('"/api/v1/auth/refresh_token', config)

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
    console.log("error", err);
    // return thunkAPI.rejectWithValue(err)
    throw Error(err);
  }
});

export const forgotPassword = createAsyncThunk(
  "forget password",
  async (passEmail, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/v1/auth/forgetpassword",
        passEmail
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
      console.log("error", err);
      // return thunkAPI.rejectWithValue(err)
      throw Error(err);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "reset password",
  async ({ passData, access_token }, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true,
        crossdomain: true,
      };

      const response = await axios.post(
        "/api/v1/auth/resetpassword",
        passData,
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
      // return thunkAPI.rejectWithValue(err)
      throw Error(err);
    }
  }
);

export const googleLogin = createAsyncThunk("google login", async (tokenId) => {
  try {
    const config = {
      withCredentials: true,
      crossdomain: true,
    };

    const response = await axios.post(
      `/api/v1/auth/googleLogin`,
      { tokenId },
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
    // return thunkAPI.rejectWithValue(err)
    throw Error(err);
  }
});

export const facebookLogin = createAsyncThunk(
  'facebook login',
  async ({accessToken, userID}) => {
    try {

      const config = {
        withCredentials: true,
        crossdomain: true,
      };
  
      const response = await axios.post(
        `/api/v1/auth/facebooklogin`,
        {accessToken, userID},
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
    // return thunkAPI.rejectWithValue(err)
    throw Error(err);
    }
  }
)

export const logout = createAsyncThunk(
  "/api/vi/auth/logout",
  async (_, thunkAPI) => {
    localStorage.removeItem("auth");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("userData");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("payment");

    thunkAPI.dispatch(authAction.resetUser());
    thunkAPI.dispatch(orderAction.myOrderReset());
    thunkAPI.dispatch(adminActions.resetUserList());
    document.location.href = "/login";
  }
);

// define the reducer
const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    setMessage(state, action) {
      return { error: action.payload };
    },
    clearMessage(state) {
      return { message: "" };
    },
    resetUser(state, action) {
      state.userData = {};
    },
    resetRegister(state, action) {
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: {
    // register
    [register.pending]: (state, action) => {
      state.loading = true;
      state.success = false;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;

      state.message = action.payload.message;
      state.success = true;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.success = false;
    },

    [activateEmail.pending]: (state, action) => {
      state.loading = true;
    },
    [activateEmail.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.success = true;
    },
    [activateEmail.rejected]: (state, action) => {
      state.loading = false;
    },
    // login
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      // state.userData = action.payload;
      // localStorage.setItem("userData", JSON.stringify(state.userData));
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [googleLogin.pending]: (state, action) => {
      state.loading = true;
    },
    [googleLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      // state.userData = action.payload;
      // localStorage.setItem("userData", JSON.stringify(state.userData));
    },
    [googleLogin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [facebookLogin.pending]: (state, action) => {
      state.loading = true;
    },
    [facebookLogin.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      // state.userData = action.payload;
      // localStorage.setItem("userData", JSON.stringify(state.userData));
    },
    [facebookLogin.rejected]: (state, action) => {
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
      localStorage.setItem("userData", JSON.stringify(state.userData));
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

      state.error = "";

      localStorage.setItem("userData", JSON.stringify(state.userData));
    },
    [updateProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [logout.fulfilled]: (state, action) => {
      state.userData = {};
    },

    [getAccessToken.pending]: (state, action) => {
      state.loading = true;
    },
    [getAccessToken.fulfilled]: (state, action) => {
      state.loading = false;
      state.userData = action.payload;
      localStorage.setItem("userData", JSON.stringify(state.userData));
    },
    [getAccessToken.rejected]: (state, action) => {
      state.loading = false;
    },

    [forgotPassword.pending]: (state, action) => {
      state.loading = true;
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.forgotPasswordMessage = action.payload.message;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [resetPassword.pending]: (state, action) => {
      state.loading = true;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.resetPasswordMessage = action.payload.message;
    },
    [resetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

export const authAction = authSlice.actions;

export default authSlice.reducer;
