import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  deleteUser,
  listUser,
} from "../../Redux/Actions/userActions";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { ToastContainer, toast } from "react-toastify";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const UserComponent = () => {
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [keywordTemp, setKeywordTemp] = useState("");
  const [page, setPage] = useState(1);
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const userList = useSelector((state) => state.userList);
  const { loading, error, users, pages } = userList;
  const userCreate = useSelector((state) => state.userCreate);
  const { error: errorCreate, success } = userCreate;
  const userDelete = useSelector((state) => state.userDelete);
  const { error: errorDelete, success: successDelete } = userDelete;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setKeyword(e.target.value);
    }
  };

  useEffect(() => {
    if (keyword) {
      dispatch(listUser(keyword, page));
    }
  }, [dispatch, keyword, page]);

  useEffect(() => {
    if (success) {
      dispatch(listUser());
      setName("");
      setEmail("");
      setPassword("");
      setIsAdmin(false);
      setCreate(false);
      toast.success("Tạo tài khoản thành công", ToastObjects);
    } else if (errorCreate) {
      toast.error(errorCreate, ToastObjects);
    }
  }, [dispatch, success, errorCreate]);

  useEffect(() => {
    if (successDelete) {
      dispatch(listUser());
      toast.success("Xóa tài khoản thành công", ToastObjects);
    } else if (errorDelete) {
      toast.error(errorDelete, ToastObjects);
    }
  }, [dispatch, successDelete, errorDelete]);

  const createUserHandler = (e) => {
    e.preventDefault();
    dispatch(createUser(name, email, password, isAdmin));
  };

  const deleteHandler = (id) => {
    if (window.confirm("Bạn có chắc là muốn xóa tài khoản này?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      <ToastContainer />
      {create && (
        <div className="create-user" onClick={() => setCreate(false)}>
          <div
            className="card-body card shadow mx-auto "
            style={{ maxWidth: "380px", marginTop: "100px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="card-title mb-4 text-center">Tạo Tài Khoản</h4>
            <form onSubmit={createUserHandler}>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Nhập Tên"
                  type="text"
                  value={name}
                  required={true}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Nhập Email"
                  type="email"
                  required={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3 ">
                <label className="mx-4" htmlFor="isAdminCheckbox">
                  Admin
                </label>
                <input
                  type="checkbox"
                  className="form-check-input toggle-checkbox"
                  id="isAdminCheckbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  type="password"
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <button type="submit" className="btn btn-primary w-100">
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="content-main">
        <div className="content-header">
          <h2 className="content-title">Tài Khoản Người Dùng</h2>
          <button className="btn btn-primary" onClick={() => setCreate(true)}>
            <i className="material-icons md-plus"></i> Tạo Tài Khoản
          </button>
        </div>

        <div className="card mb-4">
          <header className="card-header">
            <div className="row gx-3">
              <div className="col-lg-4 col-md-6 me-auto">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên người dùng..."
                  className="form-control"
                  value={keywordTemp}
                  onChange={(e) => setKeywordTemp(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </header>

          {/* Card */}
          <div className="card-body">
            {loading ? (
              <Loading />
            ) : error ? (
              <Message variant="alert-danger">{error}</Message>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
                {users.map((user) => (
                  <div className="col" key={user._id}>
                    <div className="card card-user shadow-sm">
                      <div className="card-header">
                        <img
                          className="img-md img-avatar"
                          src="images/favicon.png"
                          alt="User pic"
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title mt-5">{user.name}</h5>
                        <div className="card-text text-muted">
                          {user.isAdmin === true ? (
                            <p className="m-0">Quản Lý</p>
                          ) : (
                            <p className="m-0">Khách Hàng</p>
                          )}
                          <p>
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                          </p>
                          <div>
                            <Link
                              to="#"
                              onClick={() => deleteHandler(user._id)}
                              className="btn btn-sm btn-outline-danger p-2 pb-3 col-md-6"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* nav */}
            <nav className="float-end mt-4" aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <div className="page-link" onClick={() => setPage(page - 1)}>
                    Trước
                  </div>
                </li>
                <li className="page-item">
                  <div className="page-link">{page}</div>
                </li>
                <li className={`page-item ${page === pages ? "disabled" : ""}`}>
                  <div className="page-link" onClick={() => setPage(page + 1)}>
                    Sau
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserComponent;
