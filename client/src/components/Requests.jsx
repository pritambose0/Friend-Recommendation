import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function Requests({ avatar, name, userId }) {
  const receiverId = useSelector((state) => state.auth.userData._id);
  const queryClient = useQueryClient();
  const handleFriendRequestMutation = useMutation({
    mutationFn: async ({ senderId, status }) => {
      const response = await axiosInstance.post(
        `/friend-requests/handle/${receiverId}/${senderId}`,
        { status }
      );
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Successfull");
      queryClient.invalidateQueries(["requests"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error deleting friend");
      console.log(error);
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
        <span className="text-sm sm:text-md">{name}</span>
      </div>
      <div className="space-x-2">
        <button
          className="bg-primary text-black px-4 py-2 rounded-md text-sm sm:text-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={handleFriendRequestMutation.isLoading}
          onClick={() =>
            handleFriendRequestMutation.mutate({
              senderId: userId,
              status: "accepted",
            })
          }
        >
          Accept
        </button>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={handleFriendRequestMutation.isLoading}
          onClick={() =>
            handleFriendRequestMutation.mutate({
              senderId: userId,
              status: "rejected",
            })
          }
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default Requests;
