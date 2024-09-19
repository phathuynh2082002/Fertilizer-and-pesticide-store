import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../LoadingError/Toast";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../Redux/Actions/userActions";

const ProfileTabs = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [wards, setWards] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConFirmPassword] = useState('');
  
  const toastId = React.useRef(null);
  
  const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
  }

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const {loading, error, user} = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {loading: updateLoading} = userUpdateProfile;
  useEffect(() => {
    if(user) {
      setName(user.name);
      setEmail(user.email);
      setAddress(user.address);
      setWards(user.wards);
      setCity(user.city);
      setProvince(user.province);
    }
  }, [dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error('Mật khẩu nhập lại không khớp', ToastObjects);
      }
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, address, wards, city, province, password }));
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success('Thông tin cá nhân đã được cập nhật', ToastObjects);
      }
    }
  }
  return (
    <>
      <Toast />
      {error && <Message variant='alert-danger'>{error}</Message>}
      {loading && <Loading />}
      {updateLoading && <Loading />}
      <form className="row  form-container" onSubmit={submitHandler}>
        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">Tên Người Dùng</label>
            <input 
              className="form-control" 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-email">Địa Chỉ E-mail</label>
            <input 
              className="form-control" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">Địa chỉ nhà/ cơ quan</label>
            <input 
              className="form-control" 
              type="text" 
              required 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">Tên Xã/Phường</label>
            <input 
              className="form-control" 
              type="text" 
              required 
              value={wards}
              onChange={(e) => setWards(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">Tên Thành Phố</label>
            <input 
              className="form-control" 
              type="text" 
              required 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">Tên Tỉnh Thành</label>
            <input 
              className="form-control" 
              type="text" 
              required 
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-pass">Mật Khẩu Mới</label>
            <input 
              className="form-control" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-confirm-pass">Nhập Lại Mật Khẩu Mới</label>
            <input 
              className="form-control" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConFirmPassword(e.target.value)}  
            />
          </div>
        </div>
        <button type="submit">Cập Nhật Thông Tin Cá Nhân</button>
      </form>
    </>
  );
};

export default ProfileTabs;
