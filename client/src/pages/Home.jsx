import Header from "../components/Header";
import FriendsList from "../components/FriendsList";
import Recommendation from "../components/Recommendation";
import axiosInstance from "../services/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import AllUsersList from "../components/AllUsersList";
import Requests from "../components/Requests";

const HomePage = () => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      //   console.log("RESPONSE", response.data.data);

      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: requests } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const response = await axiosInstance.get("/friend-requests/received");
      console.log("RESPONSE", response.data.data);
      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

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

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/recommendations");
      console.log("RESPONSE", response.data.data);
      return response.data?.data || [];
    },
  });
  return (
    <div className="min-h-screen w-full bg-bgColor text-textColor">
      <Header />

      <div className="flex flex-col md:flex-row">
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

        <main className="flex-grow p-4">
          <section>
            <h2 className="text-xl font-semibold mb-4">Search Users</h2>
            <div className="space-y-4">
              {users?.map((user) => (
                <AllUsersList
                  key={user._id}
                  avatar={user.avatar?.url}
                  name={user.fullName}
                />
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
            <div className="space-y-4">
              {/* Example of Friend Request */}
              {requests?.map((user) => (
                <Requests
                  key={user._id}
                  avatar={user.avatar?.url}
                  name={user.fullName}
                  userId={user._id}
                />
              ))}
            </div>
          </section>
        </main>

        <aside className="w-full md:w-1/4 p-4 border-l border-textColor">
          <h2 className="text-xl font-semibold mb-4">Friend Recommendations</h2>
          <div className="space-y-4">
            {recommendedUsers?.map((user) => (
              <Recommendation
                key={user._id}
                avatar={user.avatar?.url}
                name={user.fullName}
                userId={user._id}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
