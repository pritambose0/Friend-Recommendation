import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./services/axiosInstance";
import { login, logout } from "./store/authSlice";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    axiosInstance
      .get("/users/current-user")
      .then((userData) => {
        if (userData) {
          dispatch(login(userData?.data?.data));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, userStatus]);
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

export default App;
