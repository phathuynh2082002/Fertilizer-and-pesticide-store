import axios from "axios";
import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  PLANT_LIST_FAIL,
  PLANT_LIST_REQUEST,
  PLANT_LIST_SUCCESS,
  SUBCATEGORY_LIST_FAIL,
  SUBCATEGORY_LIST_REQUEST,
  SUBCATEGORY_LIST_SUCCESS,
} from "../Constants/CategoryConstants";

// LIST CATEGORY
export const listCategory = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    dispatch({ type: CATEGORY_LIST_REQUEST });
    const { data } = await axios.get(`/api/categorys/`, config);

    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.respone && error.respone.data.message
          ? error.respone.data.message
          : error.message,
    });
  }
};

// LIST SUBCATEGORY
export const listSubCategory = (id) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      params: { id },
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    dispatch({ type: SUBCATEGORY_LIST_REQUEST });
    const { data } = await axios.get(`/api/categorys/sub`, config);
    dispatch({ type: SUBCATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SUBCATEGORY_LIST_FAIL,
      payload:
        error.respone && error.respone.data.message
          ? error.respone.data.message
          : error.message,
    });
  }
};

// LIST PLANT
export const listPlant = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    dispatch({ type: PLANT_LIST_REQUEST });

    const { data } = await axios.get(`/api/categorys/plant`, config);
    
    dispatch({ type: PLANT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PLANT_LIST_FAIL,
      payload:
        error.respone && error.respone.data.message
          ? error.respone.data.message
          : error.message,
    });
  }
};