import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/Actions/userActions";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import Toast from "../components/LoadingError/Toast";

const Login = ({history}) => {
  window.scrollTo(0, 0);

  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userLogin = useSelector((state) => state.userLogin);

  const { error, loading, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push('/');
    }
  }, [userInfo, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  }

  return (
    <>
    <Toast />
      <div
        className="card shadow mx-auto"
        style={{ maxWidth: "380px", marginTop: "100px" }}
      >
        <div className="card-body">
          {error && <Message variant='alert-danger'>{error}</Message>}
          {loading && <Loading />}
          <h4 className="card-title mb-4 text-center">Đăng Ký</h4>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Nhập Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Nhập Mật Khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button type="submit" className="btn btn-primary w-100">
                Đăng Nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
