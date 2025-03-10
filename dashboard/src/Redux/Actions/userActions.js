import {
  USER_CREATE_FAIL,
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
} from "../Constants/UserConstants";
import axios from "axios";
import { toast } from "react-toastify";

// LOGIN
export const login = (email, password) => async (dispatch) => {
  const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
  };

  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `/api/users/login`,
      { email, password },
      config
    );

    if (!data.isAdmin === true) {
      toast.error("Tài khoản của bạn không có quyền quản lý", ToastObjects);
      dispatch({
        type: USER_LOGIN_FAIL,
      });
    } else {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    }

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: message,
    });
  }
};

// LOGOUT
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_LIST_RESET });
};

// ALL USER
export const listUser =
  (keyword = "", page = "1") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: USER_LIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        params: { keyword, page },
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/users/all`, config);

      dispatch({ type: USER_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: USER_LIST_FAIL,
        payload: message,
      });
    }
  };

// CREATE USER
export const createUser =
  (name, email, password, isAdmin) => async (dispatch) => {
    try {
      dispatch({ type: USER_CREATE_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/users`,
        { name, email, password, isAdmin },
        config
      );

      dispatch({ type: USER_CREATE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: USER_CREATE_FAIL,
        payload: message,
      });
    }
  };

  // DELETE USER
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
      dispatch({ type: USER_DELETE_REQUEST});
      
      const {
          userLogin: { userInfo },
      } = getState();

      const config = {
          headers : {
              Authorization: `Bearer ${userInfo.token}`
          },
      };

      await axios.delete(`/api/users/${id}`, config);

      dispatch({ type: USER_DELETE_SUCCESS});
  } catch (error) {
      const message =
          error.response && error.response.data.message
                  ? error.response.data.message
                  : error.message;
      if((message === 'Not authorized, token failed')) {
          dispatch(logout());
      }
      dispatch({
          type: USER_DELETE_FAIL,
          payload: message,
      });
  }
};