import AllUsersList from "../components/AllUsersList";
import Requests from "../components/Requests";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { useEffect } from "react";

function FriendReqSection({ searchQuery }) {
  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users?search=${searchQuery}`);
      //   console.log("RESPONSE", response.data.data);

      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: requests } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const response = await axiosInstance.get("/friend-requests/received");
      // console.log("RESPONSE", response.data.data);
      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (searchQuery) {
      refetchUsers();
    }
  }, [searchQuery, refetchUsers]);
  return (
    <main className="flex-grow p-4">
      <section>
        <h2 className="text-xl font-semibold mb-4">Search Users</h2>
        <div className="space-y-4">
          {users?.map((user) => (
            <AllUsersList
              key={user._id}
              avatar={user.avatar?.url}
              name={user.fullName}
              userId={user._id}
              isRequestSent={user.isRequestSent}
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
  );
}

export default FriendReqSection;
