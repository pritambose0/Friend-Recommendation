import FriendsList from "../components/FriendsList";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";

const FriendsListSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-700 rounded"></div>
    ))}
  </div>
);

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
      return response.data?.data || [];
    },
  });

  return (
    <aside className="w-full md:w-1/4 p-4  sm:border-r border-textColor">
      <h2 className="text-xl font-semibold mb-4">Friends List</h2>
      <div className="space-y-4">
        {isLoading ? (
          <FriendsListSkeleton />
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : friends.length > 0 ? (
          friends?.map((friend) => (
            <FriendsList
              key={friend._id}
              avatar={friend.avatar?.url}
              name={friend.fullName}
              userId={friend._id}
            />
          ))
        ) : (
          <p className="text-white">No friends found</p>
        )}
      </div>
    </aside>
  );
}

export default Users;
