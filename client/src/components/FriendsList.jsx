import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";

function FriendsList({ avatar, name, userId }) {
  const queryClient = useQueryClient();

  const handleFriendRemoveMutation = useMutation({
    mutationFn: async (friendId) => {
      const response = await axiosInstance.delete(
        `/users/remove-friend/${friendId}`
      );
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Deleted friend successfully");
      queryClient.invalidateQueries(["requests", "friends"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error handling request");
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
        onClick={() => handleFriendRemoveMutation.mutate(userId)}
      >
        Unfriend
      </button>
    </div>
  );
}

export default FriendsList;
