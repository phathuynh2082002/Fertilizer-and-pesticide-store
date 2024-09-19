import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { payOrder } from "../../Redux/Actions/OrderActions";
import { PayPalButton } from "react-paypal-button-v2";
import { toast } from "react-toastify";
import Loading from "../LoadingError/Loading";
import Toast from "../LoadingError/Toast";

const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};

const PaymentMethod = (props, params) => {
  const dispatch = useDispatch();

  const { paymentMethod } = props;
  const { loadingPay, sdkReady, orderId} = paymentMethod;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order } = orderDetails;

  const successPaymentHandler = (paymentResult = {}) => {
    if (order.paymentMethod === 'PostPaid') {
        paymentResult = {
            id: params.id,
            status: 'COMPLETED',
            update_time: Date.now(),
            email_address: order.user.email,
        };
      }
    dispatch(payOrder(orderId, paymentResult));
    toast.success('Thanh toán thành công', ToastObjects);
  };

  return (
    <>
    {/* <Toast/> */}
        {
            order.paymentMethod === 'PayPal' ? (
                !order.isPaid && (
                    <div className="col-12">
                        {loadingPay && <Loading />}
                        {!sdkReady ? (
                            <Loading />
                        ) : (
                            <PayPalButton
                            amount={order.totalPrice}
                            onSuccess={successPaymentHandler}
                            />
                        )}
                    </div>
                )
            ) : (
                !order.isPaid && (<button onClick={successPaymentHandler}>Xác Nhận Thanh Toán</button>)
            )
        }
    </>
  );
};

export default PaymentMethod;
