import React, { useEffect, useState } from "react";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import Carousel from "./Carousel";
import { listSubCategory } from "../../Redux/Actions/CategoryActions";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { addToCart } from "../../Redux/Actions/CartActions";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";
import { CART_CLEAR_ONE_ITEM } from "../../Redux/Constants/CartConstants";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const ShopSection = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const productsPerPage = 8;

  const [ProductList, setProductList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [keywordTemp, setKeywordTemp] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [categoryTemp, setCategoryTemp] = useState("");
  const [subcategoryTemp, setSubcategoryTemp] = useState("");
  const [plant, setPlant] = useState([]);
  const [plantTemp, setPlantTemp] = useState([]);
  const [choseCategory, setChoseCategory] = useState(false);
  const [chosePlant, setChosePlant] = useState(false);
  const [idCategory, setidCategory] = useState("");
  const [sort, setSort] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const productList = useSelector((state) => state.productList);
  const {
    loading: loadingProduct,
    error: errorProduct,
    products,
  } = productList;
  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: loadingCategory,
    error: errorCategory,
    categorys,
  } = categoryList;
  const subcategoryList = useSelector((state) => state.subcategoryList);
  const {
    loading: loadingSubcategory,
    error: errorSubcategory,
    subcategorys,
  } = subcategoryList;
  const plantList = useSelector((state) => state.plantList);
  const { loading: loadingPlant, error: errorPlant, plants } = plantList;

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setKeyword(keywordTemp);
  };

  const choseCategoryHandler = (e) => {
    e.preventDefault();
    setCategory(categoryTemp);
    setSubcategory(subcategoryTemp);
    setPlant(plantTemp);
    setChoseCategory(false);
  };

  const handleSubcategorySelect = (idPlantOrCategory) => {
    const isSelected = chosePlant
      ? plantTemp.includes(idPlantOrCategory)
      : subcategoryTemp.includes(idPlantOrCategory);

    if (isSelected) {
      chosePlant
        ? setPlantTemp(plantTemp.filter((id) => id !== idPlantOrCategory))
        : setSubcategoryTemp(
            subcategoryTemp.filter((id) => id !== idPlantOrCategory)
          );
    } else {
      chosePlant
        ? setPlantTemp([...plantTemp, idPlantOrCategory])
        : setSubcategoryTemp([...subcategoryTemp, idPlantOrCategory]);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setidCategory(categoryId);
    setCategoryTemp(categoryId);
    if (categoryId !== idCategory) {
      setSubcategoryTemp([]);
    }
    if (categoryId === idCategory) {
      setCategoryTemp("");
      setidCategory("");
    }
  };

  const AddToBuyHandle = (e, productId) => {
    e.preventDefault();
    dispatch({ type: CART_CLEAR_ONE_ITEM });
    dispatch(addToCart(productId, 1, true));
    history.push("/login?redirect=shipping");
  };

  const AddToCartHandle = (e, productId) => {
    e.preventDefault();
    dispatch(addToCart(productId, 1, false));
    toast.success("Đã thêm sản phẩm vào giỏ hàng", ToastObjects);
  };

  const filterProducts = () => {
    let filteredProducts = [...products];

    // Filter by keyword
    if (keyword) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.id === category
      );
    }

    // Filter by subcategory
    if (subcategory.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const subcategoryIds = product.subcategory.map(
          (subcategory) => subcategory.id
        );
        return subcategory.every((id) => subcategoryIds.includes(id));
      });
    }

    if (plant.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const plants = [
          ...new Set(
            product.description.instructions.flatMap((ins) =>
              ins.plants.map((plant) => plant.id)
            )
          ),
        ];

        return plant.every((id) => plants.includes(id));
      });
    }

    // Sort
    if (sort === "newest") {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
      );
    } else if (sort === "cheapest") {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.price > b.price ? 1 : -1
      );
    } else if (sort === "expensive") {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.price < b.price ? 1 : -1
      );
    } else if (sort === "highestRated") {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.rating < b.rating ? 1 : -1
      );
    } else if (sort === "highestRatedNumber") {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.numReviews < b.numReviews ? 1 : -1
      );
    }

    setPages(Math.ceil(filteredProducts.length / productsPerPage));

    const indexOfLastProduct = page * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    filteredProducts = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );

    setProductList(filteredProducts);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (idCategory) {
      dispatch(listSubCategory(idCategory));
    }
  }, [dispatch, idCategory]);

  useEffect(() => {
    if (keyword || category || subcategory || plant) {
      filterProducts();
    }
  }, [dispatch, keyword, category, subcategory, plant, page]);

  useEffect(() => {
    if (loadingProduct === false && !errorProduct) {
      filterProducts();
    }
  }, [productList, sort]);

  // useEffect(() => {
  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, []);

  return (
    <>
      <Toast />
      {choseCategory && (
        <div
          className="chose-categorys"
          onClick={() => setChoseCategory(false)}
        >
          <div
            className="card-body card shadow mx-auto chose-category-size"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="list-category">
              <div
                className={`list-category-child ${
                  !chosePlant ? "list-category-child-focus" : ""
                }`}
                onClick={() => setChosePlant(false)}
              >
                <h4 className="card-title mb-4 text-center">
                  Danh Sách Loại Sản Phẩm
                </h4>
              </div>
              <div
                className={`list-category-child ${
                  chosePlant ? "list-category-child-focus" : ""
                }`}
                onClick={() => setChosePlant(true)}
              >
                <h4 className="card-title mb-4 text-center ">
                  Danh Sách Loại Cây Trồng
                </h4>
              </div>
            </div>
            <form>
              {!chosePlant ? (
                <div className="category-scroll-container ps-2 mb-4">
                  {categorys?.map((ctr) => (
                    <>
                      <div
                        className={`category-chose ${
                          ctr._id === idCategory ? "category-chose-focus" : ""
                        }`}
                        onClick={() => handleCategorySelect(ctr._id)}
                      >
                        <h4 className="mb-0">{ctr.name}</h4>
                      </div>
                    </>
                  ))}
                </div>
              ) : (
                <></>
              )}

              <div className="sub-category-scroll-container ps-2 mb-4">
                {(chosePlant ? plants : subcategorys)?.map((sub) => (
                  <>
                    <div
                      key={sub._id}
                      className={`subcategory-chose ${
                        (chosePlant ? plantTemp : subcategoryTemp).includes(
                          sub._id
                        )
                          ? "subcategory-chose-focus"
                          : ""
                      }`}
                      onClick={() => {
                        handleSubcategorySelect(sub._id);
                      }}
                    >
                      <h4 className="mb-0">{sub.name}</h4>
                    </div>
                  </>
                ))}
              </div>

              <div className="mb-4 mt-5">
                <button
                  onClick={choseCategoryHandler}
                  className="btn btn-primary w-100"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="container">
        <marquee class="mb-3">
          DF cam kết đem đến cho khách hàng những sản phẩm trái cây đạt tiêu
          chuẩn VietGap và GlobalGap 100%, mang đến cho gia đình khách hàng
          nguồn dinh dưỡng tự nhiên an toàn. VietGAP là viết tắt của Vietnamese
          Good Agricultural Practices, có nghĩa là Thực hành sản xuất nông
          nghiệp tốt ở Việt Nam. Tiêu chuẩn này do Bộ Nông nghiệp và Phát triển
          nông thôn ban hành đối với từng sản phẩm, nhóm sản phẩm thủy sản,
          trồng trọt và chăn nuôi. GlobalGAP ( Viết tắt của từ Global Good
          Agricultural Practice) – Thực hành nông nghiệp tốt toàn cầu, là một bộ
          tiêu chuẩn (tập hợp các biện pháp kỹ thuật) về thực hành nông nghiệp
          tốt được xây dựng để áp dụng tự nguyện cho sản xuất, thu hoạch và xử
          lý sau thu hoạch.{" "}
        </marquee>
        <Carousel />
        {loadingProduct || loadingCategory || loadingPlant ? (
          <Loading />
        ) : errorCategory || errorSubcategory || errorPlant || errorProduct ? (
          <Message variant="alert-danger">
            {errorCategory || errorSubcategory || errorProduct || errorPlant}
          </Message>
        ) : (
          <div>
            <header className="card-header bg-white ">
              <div className="filter-product">
                <div className="">
                  <form onSubmit={submitHandler} className="input-group">
                    <input
                      type="search"
                      className="form-control rounded search"
                      placeholder="Search"
                      onChange={(e) => setKeywordTemp(e.target.value)}
                    />
                  </form>
                </div>
                <div className="">
                  <div className="chose-category-list">
                    <div
                      className="chose-category"
                      onClick={() => setChoseCategory(true)}
                    >
                      Chọn Loại Sản Phẩm
                    </div>
                  </div>
                </div>
                <div className="">
                  <select
                    className="form-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value={"newest"}>Được Thêm Sau</option>
                    <option value={"cheapest"}>Rẻ Nhất</option>
                    <option value={"expensive"}>Đắt Nhất</option>
                    <option value={"highestRated"}>Đánh Giá Cao Nhất</option>
                    <option value={"highestRatedNumber"}>
                      Nhiều Đánh Giá Nhất
                    </option>
                  </select>
                </div>
              </div>
            </header>

            <div className="section">
              <div className="row">
                <div className="col-lg-12 col-md-12 article">
                  <div className="shopcontainer row">
                    {ProductList?.map((product) => (
                      <div
                        className="shop col-lg-3 col-md-6 col-sm-6"
                        key={product._id}
                      >
                        <div className="border-product">
                          <Link to={`/products/${product._id}`}>
                            <div className="shopBack">
                              <img src={product.image} alt={product.name} />
                            </div>
                          </Link>

                          <div className="shoptext">
                            <p>
                              <Link to={`/products/${product._id}`}>
                                {product.name}
                              </Link>
                            </p>
                            {mousePosition.x !== 0 && (
                              <div
                                className="product-hover-name"
                                style={{
                                  left: `${mousePosition.x}px`,
                                  top: `${mousePosition.y}px`,
                                }}
                              >
                                {product.name}
                              </div>
                            )}

                            <Rating
                              value={product.rating}
                              text={`${product.numReviews} reviews`}
                            />
                            <h3>${product.price}</h3>
                          </div>
                          <div className="hover-info">
                            <div className="button-container">
                              <button
                                className="button-hover"
                                onClick={(e) => AddToBuyHandle(e, product._id)}
                              >
                                Mua
                              </button>
                              <button
                                className="button-hover"
                                onClick={(e) => AddToCartHandle(e, product._id)}
                              >
                                Giỏ
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pages > 1 && (
                      <nav>
                        <ul className="pagination justify-content-center">
                          {[...Array(pages).keys()].map((x) => (
                            <li
                              className={`page-item ${
                                x + 1 === page ? "active" : ""
                              }`}
                              key={x + 1}
                            >
                              <div
                                className="page-link"
                                onClick={() => setPage(x + 1)}
                              >
                                {x + 1}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShopSection;
