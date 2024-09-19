import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPlant,
  deletePlant,
  listPlant,
  updatePlant,
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

const Plant = () => {
  const dispatch = useDispatch();

  const [addPlant, setAddPlant] = useState(false);
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [newPlant, setNewPlant] = useState("");
  const [plant, setPlant] = useState("");
  const [Idplant, setIdPlant] = useState("");

  const plantList = useSelector((state) => state.plantList);
  const { loading, error, plants } = plantList;
  const plantCreate = useSelector((state) => state.plantCreate);
  const { success: successCreate, error: errorCreate } = plantCreate;
  const plantDelete = useSelector((state) => state.plantDelete);
  const { success: successDelete, error: errorDelete } = plantDelete;
  const plantUpdate = useSelector((state) => state.plantUpdate);
  const { success: successUpdate, error: errorUpdate } = plantUpdate;

  useEffect(() => {
    if (successCreate && toastDisplayed) {
      dispatch(listPlant());
      setAddPlant(false);
      setNewPlant("");
      toast.success("Thêm cây trồng thành công", ToastObjects);
      setToastDisplayed(false);
    } else if (errorCreate) {
      toast.error(errorCreate, ToastObjects);
      setToastDisplayed(false);
    }
  }, [dispatch, successCreate, errorCreate]);

  useEffect(() => {
    if (successDelete && toastDisplayed) {
      dispatch(listPlant());
      toast.success("Xóa cây trồng thành công", ToastObjects);
      setToastDisplayed(false);
    } else if (errorDelete) {
      toast.error(errorDelete, ToastObjects);
      setToastDisplayed(false);
    }
  }, [dispatch, successDelete, errorDelete]);

  useEffect(() => {
    if (successUpdate && toastDisplayed) {
      dispatch(listPlant());
      setIdPlant("");
      toast.success("Sửa cây trồng thành công", ToastObjects);
      setToastDisplayed(false);
    } else if (errorUpdate) {
      toast.error(errorUpdate, ToastObjects);
      setToastDisplayed(false);
    }
  }, [dispatch, successUpdate, errorUpdate]);

  const createPlantHandler = (e) => {
    e.preventDefault();
    dispatch(createPlant(newPlant));
    setToastDisplayed(true);
  };

  const deletePlantHandler = (id) => {
    if (window.confirm("Bạn có chắc là muốn xóa cây trồng này?")) {
      dispatch(deletePlant(id));
      setToastDisplayed(true);
    }
  };

  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      dispatch(updatePlant(Idplant, plant));
      setToastDisplayed(true);
    }
  };

  return (
    <>
      <ToastContainer />
      {addPlant && (
        <div className="create-category" onClick={() => setAddPlant(false)}>
          <div
            className="card-body card shadow mx-auto "
            style={{ maxWidth: "380px", marginTop: "100px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="card-title mb-4 text-center">Thêm Cây Trồng</h4>
            <form onSubmit={createPlantHandler}>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Nhập Tên"
                  type="text"
                  value={newPlant}
                  required={true}
                  onChange={(e) => setNewPlant(e.target.value)}
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
      <div>
        <h3 className="mb-5">Danh Sách Cây Trồng</h3>
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div
              className="category add-category"
              onClick={() => setAddPlant(true)}
            >
              +...
            </div>
            <div className="category-container">
              {plants.map((ctr) => (
                <div key={ctr._id} className="category">
                  {ctr._id === Idplant ? (
                    <input
                      class="input-update"
                      value={plant}
                      autoFocus
                      onChange={(e) => setPlant(e.target.value)}
                      onKeyDown={keyDownHandler}
                    />
                  ) : (
                    <h4 className="mb-0">{ctr.name}</h4>
                  )}
                  <div className="dropdown">
                    <button data-bs-toggle="dropdown" className="btn btn-light">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                    <div className="dropdown-menu">
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setIdPlant(ctr._id);
                          setPlant(ctr.name);
                        }}
                      >
                        {" "}
                        Sửa
                      </button>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => deletePlantHandler(ctr._id)}
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
      </div>
    </>
  );
};

export default Plant;
