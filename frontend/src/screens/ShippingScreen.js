import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../Redux/Actions/CartActions";
import { getUserDetails } from "../Redux/Actions/userActions";
import { ToastContainer, toast } from 'react-toastify';

const ShippingScreen = ({ history }) => {
  window.scrollTo(0, 0);

  const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
  };

  const toastId = React.useRef(null);

  const [address, setAddress] = useState("");
  const [wards, setWards] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      address.trim() !== "" &&
      wards.trim() !== "" &&
      city.trim() !== "" &&
      province.trim() !== ""
      ) {
      dispatch(saveShippingAddress({ address, wards, city, province }));
      history.push("/payment");
    } else {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error('Địa Chỉ Giao Hàng Còn Trống', ToastObjects);
      }
    }
  };
  
  useEffect(() => {
    dispatch(getUserDetails("profile"));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setAddress(user.address);
      setWards(user.wards);
      setCity(user.city);
      setProvince(user.province);
    }
  }, [dispatch, user]);

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="container d-flex justify-content-center align-items-center login-center">
        <form
          className="Login col-md-8 col-lg-4 col-11"
          onSubmit={submitHandler}
        >
          <h6>ĐỊA CHỈ GIAO HÀNG</h6>
          <input
            type="text"
            placeholder="Địa Chỉ Nhà/ Cơ Quan"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên Xã/Phường"
            required
            value={wards}
            onChange={(e) => setWards(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên Thành Phố"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên Tỉnh Thành"
            required
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
          <button type="submit">Tiếp Tục</button>
        </form>
      </div>
    </>
  );
};

export default ShippingScreen;
