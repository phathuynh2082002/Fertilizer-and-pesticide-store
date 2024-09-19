import React from "react";
import { Link } from "react-router-dom";

const OrderDetailProducts = (props) => {

  const {order, loading} = props;
  
  if (!loading) {
    //calculate Price
    const addDecimals = (num) => {
      return (Math.round(num*100)/100).toFixed(0);
    };
    
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  };


  return (
    <table className="table border table-lg">
      <thead>
        <tr>
          <th style={{ width: "40%" }}>Tên Sản Phẩm</th>
          <th style={{ width: "20%" }}>Giá</th>
          <th style={{ width: "20%" }}>Số Lượng</th>
          <th style={{ width: "20%" }} className="text-end">
            Tổng Giá Sản Phẩm
          </th>
        </tr>
      </thead>
      <tbody>
        {
          order.orderItems.map((item, index) => (
            <tr key={index}>
              <td>
                <Link className="itemside" to="#">
                  <div className="left">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "40px", height: "40px" }}
                      className="img-xs"
                    />
                  </div>
                  <div className="info">
                  {item.name}{" "}
                  </div>
                </Link>
              </td>
              <td>{item.price}</td>
              <td>{item.qty}</td>
              <td className="text-end"> {item.qty*item.price} 000 VNĐ</td>
            </tr>
          ))
        }
        <tr>
          <td colSpan="4">
            <article className="float-end">
              <dl className="dlist">
                <dt>Tổng Giá Sản Phẩm:</dt> <dd>{order.itemsPrice} 000 VNĐ</dd>
              </dl>
              <dl className="dlist">
                <dt>Phí Vận Chuyển:</dt> <dd>{order.shippingPrice} 000 VNĐ</dd>
              </dl>
              <dl className="dlist">
                <dt>Tổng Chi Phí</dt>
                <dd>
                  <b className="h5">{order.totalPrice} 000 VNĐ</b>
                </dd>
              </dl>
              <dl className="dlist">
                <dt className="text-muted">Trạng Thái</dt>
                <dd>
                  {
                    order.isPaid ? (
                      <span className="badge rounded-pill alert alert-success text-success">
                        Đã Thanh Toán
                      </span>
                    ) : (
                      <span className="badge rounded-pill alert alert-danger text-danger">
                        Chưa Thanh Toán
                      </span>
                    )
                  }
                </dd>
              </dl>
            </article>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OrderDetailProducts;
