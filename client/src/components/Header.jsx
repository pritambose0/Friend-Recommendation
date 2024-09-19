import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { logout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
    <header className="flex flex-col sm:flex-row justify-between items-center p-4 bg-bgColor border-b border-textColor w-full space-y-4 sm:space-y-0">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <h1 className="text-2xl font-bold text-primary">BrandName</h1>

        <div className="flex items-center space-x-4">
          <img
            src={userData.avatar?.url}
            alt={userData.fullName}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border sm:ml-3"
          />
          <button
            className="bg-primary text-black px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleSearch)}
        className="flex items-center w-full sm:w-auto bg-[#101113] border border-textColor rounded-md"
      >
        <input
          type="text"
          placeholder="Search users..."
          {...register("searchQuery", {
            required: true,
          })}
          className="w-full px-4 py-2 rounded-l-md bg-[#101113] text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="px-4 py-2 border-l border-textColor text-white bg-[#101113] rounded-r-md focus:ring-2 focus:ring-primary text-sm sm:text-md"
        >
          Search
        </button>
      </form>
    </header>
  );
}

export default Header;
