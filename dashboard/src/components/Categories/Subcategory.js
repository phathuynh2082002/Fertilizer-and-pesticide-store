import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubCategory,
  deleteSubCategory,
  listSubCategory,
  updateSubCategory,
} from "../../Redux/Actions/CategoryActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import { ToastContainer, toast } from "react-toastify";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const Subcategory = () => {
  const dispatch = useDispatch();

  const [addCategory, setAddCategory] = useState(false);
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [category, setCategory] = useState("");
  const [Idcategory, setIdCategory] = useState("");

  const categoryList = useSelector((state) => state.subcategoryList);
  const { loading, error, subcategorys, idcategory } = categoryList;
  const categoryCreate = useSelector((state) => state.subcategoryCreate);
  const { success: successCreate, error: errorCreate } = categoryCreate;
  const categoryDelete = useSelector((state) => state.subcategoryDelete);
  const { success: successDelete, error: errorDelete } = categoryDelete;
  const categoryUpdate = useSelector((state) => state.subcategoryUpdate);
  const { success: successUpdate, error: errorUpdate } = categoryUpdate;

  useEffect(() => {
    if (successCreate && toastDisplayed) {
      dispatch(listSubCategory(idcategory));
      setAddCategory(false);
      setNewCategory("");
      toast.success("Thêm loại sản phẩm phụ thành công", ToastObjects);
      setToastDisplayed(false);
    } else if (errorCreate) {
      toast.error(errorCreate, ToastObjects);
      setToastDisplayed(false);
    }
  }, [dispatch, successCreate, errorCreate]);

  useEffect(() => {
    if (successDelete && toastDisplayed) {
      dispatch(listSubCategory(idcategory));
      toast.success("Xóa loại sản phẩm phụ thành công", ToastObjects);
      setToastDisplayed(false);
    } else if (errorDelete) {
      toast.error(errorDelete, ToastObjects);
      setToastDisplayed(false);
    }
  }, [dispatch, successDelete, errorDelete]);

  useEffect(() => {
    if (successUpdate && toastDisplayed) {
      dispatch(listSubCategory(idcategory));
      setIdCategory("");
      toast.success("Sửa loại sản phẩm phụ thành công", ToastObjects);
      setToastDisplayed(false);
    } else if (errorUpdate) {
      toast.error(errorUpdate, ToastObjects);
      setToastDisplayed(false);
    }
  }, [dispatch, successUpdate, errorUpdate]);

  const createCategoryHandler = (e) => {
    e.preventDefault();
    dispatch(createSubCategory(idcategory, newCategory));
    setToastDisplayed(true);
  };

  const deleteCategoryHandler = (id) => {
    if (window.confirm("Bạn có chắc là muốn xóa loại sản phẩm phụ này?")) {
      dispatch(deleteSubCategory(id));
      setToastDisplayed(true);
    }
  };

  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      dispatch(updateSubCategory(Idcategory, category));
      setToastDisplayed(true);
    }
  };

  return (
    <>
      <ToastContainer />
      {addCategory && (
        <div
          className="create-subcategory"
          onClick={() => setAddCategory(false)}
        >
          <div
            className="card-body card shadow mx-auto "
            style={{ maxWidth: "380px", marginTop: "100px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="card-title mb-4 text-center">
              Thêm Loại Sản Phẩm Phụ
            </h4>
            <form onSubmit={createCategoryHandler}>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Nhập Tên"
                  type="text"
                  value={newCategory}
                  required={true}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <button type="submit" className="btn btn-primary w-100">
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="">
        <h3 className="mb-5">Loại Sản Phẩm Phụ</h3>
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            {subcategorys && (
              <>
                <div
                  className="subcategory add-subcategory"
                  onClick={() => setAddCategory(true)}
                >
                  +...
                </div>
                <div className="category-container">
                  {subcategorys.map((ctr) => (
                    <div className="subcategory" key={ctr._id}>
                      {ctr._id === Idcategory ? (
                        <input
                          class="input-update"
                          value={category}
                          autoFocus
                          onChange={(e) => setCategory(e.target.value)}
                          onKeyDown={keyDownHandler}
                        />
                      ) : (
                        <h4 className="mb-0">{ctr.name}</h4>
                      )}
                      <div className="dropdown">
                        <button
                          data-bs-toggle="dropdown"
                          className="btn btn-light"
                        >
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                        <div className="dropdown-menu">
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setIdCategory(ctr._id);
                              setCategory(ctr.name);
                            }}
                          >
                            {" "}
                            Sửa
                          </button>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => deleteCategoryHandler(ctr._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Subcategory;
