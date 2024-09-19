import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../Redux/Actions/OrderActions";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import moment from "moment";
import axios from "axios";
import { ORDER_PAY_RESET } from "../Redux/Constants/OrderConstants";
import Toast from "../components/LoadingError/Toast";
import PaymentMethod from "../components/OrderComponents/PaymentMethod";
import CancleOrder from "../components/OrderComponents/CancleOrder";

const OrderScreen = ({match}) => {
  window.scrollTo(0, 0);

  const statusSub = {
    "unpended":"Chưa Xác Nhận",
    "pended":"Đã Xác Nhận",
    "shipping":"Đang Giao Hàng",
    "delivered":"Đã Giao Hàng",
    "cancel":"Đã Hủy",
  };
  let statusCurrent;
  let enableCancel;
  let enablePay;


  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  if (!loading && !error) {
    statusCurrent = statusSub[order.statuss];
    enableCancel = order.statuss === "unpended";
    enablePay = order.statuss === "pended" ;
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(0);
    };
    
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    const addPalPayScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true)
      };
      document.body.appendChild(script);
    };
    if (!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET});
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPalPayScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, order]);

  const paymentMethod = {loadingPay, sdkReady, orderId};

  return (
    <>
    <Toast/>
      <Header />
      <div className="container">
        {
          loading ? (<Loading />)
          : error ? (<Message variant='alert-danger'>{error}</Message>)
          : (
            <>
              <div className="row  order-detail">
                <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                  <div className="row">
                    <div className="col-md-4 center">
                      <div className="alert-success order-box">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                    <div className="col-md-8 center">
                      <h5>
                        <strong>Khách Hàng</strong>
                      </h5>
                      <p>{order.user.name}</p>
                      <p>
                        <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                      </p>
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
                      <p>Vận Chuyển: {order.shippingAddress.country}</p>
                      <p>Phương Thức Thanh Toán: {order.paymentMethod}</p>
                      {
                        order.isPaid ? (
                          <div className="bg-info p-2 col-12">
                            <p className="text-white text-center text-sm-start">
                              Đã Thanh Toán {moment(order.paidAt).calendar()}
                            </p>
                          </div>
                        )
                        :
                        (
                          <div className="bg-info p-2 col-12">
                            <p className="text-white text-center text-sm-start">
                              Chưa Thanh Toán
                            </p>
                          </div>
                        )
                      }
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
                        Địa Chỉ: {order.shippingAddress.address},{' '}
                        {order.shippingAddress.wards},{' '}
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.province}
                      </p>
                      {
                        order.statuss === "delivered" ? (
                          <div className="bg-danger p-1 col-12">
                            <p className="text-white text-center text-sm-start">
                              Đã Giao Hàng {moment(order.statussAt).calendar()}
                            </p>
                          </div>
                        )
                        :
                        (
                          <div className="bg-danger p-1 col-12">
                            <p className="text-white text-center text-sm-start">
                              {statusCurrent}
                            </p>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
                  
              <div className="row order-products justify-content-between">
                <div className="col-lg-8">
                  {
                    order.orderItems.length === 0 ?
                    (
                      <Message variant="alert-info mt-5">Hóa đơn của bạn trống</Message>
                    )
                    :
                    (
                      <>
                        {
                          order.orderItems.map((item, index) => (
                            <div key={index} className="order-product row">
                              <div className="col-md-3 col-6">
                                <img src={item.image} alt={item.name}/>
                              </div>
                              <div className="col-md-5 col-6 d-flex align-items-center">
                                <Link to={`/product/${item.product}`}>
                                  <h6>{item.name}</h6>
                                </Link>
                              </div>
                              <div className="mt-3 mt-md-0 col-6 col-md-2  d-flex align-items-center flex-column justify-content-center ">
                                <h4>Số Lượng</h4>
                                <h6>{item.qty}</h6>
                              </div>
                              <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center">
                                <h4>Giá Tiền</h4>
                                <h6>{item.price * item.qty} 000 VNĐ</h6>
                              </div>
                            </div>
                          ))
                        }
                      </>
                    )
                  }
                </div>
                {/* total */}
                <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Giá Sản Phẩm</strong>
                        </td>
                        <td>{order.itemsPrice} 000 VNĐ</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Phí Giao Hàng</strong>
                        </td>
                        <td>{order.shippingPrice} 000 VNĐ</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Thuế</strong>
                        </td>
                        <td>{order.taxPrice} 000 VNĐ</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Tổng Chi Phí</strong>
                        </td>
                        <td>{order.totalPrice} 000 VNĐ</td>
                      </tr>
                    </tbody>
                  </table>
                  { !loading && enablePay && <PaymentMethod paymentMethod={paymentMethod}/>}
                  { !loading && enableCancel && <CancleOrder/>}          
                </div>
              </div>
            </>
          )
        }
      </div>
    </>
  );
};

export default OrderScreen;
