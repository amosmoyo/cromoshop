import {
  PRODUCTS_LIST_REQUEST,
  PRODUCTS_LIST_SUCCESS,
  PRODUCTS_LIST_ERROR,
  PRODUCTS_DETAILS_REQUEST,
  PRODUCTS_DETAILS_SUCCESS,
  PRODUCTS_DETAILS_ERROR,
} from "../types/products/products_types";

export const product_reducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCTS_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        products: [],
      };
    case PRODUCTS_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: "PRODUCTS_LIST_SUCCESS",
        products: action.payload,
      };
    case PRODUCTS_LIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const product_details_reducer = (state = { product: {reviews:[]} }, action) => {
  switch (action.type) {
    case PRODUCTS_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        product: [],
      };
    case PRODUCTS_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: "PRODUCTS_LIST_SUCCESS",
        product: action.payload,
      };
    case PRODUCTS_DETAILS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
