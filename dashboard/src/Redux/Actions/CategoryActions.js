import axios from "axios";
import {
  CATEGORY_CREATE_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_DELETE_FAIL,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_UPDATE_FAIL,
  CATEGORY_UPDATE_REQUEST,
  CATEGORY_UPDATE_SUCCESS,
  PLANT_CREATE_FAIL,
  PLANT_CREATE_REQUEST,
  PLANT_CREATE_SUCCESS,
  PLANT_DELETE_FAIL,
  PLANT_DELETE_REQUEST,
  PLANT_DELETE_SUCCESS,
  PLANT_LIST_FAIL,
  PLANT_LIST_REQUEST,
  PLANT_LIST_SUCCESS,
  PLANT_UPDATE_FAIL,
  PLANT_UPDATE_REQUEST,
  PLANT_UPDATE_SUCCESS,
  SUBCATEGORY_CREATE_FAIL,
  SUBCATEGORY_CREATE_REQUEST,
  SUBCATEGORY_CREATE_SUCCESS,
  SUBCATEGORY_DELETE_FAIL,
  SUBCATEGORY_DELETE_REQUEST,
  SUBCATEGORY_DELETE_SUCCESS,
  SUBCATEGORY_LIST_FAIL,
  SUBCATEGORY_LIST_REQUEST,
  SUBCATEGORY_LIST_SUCCESS,
  SUBCATEGORY_UPDATE_FAIL,
  SUBCATEGORY_UPDATE_REQUEST,
  SUBCATEGORY_UPDATE_SUCCESS,
} from "../Constants/CategoryConstants";
import { logout } from "./userActions";

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

// CREATE CATEGORY
export const createCategory = (name) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_CREATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(`/api/categorys`, { name }, config);
    dispatch({ type: CATEGORY_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: CATEGORY_CREATE_FAIL,
      payload: message,
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/categorys/${id}`, config);

    dispatch({ type: CATEGORY_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: CATEGORY_DELETE_FAIL,
      payload: message,
    });
  }
};

// UPDATE CATEGORY
export const updateCategory = (id, name) => async (dispatch, getState) => {
  try {
    dispatch({ type: CATEGORY_UPDATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`/api/categorys/${id}`, {name}, config);
    dispatch({ type: CATEGORY_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: CATEGORY_UPDATE_FAIL,
      payload: message,
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

// CREATE PLANT
export const createPlant = (name) => async (dispatch, getState) => {
  try {
    dispatch({ type: PLANT_CREATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(`/api/categorys/plant`, { name }, config);
    dispatch({ type: PLANT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: PLANT_CREATE_FAIL,
      payload: message,
    });
  }
};

// DELETE PLANT
export const deletePlant = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PLANT_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/categorys/plant/${id}`, config);

    dispatch({ type: PLANT_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: PLANT_DELETE_FAIL,
      payload: message,
    });
  }
};

// UPDATE PLANT
export const updatePlant = (id, name) => async (dispatch, getState) => {
  try {
    dispatch({ type: PLANT_UPDATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`/api/categorys/plant/${id}`, {name}, config);
    dispatch({ type: PLANT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: PLANT_UPDATE_FAIL,
      payload: message,
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
    
    const categorys = await axios.get(`/api/categorys/`, config);

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

// CREATE SUBCATEGORY
export const createSubCategory = (id, name) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBCATEGORY_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const data = await axios.post(`/api/categorys/${id}`, { name }, config);
    dispatch({ type: SUBCATEGORY_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: SUBCATEGORY_CREATE_FAIL,
      payload: message,
    });
  }
};

// DELETE SUBCATEGORY
export const deleteSubCategory = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBCATEGORY_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/categorys/sub/${id}`, config);

    dispatch({ type: SUBCATEGORY_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: SUBCATEGORY_DELETE_FAIL,
      payload: message,
    });
  }
};

// UPDATE SUBCATEGORY
export const updateSubCategory = (id, name) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBCATEGORY_UPDATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/categorys/sub/${id}`, {name}, config);

    dispatch({ type: SUBCATEGORY_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: SUBCATEGORY_UPDATE_FAIL,
      payload: message,
    });
  }
};