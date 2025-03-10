import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../Redux/Actions/ProductActions";
const Product = (props) => {
  const { product } = props;

  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    if (window.confirm("Bạn có chắc là muốn xóa sản phẩm này?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <div className="col-md-6 col-sm-6 col-lg-3 mb-5">
        <div className="card card-product-grid shadow-sm">
          <Link to={`/product/${product._id}/edit`} className="img-wrap">
            <img src={product.image} alt="Product" />
          </Link>
          <div className="info-wrap">
            <Link
              to={`/product/${product._id}/edit`}
              className="title text-truncate"
            >
              {product.name}
            </Link>
            <div className="price mb-2">{product.price} 000 VNĐ</div>
            <div className="row">
              <Link
                to={`/product/${product._id}/edit`}
                className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
              >
                <i className="fas fa-pen"></i>
              </Link>
              <div
                onClick={() => deleteHandler(product._id)}
                className="btn btn-sm btn-outline-danger p-2 pb-3 col-md-6"
              >
                <i className="fas fa-trash-alt"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
