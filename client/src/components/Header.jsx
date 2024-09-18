import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { logout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/users/logout");
      return response.data;
    },
    onSuccess: () => {
      dispatch(logout());
      navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error while logging out");
    },
  });
  const handleLogout = () => {
    mutation.mutate();
  };
  return (
    <header className="flex justify-between items-center p-4 bg-bgColor border-b border-textColor w-full">
      <Toaster />
      <h1 className="text-2xl font-bold text-primary">BrandName</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <img
          src={userData.avatar?.url}
          alt={userData.fullName}
          className="w-10 h-10 rounded-full"
        />
        <button
          className="bg-primary text-black px-4 py-2 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
