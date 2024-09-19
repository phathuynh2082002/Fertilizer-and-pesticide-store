import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancleOrder, getOrderDetails } from "../../Redux/Actions/OrderActions";
import { toast } from "react-toastify";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const CancleOrder = () => {
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order } = orderDetails;

  const cancleHandler = async() => {
    const isEligibleForCancellation =
      new Date() - new Date(order.createdAt) < 24 * 60 * 60 * 1000;

    if (isEligibleForCancellation) {
      await dispatch(cancleOrder(order._id));
      dispatch(getOrderDetails(order._id));
      toast.success("Hủy Đơn Hàng Thành Công", ToastObjects);
    } else {
      toast.error("Đơn hàng đã quá thời gian được hủy bỏ!", ToastObjects);
    }
  };

  return (
    <>
      {/* <Toast/> */}
      <button onClick={cancleHandler}>Hủy đơn hàng</button>
    </>
  );
};

export default CancleOrder;
