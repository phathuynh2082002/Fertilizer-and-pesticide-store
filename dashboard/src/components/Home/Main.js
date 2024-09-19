import React from "react";
import TopTotal from "./TopTotal";
import SaleStatistics from "./SalesStatistics";
import ProductsStatistics from "./ProductsStatistics";
import { useSelector } from "react-redux";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const Main = () => {

  const orderList = useSelector((state) => state.orderALLList);
  const { loading, error, orders } = orderList;
  const productList = useSelector((state) => state.productList);
  const { products } = productList;
  let ordersPaid;

  if (!loading && !error) {
    ordersPaid = orders.filter((order) => order.isPaid);
    
  }

  return (
    <>
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title"> Bảng Điều Khiển </h2>
        </div>
        {loading || !ordersPaid ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <TopTotal orders={orders} products={products} />
            <div className="card mb-4 shadow-sm">
              <SaleStatistics orders={orders} />
            </div>
            <div className="card mb-4 shadow-sm">
              <ProductsStatistics orders={ordersPaid} products={products}/>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Main;
