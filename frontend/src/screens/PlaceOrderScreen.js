import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/LoadingError/Error";
import { ORDER_CREATE_RESET } from "../Redux/Constants/OrderConstants";
import { createOrder } from "../Redux/Actions/OrderActions";
import {
  CART_CLEAR_ITEMS,
  CART_CLEAR_ONE_ITEM,
} from "../Redux/Constants/CartConstants";

const PlaceOrderScreen = ({ history }) => {
  window.scrollTo(0, 0);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  let addDecimals;

  // Calculate Price
  if (Object.keys(cart.cartItem).length !== 0) {
    addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(0);
    };

    cart.itemsPrice = addDecimals(cart.cartItem.price);
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(0)));
    cart.totalPrice = (
      Number(cart.itemsPrice) +
      Number(cart.shippingPrice) +
      Number(cart.taxPrice)
    ).toFixed(0);
  } else {
    addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(0);
    };

    cart.itemsPrice = addDecimals(
      cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(0)));
    cart.totalPrice = (
      Number(cart.itemsPrice) +
      Number(cart.shippingPrice) +
      Number(cart.taxPrice)
    ).toFixed(0);
  }

  const placeOrderHandler = (e) => {
    e.preventDefault();
    dispatch(
      createOrder({
        orderItems: Object.keys(cart.cartItem).length
          ? cart.cartItem
          : cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      if (Object.keys(cart.cartItem).length !== 0) {
        dispatch({ type: CART_CLEAR_ONE_ITEM });
      } else {
        dispatch({ type: CART_CLEAR_ITEMS });
      }
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [history, dispatch, success, order]);

  return (
    <>
      <Header />
      <div className="container">
        <div className="row  order-detail">
          <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
            <div className="row ">
              <div className="col-md-4 center">
                <div className="alert-success order-box">
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <div className="col-md-8 center">
                <h5>
                  <strong>Khách Hàng</strong>
                </h5>
                <p>{userInfo.name}</p>
                <p>{userInfo.email}</p>
              </div>
            </div>
          </div>
          {/* 2 */}
          <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
            <div className="row">
              <div className="col-md-4 center">
                <div className="alert-success order-box">
                  <i className="fas fa-truck-moving"></i>
                </div>
              </div>
              <div className="col-md-8 center">
                <h5>
                  <strong>Thông Tin Đặt Hàng</strong>
                </h5>
                <p>Vận chuyển: {cart.shippingAddress.province}</p>
                <p>Phương thức thanh toán: {cart.paymentMethod}</p>
              </div>
            </div>
          </div>
          {/* 3 */}
          <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
            <div className="row">
              <div className="col-md-4 center">
                <div className="alert-success order-box">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
              </div>
              <div className="col-md-8 center">
                <h5>
                  <strong>Giao Hàng Đến</strong>
                </h5>
                <p>
                  Địa chỉ:
                  {cart.shippingAddress.address}, {cart.shippingAddress.wards},{" "}
                  {cart.shippingAddress.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row order-products justify-content-between">
          <div className="col-lg-8">
            {Object.keys(cart.cartItem).length !== 0 ? (
              <>
                <div className="order-product row">
                  <div className="col-md-3 col-6">
                    <img src={cart.cartItem.image} alt={cart.cartItem.name} />
                  </div>
                  <div className="col-md-5 col-6 d-flex align-items-center">
                    <Link to={`/products/${cart.cartItem.product}`}>
                      <h6>{cart.cartItem.name}</h6>
                    </Link>
                  </div>
                  <div className="mt-3 mt-md-0 col-md-2 col-6  d-flex align-items-center flex-column justify-content-center ">
                    <h4>Số Lượng</h4>
                    <h6>{cart.cartItem.qty}</h6>
                  </div>
                  <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center ">
                    <h4>Giá Tiền </h4>
                    <h6>{cart.cartItem.qty * cart.cartItem.price} 000 VNĐ</h6>
                  </div>
                </div>
              </>
            ) : (
              <>
                {cart.cartItems.length === 0 ? (
                  <Message variant="alert-info mt-5">
                    Your cart is empty
                  </Message>
                ) : (
                  <>
                    {cart.cartItems.map((item, index) => (
                      <div className="order-product row" key={index}>
                        <div className="col-md-3 col-6">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="col-md-5 col-6 d-flex align-items-center">
                          <Link to={`/products/${item.product}`}>
                            <h6>{item.name}</h6>
                          </Link>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6  d-flex align-items-center flex-column justify-content-center ">
                          <h4>Số Lượng</h4>
                          <h6>{item.qty}</h6>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center ">
                          <h4>Giá Tiền </h4>
                          <h6>{item.qty * item.price} 000 VNĐ</h6>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* total */}
          <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    <strong>Giá sản phẩm</strong>
                  </td>
                  <td>{cart.itemsPrice} 000 VNĐ</td>
                </tr>
                <tr>
                  <td>
                    <strong>Phí vận chuyển</strong>
                  </td>
                  <td>{cart.shippingPrice} 000 VNĐ</td>
                </tr>
                <tr>
                  <td>
                    <strong>Thuế</strong>
                  </td>
                  <td>{cart.taxPrice} 000 VNĐ</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tổng chi phí</strong>
                  </td>
                  <td>{cart.totalPrice} 000 VNĐ</td>
                </tr>
              </tbody>
            </table>
            {Object.keys(cart.cartItem).length !== 0 ? (
              <button type="submit" onClick={placeOrderHandler}>
                Đặt Hàng
              </button>
            ) : (
              <>
                {cart.cartItems.length === 0 ? null : (
                  <button type="submit" onClick={placeOrderHandler}>
                    Đặt Hàng
                  </button>
                )}
              </>
            )}

            {error && (
              <div className="my-3 col-12">
                <Message variant="alert-danger">{error}</Message>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
