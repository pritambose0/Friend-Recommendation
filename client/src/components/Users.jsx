import FriendsList from "../components/FriendsList";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
function Users() {
  const {
    data: friends,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/friends");
      //   console.log("RESPONSE", response.data.data);

      return response.data?.data || [];
    },
  });
  return (
    <aside className="w-full md:w-1/4 p-4 border-r border-textColor">
      <h2 className="text-xl font-semibold mb-4">Friends List</h2>
      <div className="space-y-4">
        {friends?.map((friend) => (
          <FriendsList
            key={friend._id}
            avatar={friend.avatar?.url}
            name={friend.fullName}
          />
        ))}
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error: {error.message}</p>}
        {!friends && !isLoading && !isError && (
          <p className="text-white">No friends found</p>
        )}
      </div>
    </aside>
  );
}

export default Users;
