import { useEffect, useState } from "react";
import Header from "./../components/Header";
import Rating from "../components/homeComponents/Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createProdcutReview,
  listProductDetails,
} from "../Redux/Actions/ProductActions";
import Loading from "../components/LoadingError/Loading";
import Message from "../components/LoadingError/Error";
import Toast from "../components/LoadingError/Toast";
import { PRODUCT_CREATE_REVIEW_RESET } from "../Redux/Constants/ProductConstants";
import moment from "moment";
import { toast } from "react-toastify";
import { addToCart } from "../Redux/Actions/CartActions";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const SingleProduct = ({ match }) => {
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const productId = match.params.id;
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingCreateReview,
    error: errorCreateReview,
    success: successCreateReview,
  } = productReviewCreate;

  const AddToCartHandle = (e) => {
    e.preventDefault();
    dispatch(addToCart(productId, qty, false));
    toast.success("Đã thêm sản phẩm vào giỏ hàng", ToastObjects);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProdcutReview(productId, { rating, comment }));
  };

  useEffect(() => {
    if (successCreateReview) {
      toast.success("Đánh giá đã được gửi", ToastObjects);
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(productId));
  }, [dispatch, productId, successCreateReview]);

  return (
    <>
      <Toast />
      <Header />
      <div className="container single-product">
        {loading || loading === undefined ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="single-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onMouseMove={(e) =>
                      setHoverPosition({
                        x: e.nativeEvent.offsetX,
                        y: e.nativeEvent.offsetY,
                      })
                    }
                  />
                  {isHovered && (
                    <div
                      className="zoomed-image"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundPosition: `-${hoverPosition.x}px -${hoverPosition.y}px`,
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="product-dtl">
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                  </div>

                  <div className="product-count">
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Giá</h6>
                      <span>{product.price} 000 VNĐ</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Loại Sản Phẩm Chính</h6>
                      <span>{product.category.name}</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Loại Sản Phẩm Phụ</h6>
                      <span>
                        {product.subcategory.map((sub) => (
                          <div>{sub.name}</div>
                        ))}
                      </span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Đơn Vị Tính</h6>
                      <span>{product.unit}</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Công Ty</h6>
                      <span>{product.company}</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Trạng Thái </h6>
                      {product.countInStock > 0 ? (
                        <span>Còn Hàng</span>
                      ) : (
                        <span>Hết Hàng</span>
                      )}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Đánh Giá</h6>
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} đánh giá`}
                      />
                    </div>
                    {product.countInStock > 0 ? (
                      <>
                        <div className="flex-box d-flex justify-content-between align-items-center">
                          <h6>Số Lượng</h6>
                          <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            min="1"
                            max={product.countInStock}
                          />
                        </div>
                        <button
                          className="round-black-btn"
                          onClick={AddToCartHandle}
                        >
                          Thêm Vào Giỏ Hàng
                        </button>
                        <Link to="/" className="col-md-6 ">
                          <button className="mt-3 round-black-btn">
                            Tiếp tục mua sắm
                          </button>
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="row my-5">
              <div className="product-count">
                <div className="flex-box d-flex align-items-center">
                  <h6>Thành Phần:</h6>
                  <span className="ms-4">{product.description.components}</span>
                </div>
                <div className="flex-box d-flex align-items-center">
                  <h6>Công Dụng:</h6>
                  <span className="ms-4">{product.description.uses}</span>
                </div>
                <div className="flex-box flex align-items-center">
                  <h6>Hướng Dẫn Sử Dụng:</h6>
                  <table className="table my-2">
                    <thead>
                      <tr>
                        <th>Loại Thực Vật</th>
                        <th>Đối Tượng</th>
                        <th>Liều Lượng</th>
                        <th>Cách Dùng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.description.instructions.map((ins, index) => (
                        <tr key={index}>
                          <td>
                            {ins.plants.map((plant, plantIndex) => (
                              <div key={plantIndex}>{plant.name}</div>
                            ))}
                          </td>
                          <td>{ins.object}</td>
                          <td>{ins.dosage}</td>
                          <td>{ins.usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex-box d-flex align-items-center">
                  <h6>Lưu Ý:</h6>
                  <span className="ms-4">{product.description.note}</span>
                </div>
              </div>
            </div>
            {/* RATING */}
            <div className="row my-5">
              <div className="col-md-6">
                <h6 className="mb-3">Đánh giá</h6>
                {product.reviews.length === 0 && (
                  <Message variant={"alert-info mt-3"}>
                    Không có đánh giá
                  </Message>
                )}
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                  >
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <span>{moment(review.createAt).calendar()}</span>
                    <div className="alert alert-info mt-3">
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                <h6>Viết đánh giá của khách hàng</h6>
                <div className="my-4">
                  {loadingCreateReview && <Loading />}
                  {errorCreateReview && (
                    <Message variant={"alert-danger"}>
                      {errorCreateReview}
                    </Message>
                  )}
                </div>
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="my-4">
                      <strong>Xếp Hạng Sản Phẩm</strong>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      >
                        <option value="">Đánh Giá...</option>
                        <option value="1">1 - Tệ</option>
                        <option value="2">2 - Bình Thường</option>
                        <option value="3">3 - Tốt</option>
                        <option value="4">4 - Rất Tốt</option>
                        <option value="5">5 - Xuất Xắc</option>
                      </select>
                    </div>
                    <div className="my-4">
                      <strong>Bình Luận</strong>
                      <textarea
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      ></textarea>
                    </div>
                    <div className="my-3">
                      <button
                        disabled={loadingCreateReview}
                        className="col-12 bg-black border-0 p-3 rounded text-white"
                      >
                        Gửi đánh giá
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="my-3">
                    <Message variant={"alert-warning"}>
                      Please{" "}
                      <Link to="/login">
                        " <strong>Login</strong> "
                      </Link>{" "}
                      to write a review{" "}
                    </Message>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SingleProduct;
