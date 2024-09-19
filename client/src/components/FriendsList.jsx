import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";
import { useSelector } from "react-redux";

function FriendsList({ avatar, name, userId }) {
  const receiverId = useSelector((state) => state.auth.userData._id);
  const queryClient = useQueryClient();

  const handleFriendRemoveMutation = useMutation({
    mutationFn: async ({ senderId, status }) => {
      const response = await axiosInstance.post(
        `/friend-requests/handle/${receiverId}/${senderId}`,
        { status }
      );
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Friend request accepted successfully");
      queryClient.invalidateQueries(["requests"]);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error accepting friend request"
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
        className="text-white bg-red-500 px-4 py-2 rounded-md text-sm sm:text-md"
        onClick={() =>
          handleFriendRemoveMutation.mutate({
            senderId: userId,
            status: "rejected",
          })
        }
      >
        Unfriend
      </button>
    </div>
  );
}

export default FriendsList;
