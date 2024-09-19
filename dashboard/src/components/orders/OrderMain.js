import React, { useEffect, useState } from "react";
import Orders from "./Orders";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { listOrders } from "../../Redux/Actions/OrderActions";

const OrderMain = () => {
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [keywordTemp, setKeywordTemp] = useState("");
  const [limit, setLimit] = useState("");
  const [show, setShow] = useState("");

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setKeyword(e.target.value);
    }
  };

  useEffect(() => {
    if (keyword || show || limit) {
      dispatch(listOrders(keyword, show, limit));
    }
  }, [dispatch, keyword, show, limit]);

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Danh Sách Hóa Đơn</h2>
      </div>

      <div className="card mb-4 shadow-sm">
        <header className="card-header bg-white">
          <div className="row gx-3 py-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <input
                type="text"
                placeholder="Tìm kiếm tên khách hàng..."
                className="form-control p-2"
                value={keywordTemp}
                onChange={(e) => setKeywordTemp(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select
                className="form-select"
                value={show}
                onChange={(e) => setShow(e.target.value)}
              >
                <option>Trạng Thái</option>
                <option value={"paid"}>Đã Thanh Toán</option>
                <option value={"unpaid"}>Chưa Thanh Toán</option>
                <option value={"unpended"}>Chưa Xác Nhận</option>
                <option value={"pended"}>Đã Xác Nhận</option>
                <option value={"shipping"}>Đang Giao Hàng</option>
                <option value={"delivered"}>Đã Giao Hàng</option>
                <option value={"cancel"}>Đã Hủy</option>
                <option value={"all"}>Hiển Thị Tất Cả</option>
              </select>
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select
                className="form-select"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              >
                <option value={"20"}>Hiển Thị 20</option>
                <option value={"30"}>Hiển Thị 30</option>
                <option value={"40"}>Hiển Thị 40</option>
              </select>
            </div>
          </div>
        </header>
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <Loading />
            ) : error ? (
              <Message variant="alert-danger">{error}</Message>
            ) : (
              <Orders orders={orders} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderMain;
