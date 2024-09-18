import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { logout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

function Header({ setSearchQuery }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const { register, handleSubmit } = useForm();

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

  const handleSearch = (data) => {
    setSearchQuery(data.searchQuery);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-bgColor border-b border-textColor w-full">
      <h1 className="text-2xl font-bold text-primary">BrandName</h1>
      <div className="flex items-center space-x-4">
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="flex items-center bg-[#101113] border border-textColor rounded-md"
        >
          <input
            type="text"
            placeholder="Search users..."
            {...register("searchQuery", {
              required: true,
            })}
            className="px-4 py-2 rounded-l-md bg-[#101113] text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 border-l border-textColor text-white bg-[#101113] rounded-r-md focus:ring-2 focus:ring-primary text-sm sm:text-md"
          >
            Search
          </button>
        </form>

        <img
          src={userData.avatar?.url}
          alt={userData.fullName}
          className="w-10 h-10 rounded-full"
        />
        <button
          className="bg-primary text-black px-4 py-2 rounded-md text-sm sm:text-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
