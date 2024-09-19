import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendUserMessage } from "../../Redux/Actions/ChatbotActions";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { addToCart } from "../../Redux/Actions/CartActions";
import { toast } from "react-toastify";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const chatbotSent = useSelector((state) => state.chatbotSent);
  const { loading, message } = chatbotSent;

  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      if (message.length > 1) {
        message.forEach((item) => {
          const newMessage = { content: item, isUser: false };
          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      } else {
        const newMessage = { content: message[0], isUser: false };
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    }
  }, [message]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    const newMessage = { content: inputMessage, isUser: true };

    if (inputMessage) {
      setChatMessages([...chatMessages, newMessage]);
      setInputMessage("");
      dispatch(sendUserMessage(newMessage.content));
    } else {
      console.log(" Vui long nhap tin nhan ");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const AddToCartHandle = (e, productId) => {
    e.preventDefault();
    dispatch(addToCart(productId, 1, false));
    toast.success("Đã thêm sản phẩm vào giỏ hàng", ToastObjects);
  };

  const Message = ({ content, isUser }) => {
    if (content && content !== "") {
      // Kiểm tra xem content có chứa dấu phẩy hay không
      if (content.includes(",")) {
        // Tách content thành mảng bằng dấu phẩy
        const parts = content.split(",");
        // Kiểm tra xem phần tử thứ 0 và cuối cùng của mảng có bắt đầu và kết thúc bằng "%" không
        if (
          parts.length === 6 &&
          parts[0].trim().startsWith("%") &&
          parts[5].trim().endsWith("%")
        ) {
          const image = parts[4].trim();
          const price = parts[3].trim();
          const name = parts[2].trim();
          const id = parts[1].trim();

          return (
            <div className={`message ${isUser ? "user" : "bot"}`}>
              <Link to={`/products/${id}`}>
                <div>Tên sản phẩm: {name}</div>
                <div>Giá sản phẩm: {price}</div>
                <img src={image} alt="Product" height={300} width={200} />
              </Link>
              <button
                className="button-hover-chatbot"
                onClick={(e) => AddToCartHandle(e, id)}
              >
                Giỏ
              </button>
            </div>
          );
        } else {
          return (
            <div className={`message ${isUser ? "user" : "bot"}`}>
              {content}
            </div>
          );
        }
      } else {
        return (
          <div className={`message ${isUser ? "user" : "bot"}`}>{content}</div>
        );
      }
    }
  };

  return (
    <div className={`chatbot ${isChatOpen ? "open" : ""}`}>
      {!isChatOpen && (
        <div className="chat-icon" onClick={toggleChat}>
          <span className="chat-icon-text">Chat</span>
        </div>
      )}

      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span className="chat-header-text">Hỗ trợ khách hàng</span>
            <div className="minimize-icon" onClick={toggleChat}>
              <i class="fas fa-times"></i>
            </div>
          </div>

          <div className="chat-messages">
            {chatMessages.map((message, index) => (
              <Message
                key={index}
                content={message.content}
                isUser={message.isUser}
              />
            ))}
          </div>
          
          {loading && (
            <div class="spinner">
              <div class="bounce1"></div>
              <div class="bounce2"></div>
              <div class="bounce3"></div>
            </div>
          )}

          <div className="chat-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
