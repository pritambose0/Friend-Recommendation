import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";

function Recommendation({ avatar, name, userId, isRequestSent }) {
  const queryClient = useQueryClient();

  const handleAddFriendMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosInstance.post(
        `/friend-requests/send/${userId}`
      );
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Friend request sent successfully");
      queryClient.invalidateQueries(["requests"]);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error sending friend request"
      );
      console.log(error);
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
        <span className="text-sm sm:text-md">{name}</span>
      </div>
      <button
        className="bg-primary text-black px-4 py-2 rounded-md text-sm sm:text-md disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleAddFriendMutation.mutate(userId)}
        disabled={isRequestSent || handleAddFriendMutation.isLoading}
      >
        {handleAddFriendMutation.isSuccess || isRequestSent
          ? "Request Sent"
          : "Add Friend"}
      </button>
    </div>
  );
}

export default Recommendation;
