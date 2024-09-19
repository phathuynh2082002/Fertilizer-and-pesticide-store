import React from "react";

const OrderDetailInfo = (props) => {
  const { order } = props;
  return (
    <div className="row mb-5 order-info-wrap">
      <div className="col-md-6 col-lg-4">
        <article className="icontext align-items-start">
          <span className="icon icon-sm rounded-circle alert-success">
            <i className="text-success fas fa-user"></i>
          </span>
          <div className="text">
            <h6 className="mb-1">Khách Hàng</h6>
            <p className="mb-1">
              {order.user.name} <br />
              <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
          </div>
        </article>
      </div>
      <div className="col-md-6 col-lg-4">
        <article className="icontext align-items-start">
          <span className="icon icon-sm rounded-circle alert-success">
            <i className="text-success fas fa-truck-moving"></i>
          </span>
          <div className="text">
            <h6 className="mb-1">Thông Tin Đơn Hàng</h6>
            <p className="mb-1">
              Vận Chuyển: {order.shippingAddress.city} <br /> Phương Thức Thanh
              Toán: {order.paymentMethod}
            </p>
          </div>
        </article>
      </div>
      <div className="col-md-6 col-lg-4">
        <article className="icontext align-items-start">
          <span className="icon icon-sm rounded-circle alert-success">
            <i className="text-success fas fa-map-marker-alt"></i>
          </span>
          <div className="text">
            <h6 className="mb-1">Giao Hàng Đến</h6>
            <p className="mb-1">
              Địa Chỉ: {order.shippingAddress.address}
              {" ,"} {order.shippingAddress.wards}
              {" ,"} {order.shippingAddress.city}
              {" ,"} {order.shippingAddress.province}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default OrderDetailInfo;
