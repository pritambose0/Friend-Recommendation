import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";

function Signup() {
  const [fileName, setFileName] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        "/users/register",
        { ...data, avatar: data.avatar[0] },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error creating account");
      console.log(error);
    },
  });

  const create = (data) => {
    mutation.mutate(data);
  };

  const handleFileChange = (e) => {
    setFileName(e.target.files[0]?.name || "");
  };

  return (
    <div className="flex items-center justify-center h-screen text-textColor px-5">
      <Toaster />
      <div className="mx-auto max-w-xl bg-[#101113] rounded-xl p-5 sm:p-8">
        <h2 className="text-center text-xl font-bold leading-tight py-2 text-white">
          Sign up to create account
        </h2>

        <p className="mt-2 mb-5 text-center text-sm">
          Already have an account? &nbsp;
          <Link to="/login" className="font-medium text-sm text-primary">
            Sign In
          </Link>
        </p>

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <div className="space-y-5">
              <div>
                <Input
                  label="Full Name : "
                  placeholder="Enter your full name"
                  {...register("fullName", {
                    required: "Full Name is required",
                  })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-[12px] font-normal pt-2">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
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

              <div>
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

              <div>
                <label className="block text-sm mb-1 font-medium text-white">
                  Avatar :
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 z-50 cursor-pointer"
                    {...register("avatar", {
                      required: "Avatar is required",
                    })}
                    onChange={handleFileChange}
                  />
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer">
                    <span className="text-sm text-textColor">
                      {fileName || "No file selected"}
                    </span>
                    <span className="text-sm text-primary font-medium">
                      Browse
                    </span>
                  </div>
                </div>
                {errors.avatar && (
                  <p className="text-red-500 text-[12px] font-normal pt-2">
                    {errors.avatar.message}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Signup"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
