import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Product from "./Product";
import { useDispatch, useSelector } from "react-redux";
import { listProduct } from "../../Redux/Actions/ProductActions";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { listSubCategory } from "../../Redux/Actions/CategoryActions";

const MainProducts = () => {
  const dispatch = useDispatch();

  const productsPerPage = 8;

  const productList = useSelector((state) => state.productList);
  const {
    loading: loadingProduct,
    error: errorProduct,
    products,
  } = productList;
  const orderList = useSelector((state) => state.orderALLList);
  const { loading: loadingOrder, error: errorOrder, orders } = orderList;
  const productDelete = useSelector((state) => state.productDelete);
  const { success } = productDelete;
  const categoryList = useSelector((state) => state.categoryList);
  const { error: errorCategory, categorys } = categoryList;
  const subcategoryList = useSelector((state) => state.subcategoryList);
  const { error: errorSubcategory, subcategorys } = subcategoryList;
  const plantList = useSelector((state) => state.plantList);
  const { error: errorPlant, plants } = plantList;

  const [ProductList, setProductList] = useState([]);
  const [productTemp, setProductTemp] = useState([]);
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

  const calcuQty = () => {
    // Step 1: Calculate total quantity sold for each product
    const totalQuantitySoldMap = {};
    orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        const { product, qty } = orderItem;
        if (product in totalQuantitySoldMap) {
          totalQuantitySoldMap[product] += qty;
        } else {
          totalQuantitySoldMap[product] = qty;
        }
      });
    });

    // Step 2: Create an array with product ID and total quantity sold

    const productListTemp = products.map((product) => ({
      ...product,
      totalQuantitySold: totalQuantitySoldMap[product._id] || 0,
    }));
    setProductTemp(productListTemp);
  };

  const filterProducts = () => {
    let filteredProducts = [...productTemp];

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
    } else if (sort === "bestSellers") {
      filteredProducts = filteredProducts.sort((a, b) => {
        return a.totalQuantitySold < b.totalQuantitySold ? 1 : -1;
      });
    } else if (sort === "worseSellers") {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.totalQuantitySold > b.totalQuantitySold ? 1 : -1
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
    if (idCategory) {
      dispatch(listSubCategory(idCategory));
    }
  }, [dispatch, idCategory]);

  useEffect(() => {
    if (success) {
      dispatch(listProduct());
    }
  }, [dispatch, success]);

  useEffect(() => {
    if (keyword || category || subcategory || plant) {
      filterProducts();
    }
  }, [dispatch, keyword, category, subcategory, plant, page]);

  useEffect(() => {
    if (
      loadingOrder === false &&
      loadingProduct === false &&
      !errorOrder &&
      !errorProduct
    ) {
      calcuQty();
    }
  }, [productList, orderList]);

  useEffect(() => {
    filterProducts();
  }, [productTemp, sort]);

  return (
    <>
      {choseCategory && (
        <div
          className="chose-categorys"
          onClick={() => setChoseCategory(false)}
        >
          <div
            className="card-body card shadow mx-auto "
            style={{ maxWidth: "900px", marginTop: "100px" }}
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
      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Danh Sách Sản Phẩm</h2>
          <div>
            <Link to="/addproduct" className="btn btn-primary">
              Thêm Sản Phẩm
            </Link>
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          {loadingProduct || loadingOrder ? (
            <Loading />
          ) : errorCategory ||
            errorSubcategory ||
            errorPlant ||
            errorProduct ||
            errorOrder ? (
            <Message variant="alert-danger">
              {errorCategory ||
                errorSubcategory ||
                errorProduct ||
                errorOrder ||
                errorPlant}
            </Message>
          ) : (
            <>
              <header className="card-header bg-white ">
                <div className="row gx-3 py-3">
                  <div className="col-lg-4 col-md-6 me-auto ">
                    <form onSubmit={submitHandler} className="input-group">
                      <input
                        type="search"
                        className="form-control rounded search"
                        placeholder="Search"
                        onChange={(e) => setKeywordTemp(e.target.value)}
                      />
                    </form>
                  </div>
                  <div className="col-lg-4 col-6 col-md-3">
                    <div className="chose-category-list">
                      <div
                        className="chose-category"
                        onClick={() => setChoseCategory(true)}
                      >
                        Chọn Loại Sản Phẩm
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-6 col-md-3">
                    <select
                      className="form-select"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value={"newest"}>Được Thêm Sau</option>
                      <option value={"cheapest"}>Rẻ Nhất</option>
                      <option value={"expensive"}>Đắt Nhất</option>
                      <option value={"bestSellers"}>Bán Chạy Nhất</option>
                      <option value={"worseSellers"}>Bán Chậm Nhất</option>
                      <option value={"highestRated"}>Đánh Giá Cao Nhất</option>
                      <option value={"highestRatedNumber"}>
                        Nhiều Đánh Giá Nhất
                      </option>
                    </select>
                  </div>
                </div>
              </header>

              <div className="card-body">
                <div className="row">
                  {/* Products */}
                  {ProductList?.map((product) => (
                    <Product product={product} key={product._id} />
                  ))}
                </div>

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
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default MainProducts;
