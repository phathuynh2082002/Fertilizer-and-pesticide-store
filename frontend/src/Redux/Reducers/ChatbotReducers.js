import {
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_RESET,
  SEND_MESSAGE_SUCCESS,
} from "../Constants/ChatbotConstants";

export const chatbotReducer = (state = {}, action) => {
  switch (action.type) {
    case SEND_MESSAGE_REQUEST:
      return { loading: true };
    case SEND_MESSAGE_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case SEND_MESSAGE_FAIL:
      return { loading: false, error: action.payload };
    case SEND_MESSAGE_RESET:
      return {};
    default:
      return state;
  }
};
