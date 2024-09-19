import React from "react";
import Header from "./../components/Header";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removefromcart } from "../Redux/Actions/CartActions";
import { CART_CLEAR_ONE_ITEM } from "../Redux/Constants/CartConstants";

const CartScreen = ({ match, location, history }) => {
  // const productId = match.params.id;
  // const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const total = cartItems.reduce((a, i) => a + i.qty * i.price, 0).toFixed(0);

  // useEffect(() => {
  //   if (productId) {
  //     dispatch(addToCart(productId, qty));
  //   }
  // }, [dispatch, productId, qty]);

  const checkOutHandler = () => {
    dispatch({ type: CART_CLEAR_ONE_ITEM });
    history.push("/login?redirect=shipping");
  };

  const removeFromCartHandle = (id) => {
    dispatch(removefromcart(id));
  };

  return (
    <>
      <Header />
      {/* Cart */}
      <div className="container">
        {cartItems.length === 0 ? (
          <div className=" alert alert-info text-center mt-3">
            Giỏ hàng của bạn đang trống
            <Link
              className="btn btn-success mx-5 px-5 py-3"
              to="/"
              style={{
                fontSize: "12px",
              }}
            >
              Mua Sắm Ngay
            </Link>
          </div>
        ) : (
          <>
            {/*  */}
            <div className=" alert alert-info text-center mt-3">
              Tổng Số Sản Phẩm
              <Link className="text-success mx-2" to="/cart">
                ({cartItems.length})
              </Link>
            </div>

            {/* cartiterm */}
            {cartItems.map((item) => (
              <div className="cart-iterm row">
                <div
                  onClick={() => removeFromCartHandle(item.product)}
                  className="remove-button d-flex justify-content-center align-items-center"
                >
                  <i className="fas fa-times"></i>
                </div>
                <div className="cart-image col-md-3">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-text col-md-5 d-flex align-items-center">
                  <Link to={`/products/${item.product}`}>
                    <h4>{item.name}</h4>
                  </Link>
                </div>
                <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
                  <h6>Số lượng</h6>

                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                    min="1"
                    max={item.countInStock}
                  />
                </div>
                <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
                  <h6>Giá</h6>
                  <h4>${item.price}</h4>
                </div>
              </div>
            ))}

            {/* End of cart iterms */}
            <div className="total">
              <span className="sub">tổng giá tiền:</span>
              <span className="total-price">{total} 000 VNĐ</span>
            </div>
            <hr />
          </>
        )}
        <div className="cart-buttons d-flex align-items-center row">
          <Link to="/" className="col-md-6 ">
            <button>Tiếp tục mua sắm</button>
          </Link>
          {total > 0 && (
            <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
              <button onClick={checkOutHandler}>Lặp hóa đơn</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartScreen;
