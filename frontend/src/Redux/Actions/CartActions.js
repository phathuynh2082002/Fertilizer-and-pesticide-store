import {
  CART_ADD_ITEM,
  CART_ADD_ONE_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from "../Constants/CartConstants";
import axios from "axios";

// ADD PRODUCT TO CART
export const addToCart = (id, qty, isBuy) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);
  const { product } = data;
  if (isBuy) {
    dispatch({
        type: CART_ADD_ONE_ITEM,
        payload: {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          category: product.category.name,
          subcategory: product.subcategory.map((sub) => sub.name),
          countInStock: product.countInStock,
          qty,
        },
      });
  
      localStorage.setItem(
        "cartItem",
        JSON.stringify(getState().cart.cartItem)
      );
  } else {
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category.name,
        subcategory: product.subcategory.map((sub) => sub.name),
        countInStock: product.countInStock,
        qty,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  }
};

// REMOVE PRODUCT FROM CART
export const removefromcart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING ADDRESS
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

// SAVE PAYMENT METHOD
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
