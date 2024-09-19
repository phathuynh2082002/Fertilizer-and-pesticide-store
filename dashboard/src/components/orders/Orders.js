import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Orders = (props) => {

  const {orders} = props;

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Tên Khách Hàng</th>
          <th scope="col">Email</th>
          <th scope="col">Tổng Giá</th>
          <th scope="col">Thanh Toán</th>
          <th scope="col">Ngày Lập</th>
          <th>Trạng Thái</th>
          <th scope="col" className="text-end">
            Xem
          </th>
        </tr>
      </thead>
      <tbody>
        {
          orders.map((order) => (
            <tr key={order._id}>
              <td>
                <b>{order.user.name}</b>
              </td>
              <td>{order.user.email}</td>
              <td>{order.totalPrice}</td>
              <td>
                {
                  order.isPaid ? (
                    <span className="badge rounded-pill alert-success">
                      Đã Thanh Toán {moment(order.paidAt).format('MMM Do YY')}
                    </span>
                  ) : (
                    <span className="badge rounded-pill alert-danger">
                      Chưa Thanh Toán
                    </span>
                  )
                }
              </td>
              <td>{moment(order.createdAt).format('MMM Do YY')}</td>
              <td>
                {
                  order.statuss === "delivered" ? (
                    <span className="badge btn-success">Đã Giao Hàng</span>
                  ) : (
                    <span className="badge btn-dark">Chưa Giao Hàng</span>
                  )
                }
              </td>
              <td className="d-flex justify-content-end align-item-center">
                <Link to={`/order/${order._id}`} className="text-success">
                  <i className="fas fa-eye"></i>
                </Link>
              </td>
            </tr>
          ))
        }
        {/* Not paid Not delivered */}
        {/* <tr>
          <td>
            <b>Velcro Sneakers For Boys & Girls (Blue)</b>
          </td>
          <td>user@example.com</td>
          <td>$45,789</td>
          <td>
            <span className="badge rounded-pill alert-danger">Not paid</span>
          </td>
          <td>Dec 12 2021</td>
          <td>
            <span className="badge btn-dark">Not Delivered</span>
          </td>
          <td className="d-flex justify-content-end align-item-center">
            <Link to={`/order`} className="text-success">
              <i className="fas fa-eye"></i>
            </Link>
          </td>
        </tr> */}
      </tbody>
    </table>
  );
};

export default Orders;
