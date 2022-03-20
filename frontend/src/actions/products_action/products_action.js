import axios from "axios";
import {
  PRODUCTS_LIST_REQUEST,
  PRODUCTS_LIST_SUCCESS,
  PRODUCTS_LIST_ERROR,
  PRODUCTS_DETAILS_REQUEST,
  PRODUCTS_DETAILS_SUCCESS,
  PRODUCTS_DETAILS_ERROR,
} from "../../types/products/products_types";

export const getProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCTS_LIST_REQUEST,
    });

    const { data } = await axios.get(`api/v1/products`);
    const response  = await axios.get(`api/v1/products/61b8c9cf423e926a00a6347e`);
    console.log(response)

    dispatch({
      type: PRODUCTS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCTS_LIST_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getProduct =
  ({ id }) =>
  async (dispatch) => {
    try {
      alert()
      const amos = `api/v1/products/`

      dispatch({
        type: PRODUCTS_DETAILS_REQUEST,
      });

      alert(amos)

      const { data } = await axios.get(amos);

      dispatch({
        type: PRODUCTS_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCTS_DETAILS_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
