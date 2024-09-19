import axios from "axios";

import {
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_REQUEST,
} from "../Constants/ChatbotConstants";

export const sendUserMessage = (message) => async (dispatch, getState) => {
  try {
    dispatch({ type: SEND_MESSAGE_REQUEST });

    const { data } = await axios.post(`http://localhost:5005/webhooks/rest/webhook`, {"sender":"test", "message":message});
    
    // Lấy nội dung của tất cả các tin nhắn từ mảng data
    const messages = data.map((item) => item.text);

    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: messages });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: message,
    });
  }
};
