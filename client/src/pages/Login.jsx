import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { useDispatch } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { login as authLogin } from "../store/authSlice";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/users/login", data);
      return response.data?.data;
    },
    onSuccess: (data) => {
      dispatch(authLogin(data));
      toast.success("Login successful");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error logging in");
      console.log(error);
    },
  });

  const login = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen text-textColor px-5">
      <Toaster />
      <div className="mx-auto max-w-xl bg-[#101113] rounded-xl p-6 sm:p-8">
        <h2 className="text-center text-xl font-bold leading-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm ">
          Don&apos;t have any account?&nbsp;
          <Link to="/signup" className="font-medium text-sm text-primary">
            Sign Up
          </Link>
        </p>

        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <div className="pb-2">
              <Input
                label="Username : "
                placeholder="Enter your username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-[12px] font-normal pt-2">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="pb-2">
              <Input
                label="Password : "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-[12px] font-normal pt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
