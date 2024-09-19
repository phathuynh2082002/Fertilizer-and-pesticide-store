import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PRODUCT_CREATE_RESET } from "../../Redux/Constants/ProductConstants";
import { createProduct, listProduct } from "../../Redux/Actions/ProductActions";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { listSubCategory } from "../../Redux/Actions/CategoryActions";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 1500,
};

const instructionList = {
  targetPlants: {
    plants: [],
    object: "",
    dosage: "",
    usage: "",
  },
  isChose: true,
};

const AddProductMain = () => {
  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const plantList = useSelector((state) => state.plantList);
  const { loadingPlant, errorPlant, plants } = plantList;
  const { loading, error, product } = productCreate;
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
  const [name, setName] = useState("");
  const [category, setCategory] = useState(
    !categorys || categorys.length === 0 ? "" : categorys[0]._id
  );
  const [subcategory, setSubcategory] = useState([]);
  const [choseCategory, setChoseCategory] = useState(false);
  const [price, setPrice] = useState();
  const [countInStock, setCountInStock] = useState();
  const [unit, setUnit] = useState("");
  const [company, setCompany] = useState("");
  const [components, setComponents] = useState("");
  const [uses, setUses] = useState("");
  const [instruction, setInstruction] = useState([instructionList]);
  const [note, setNote] = useState("");
  const [image, setImage] = useState("");
  const [idCategory, setidCategory] = useState(
    !categorys || categorys.length === 0 ? "" : categorys[0]._id
  );

  useEffect(() => {
    if (idCategory) {
      dispatch(listSubCategory(idCategory));
    }
  }, [dispatch, idCategory]);

  useEffect(() => {
    if (product) {
      toast.success("Sản Phẩm Đã Được Thêm", ToastObjects);
      setName("");
      setCategory(idCategory);
      setSubcategory([]);
      setPrice(0);
      setCountInStock(0);
      setUnit("");
      setCompany("");
      setComponents("");
      setUses("");
      setInstruction([]);
      setNote("");
      setImage("");
      dispatch(listProduct());
      dispatch({ type: PRODUCT_CREATE_RESET });
    }
  }, [dispatch, product]);

  const submitHandler = (e) => {
    e.preventDefault();

    const description = {
      components,
      uses,
      instructions: instruction.map((ins) => ins.targetPlants),
      note,
    };

    dispatch(
      createProduct(
        name,
        category,
        subcategory,
        price,
        description,
        image,
        countInStock,
        unit,
        company
      )
    );
  };

  const handleSubcategorySelect = (idSubCategory) => {
    const isSelected = subcategory.includes(idSubCategory);

    if (isSelected) {
      setSubcategory(subcategory.filter((id) => id !== idSubCategory));
    } else {
      setSubcategory([...subcategory, idSubCategory]);
    }
  };

  const addInstruction = () => {
    setInstruction([...instruction, instructionList]);
  };

  const removeInstruction = (index) => {
    setInstruction((prevInstructions) =>
      prevInstructions.filter((_, i) => i !== index)
    );
  };

  const updateInstruction = (index, updatedValue) => {
    setInstruction((prevInstructions) =>
      prevInstructions.map((item, i) =>
        i === index ? { ...item, ...updatedValue } : item
      )
    );
  };

  const updateInstructionPlant = (index, plantId) => {
    const isSelected = instruction[index].targetPlants.plants
      .map((plant) => plant.id)
      .includes(plantId);

    const { name } = plants.find((p) => p._id === plantId);

    setInstruction((prevInstructions) =>
      prevInstructions.map((item, i) =>
        i === index
          ? {
              ...item,
              targetPlants: {
                ...item.targetPlants,
                plants: isSelected
                  ? item.targetPlants.plants.filter(
                      (plant) => plant.id !== plantId
                    )
                  : [...item.targetPlants.plants, { name: name, id: plantId }],
              },
            }
          : item
      )
    );
  };

  return (
    <>
      <Toast />
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
            <h4 className="card-title mb-4 text-center">
              Danh Sách Loại Sản Phẩm
            </h4>

            <form>
              <div className="category-scroll-container ps-2 mb-4">
                {categorys?.map((ctr) => (
                  <>
                    <div
                      className={`category-chose ${
                        ctr._id === idCategory ? "category-chose-focus" : ""
                      }`}
                      onClick={() => {
                        setidCategory(ctr._id);
                        setCategory(ctr._id);
                        if (ctr._id !== idCategory) {
                          setSubcategory([]);
                        }
                      }}
                    >
                      <h4 className="mb-0">{ctr.name}</h4>
                    </div>
                  </>
                ))}
              </div>

              {loadingSubcategory ? (
                <Loading />
              ) : errorSubcategory ? (
                <Message variant="alert-danger">{error}</Message>
              ) : (
                <div className="sub-category-scroll-container ps-2 mb-4">
                  {subcategorys?.map((sub) => (
                    <>
                      <div
                        key={sub._id}
                        className={`subcategory-chose ${
                          subcategory.includes(sub._id)
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
              )}

              <div className="mb-4 mt-5">
                <button
                  onClick={() => setChoseCategory(false)}
                  className="btn btn-primary w-100"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Đi Đến Danh Sách Sản Phẩm
            </Link>
            <h2 className="content-title"> Thêm Sản Phẩm </h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Thêm Sản Phẩm
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-12 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />}
                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      Tên Sản Phẩm
                    </label>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="form-control"
                      id="product_title"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-4 ps-5">
                    <div
                      className="chose-category"
                      onClick={() => setChoseCategory(true)}
                    >
                      Chọn Loại Sản Phẩm
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="mb-4 col-xl-6 pe-4">
                      <label htmlFor="product_price" className="form-label">
                        Giá
                      </label>
                      <input
                        type="number"
                        placeholder="Type here"
                        className="form-control"
                        id="product_price"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="mb-4 col-xl-6 ps-4">
                      <label htmlFor="product_price" className="form-label">
                        Số Lượng Trong Kho
                      </label>
                      <input
                        type="number"
                        placeholder="Type here"
                        className="form-control"
                        id="product_price"
                        required
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="mb-4 col-xl-6 pe-4">
                      <label htmlFor="product_price" className="form-label">
                        Đơn Vị Tính
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control"
                        id="product_price"
                        required
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                      />
                    </div>
                    <div className="mb-4 col-xl-6 ps-4">
                      <label htmlFor="product_price" className="form-label">
                        Công Ty
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="form-control"
                        id="product_price"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-4 border-2 border p-2">
                    <label className="form-label">Mô Tả</label>
                    <div className="mb-2">
                      <label className="form-label">Thành Phần</label>
                      <textarea
                        placeholder="Type here"
                        className="form-control"
                        rows="1"
                        value={components}
                        onChange={(e) => setComponents(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Công Dụng</label>
                      <textarea
                        placeholder="Type here"
                        className="form-control"
                        rows="1"
                        value={uses}
                        onChange={(e) => setUses(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Cách Sử Dụng</label>
                      <div className="mb-2 border border-2 p-2">
                        <div>
                          {instruction.map((ins, index) => (
                            <div key={index}>
                              <i
                                class="fas fa-angle-down me-4"
                                onClick={() =>
                                  updateInstruction(index, {
                                    isChose: !ins.isChose,
                                  })
                                }
                              ></i>
                              <i
                                className="h3 me-4"
                                onClick={() => removeInstruction(index)}
                              >
                                -
                              </i>
                              {ins.targetPlants.plants?.map(
                                (plant, index, array) => (
                                  <a>
                                    {plant.name}
                                    {index === array.length - 1 ? "" : ",  "}
                                  </a>
                                )
                              )}
                              <div
                                className={`instruction ${
                                  ins.isChose
                                    ? "isChose mb-2 border border-2 p-2 ps-3"
                                    : ""
                                }`}
                              >
                                <div className="mb-2">
                                  <label className="form-label">
                                    Loại Thực Vật
                                  </label>
                                  <select
                                    className="form-control"
                                    onChange={(e) =>{
                                      updateInstructionPlant(
                                        index,
                                        e.target.value
                                      ); e.target.value=""}
                                    }
                                  >
                                    {plants?.map((plant) => (
                                      <option key={plant._id} value={plant._id}>
                                        {plant.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="mb-2">
                                  <label className="form-label">
                                    Đối Tượng
                                  </label>
                                  <textarea
                                    placeholder="Type here"
                                    className="form-control"
                                    rows="1"
                                    value={ins.targetPlants.object}
                                    onChange={(e) =>
                                      updateInstruction(index, {
                                        targetPlants: {
                                          ...ins.targetPlants,
                                          object: e.target.value,
                                        },
                                      })
                                    }
                                  ></textarea>
                                </div>
                                <div className="mb-2">
                                  <label className="form-label">
                                    Liều Lượng
                                  </label>
                                  <textarea
                                    placeholder="Type here"
                                    className="form-control"
                                    rows="1"
                                    value={ins.targetPlants.dosage}
                                    onChange={(e) =>
                                      updateInstruction(index, {
                                        targetPlants: {
                                          ...ins.targetPlants,
                                          dosage: e.target.value,
                                        },
                                      })
                                    }
                                  ></textarea>
                                </div>
                                <div className="mb-2">
                                  <label className="form-label">
                                    Cách Dùng
                                  </label>
                                  <textarea
                                    placeholder="Type here"
                                    className="form-control"
                                    rows="1"
                                    value={ins.targetPlants.usage}
                                    onChange={(e) =>
                                      updateInstruction(index, {
                                        targetPlants: {
                                          ...ins.targetPlants,
                                          usage: e.target.value,
                                        },
                                      })
                                    }
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <i class="h3" onClick={addInstruction}>
                          +
                        </i>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Lưu Ý</label>
                      <textarea
                        placeholder="Type here"
                        className="form-control"
                        rows="1"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Hình Ảnh</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Inter Image URL"
                      required
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <input className="form-control mt-3" type="file" />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary">
                      Thêm Sản Phẩm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;
