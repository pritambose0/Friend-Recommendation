import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./services/axiosInstance";
import { login, logout } from "./store/authSlice";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.auth.status);

  // Add a loading state
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => {
        // Set loading to false after the request is complete
        setLoading(false);
      });
  }, [dispatch, userStatus]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="w-full">
        <Outlet />
      </div>
    </>
  );
}

export default App;
