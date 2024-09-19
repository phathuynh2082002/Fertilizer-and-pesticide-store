import React, { useEffect, useState } from "react";
import Header from "./../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../Redux/Actions/CartActions";

const PaymentScreen = ({history}) => {
  window.scrollTo(0, 0);

  const [paymentMethod, setPaymentMethod] = useState('PostPaid');

  const cart = useSelector((state) => state.cart);
  const {shippingAddress} = cart;

  const dispatch = useDispatch();
  if (!shippingAddress.address) {
    history.push('/shipping');
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center login-center">
        <form
          className="Login2 col-md-8 col-lg-4 col-11"
          onSubmit={submitHandler}
        >
          <h6>PHƯƠNG THỨC THANH TOÁN</h6>
          <h10>Mặc định là PayPal</h10>
          <div className="payment-container">
            <div className="radio-container">
              <input 
                className="form-check-input" 
                name="paymentMethod"
                type="radio" 
                value={'PayPal'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label">PayPal hoặc Thẻ Tín Dụng</label>
            </div>
            <div className="radio-container">
              <input 
                className="form-check-input" 
                name="paymentMethod"
                type="radio" 
                value={'PostPaid'} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label">Trả sau</label>
            </div>
          </div>

          <button type="submit">Tiếp Tục</button>
        </form>
      </div>
    </>
  );
};

export default PaymentScreen;
