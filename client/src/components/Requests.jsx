import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function Requests({ avatar, name, userId }) {
  const receiverId = useSelector((state) => state.auth.userData._id);

  const handleFriendRequestMutation = useMutation({
    mutationFn: async ({ senderId, status }) => {
      const response = await axiosInstance.put(
        `/friend-requests/handle/${receiverId}/${senderId}`,
        { status }
      );
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Friend request accepted successfully");
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
        <span>{name}</span>
      </div>
      <div className="space-x-2">
        <button
          className="bg-primary text-black px-4 py-2 rounded-md"
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
          className="bg-gray-700 text-white px-4 py-2 rounded-md"
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
