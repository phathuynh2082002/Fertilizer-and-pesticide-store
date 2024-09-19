import React, { useState } from "react";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import { Link } from "react-router-dom/cjs/react-router-dom";
import moment from "moment";

const Orders = (props) => {
  const { orders, loading, error } = props;
  const [filter, setFilter] = useState("all");

  const filteredOrders = () => {
    switch (filter) {
      case "unpended":
        return orders.filter((order) => order.statuss === "unpended");
      case "pended":
        return orders.filter((order) => order.statuss === "pended");
      case "shipping":
        return orders.filter((order) => order.statuss === "shipping");
      case "delivered":
        return orders.filter((order) => order.statuss === "delivered");
      case "paid":
        return orders.filter((order) => order.isPaid === true);
      case "unpaid":
        return orders.filter((order) => order.isPaid === false);
      default:
        return orders;
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <div className="d-flex align-items-center mb-3">
        <span className="me-2">Lọc theo trạng thái:</span>
        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="unpended">Chưa xác nhận</option>
          <option value="pended">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="paid">Đã thanh toán</option>
          <option value="unpaid">Chưa thanh toán</option>
        </select>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="alert-danger">{error}</Message>
      ) : (
        <>
          {filteredOrders().length === 0 ? (
            <div className="col-12 alert alert-info text-center mt-3">
              Không có hóa đơn
              <Link
                className="btn btn-success mx-2 px-3 py-2"
                to="/"
                style={{
                  fontSize: "12px",
                }}
              >
                Bắt Đầu Mua Sắm
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã Hóa Đơn</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Lập</th>
                    <th>Tổng Chi Phí</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders().map((order) => (
                    <tr
                      className={`${
                        order.isPaid ? "alert-success" : "alert-danger"
                      }`}
                      key={order._id}
                    >
                      <td>
                        <Link to={`/order/${order._id}`} className="link">
                          {order._id}
                        </Link>
                      </td>
                      <td>{order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                      <td>
                        {order.isPaid
                          ? moment(order.paidAt).calendar()
                          : moment(order.createdAt).calendar()}
                      </td>
                      <td>{order.totalPrice} 000 VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
