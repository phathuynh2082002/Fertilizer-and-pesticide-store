import React, { useEffect, useState } from "react";
import OrderDetailProducts from "./OrderDetailProducts";
import OrderDetailInfo from "./OrderDetailInfo";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeStatusOrder,
  getOrderDetails,
} from "../../Redux/Actions/OrderActions";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import moment from "moment";

const OrderDetailmain = (props) => {
  const { orderId } = props;
  const dispatch = useDispatch();

  const [statuss, setStatuss] = useState("");

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  const orderChange = useSelector((state) => state.orderChange);
  const { error: errorChange, success } = orderChange;

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, success]);

  useEffect(() => {
    dispatch(changeStatusOrder(order, statuss));
  }, [dispatch, statuss]);

  return (
    <section className="content-main">
      <div className="content-header">
        <Link to="/orders" className="btn btn-dark text-white">
          Trở Về Danh Sách Hóa Đơn
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="alert-danger">{error}</Message>
      ) : (
        <div className="card">
          <header className="card-header p-3 Header-green">
            <div className="row align-items-center ">
              <div className="col-lg-6 col-md-6">
                <span>
                  <i className="far fa-calendar-alt mx-2"></i>
                  <b className="text-white">
                    {moment(order.createAt).format("llll")}
                  </b>
                </span>
                <br />
                <small className="text-white mx-3 ">
                  Mã Hóa Đơn: {order._id}
                </small>
              </div>
              <div className="col-lg-6 col-md-6 ms-auto d-flex justify-content-end align-items-center">
                <select
                  className="form-select d-inline-block"
                  style={{ maxWidth: "200px" }}
                  value={order.statuss}
                  onChange={(e) => setStatuss(e.target.value)}
                >
                  {!order.isPaid ? (
                    <>
                      <option>Chờ Xác Nhận</option>
                      <option value="pended">Đã Xác Nhận</option>
                    </>
                  ) : (
                    <>
                      {order.statuss === "delivered" ? (
                        <option>Đã Giao Hàng</option>
                      ) : order.statuss === "pended" ? (
                        <>
                          <option>Đã Xác Nhận</option>
                          <option value="shipping">Đang Giao Hàng</option>
                        </>
                      ) : (
                        <>
                          <option>Đang Giao Hàng</option>
                          <option value="delivered">Đã Giao Hàng</option>
                        </>
                      )}
                    </>
                  )}
                </select>
              </div>
            </div>
          </header>
          <div className="card-body">
            {/* Order info */}
            <OrderDetailInfo order={order} />

            <div className="row">
              <div className="col-lg-12">
                <div className="table-responsive">
                  <OrderDetailProducts order={order} loading={loading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderDetailmain;
