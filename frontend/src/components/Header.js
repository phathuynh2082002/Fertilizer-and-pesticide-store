import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Actions/userActions";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { listMyOrders } from "../Redux/Actions/OrderActions";

const statusSub = {
  "pended":"Hóa Đơn Đã Xác Nhận",
  "shipping":"Hóa Đơn Đang Giao Hàng",
  "delivered":"Hóa Đơn Đã Giao Hàng",
};

const Header = () => {
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState();
  const [isBell, setIsBell] = useState(false);

  let history = useHistory();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading, error, orders } = orderListMy;

  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyOrders(true));
    }
  }, [dispatch, history, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="Announcement ">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex align-items-center display-none">
              <p>+8435 800 3858</p>
              <p>n.phat2082002@gmail.com</p>
            </div>
            <div className=" col-12 col-lg-6 justify-content-center justify-content-lg-end d-flex align-items-center">
              <Link to="">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link to="">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link to="">
                <i className="fab fa-linkedin-in"></i>
              </Link>
              <Link to="">
                <i className="fab fa-youtube"></i>
              </Link>
              <Link to="">
                <i className="fab fa-pinterest-p"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="header">
        <div className="container">
          {/* MOBILE HEADER */}
          <div className="mobile-header">
            <div className="container ">
              <div className="row ">
                <div className="col-6 d-flex align-items-center">
                  <Link className="navbar-brand" to="/">
                    <img alt="logo" src="/images/logo.png" />
                  </Link>
                </div>
                <div className="col-6 d-flex align-items-center justify-content-end Login-Register">
                  {userInfo ? (
                    <div className="btn-group">
                      <button
                        type="button"
                        className="name-button dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="fas fa-user"></i>
                      </button>
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/profile">
                          Trang cá nhân
                        </Link>

                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={logoutHandler}
                        >
                          Đăng xuất
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="btn-group">
                      <button
                        type="button"
                        className="name-button dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="fas fa-user"></i>
                      </button>
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/login">
                          Đăng Nhập
                        </Link>

                        <Link className="dropdown-item" to="/register">
                          Đăng Ký
                        </Link>
                      </div>
                    </div>
                  )}
                  <Link to="/cart" className="cart-mobile-icon">
                    <i className="fas fa-shopping-bag"></i>
                    <span className="badge">{cartItems.length}</span>
                  </Link>
                  <div
                  className="position-relative"
                  onClick={() => setIsBell(!isBell)}
                >
                  <i className="fas fa-bell"></i>
                  {orders ? (
                    <span className="badge">{orders.length}</span>
                  ) : (
                    <></>
                  )}
                  {isBell && orders && (
                    <div className="notification-window">
                      {orders.length === 0 ? (
                        <div>Không có thông báo mới!</div>
                      ) : (
                        <>
                          {orders.map((order) => (
                            <div
                              key={order._id}
                              className="notification-item"
                              onClick={() =>
                                history.push(`/order/${order._id}`)
                              }
                            >
                              {statusSub[order.statuss]}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
                </div>
                <div className="col-12 d-flex align-items-center">
                  <form onSubmit={submitHandler} className="input-group">
                    <input
                      type="search"
                      className="form-control rounded search"
                      placeholder="Search"
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                      Tìm Kím
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* PC HEADER */}
          <div className="pc-header">
            <div className="row">
              <div className="col-md-3 col-4 d-flex align-items-center">
                <Link className="navbar-brand" to="/">
                  <img alt="logo" src="/images/logo.png" />
                </Link>
              </div>
              <div className="col-md-6 col-8 d-flex align-items-center">
                <form onSubmit={submitHandler} className="input-group">
                  <input
                    type="search"
                    className="form-control rounded search"
                    placeholder="Search"
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button type="submit" className="search-button">
                    search
                  </button>
                </form>
              </div>
              <div className="col-md-3 d-flex align-items-center justify-content-end Login-Register">
                {userInfo ? (
                  <div className="btn-group">
                    <button
                      type="button"
                      className="name-button dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Hi, {userInfo.name}
                    </button>
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/profile">
                        Trang cá nhân
                      </Link>

                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={logoutHandler}
                      >
                        Đăng xuất
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link to="/register">Đăng ký</Link>
                    <Link to="/login">Đăng nhập</Link>
                  </>
                )}

                <Link to="/cart">
                  <i className="fas fa-shopping-bag"></i>
                  <span className="badge">{cartItems.length}</span>
                </Link>
                <div
                  className="position-relative"
                  onClick={() => setIsBell(!isBell)}
                >
                  <i className="fas fa-bell"></i>
                  {orders ? (
                    <span className="badge">{orders.length}</span>
                  ) : (
                    <></>
                  )}
                  {isBell && orders && (
                    <div className="notification-window">
                      {orders.length === 0 ? (
                        <div>Không có thông báo mới!</div>
                      ) : (
                        <>
                          {orders.map((order) => (
                            <div
                              key={order._id}
                              className="notification-item"
                              onClick={() =>
                                history.push(`/order/${order._id}`)
                              }
                            >
                              {statusSub[order.statuss]}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
