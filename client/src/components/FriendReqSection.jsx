import AllUsersList from "../components/AllUsersList";
import Requests from "../components/Requests";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const UserListSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-700 rounded"></div>
    ))}
  </div>
);

const RequestsSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-700 rounded"></div>
    ))}
  </div>
);

function FriendReqSection({ searchQuery }) {
  const userId = useSelector((state) => state.auth.userData._id);

  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users?search=${searchQuery}`);
      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["requests", userId],
    queryFn: async () => {
      const response = await axiosInstance.get("/friend-requests/received");
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
          {isLoadingUsers ? (
            <UserListSkeleton />
          ) : (
            users?.map((user) => (
              <AllUsersList
                key={user._id}
                avatar={user.avatar?.url}
                name={user.fullName}
                userId={user._id}
                isRequestSent={user.isRequestSent}
                isFriend={user.isFriend}
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
        <div className="space-y-4">
          {isLoadingRequests ? (
            <RequestsSkeleton />
          ) : (
            requests?.map((user) => (
              <Requests
                key={user._id}
                avatar={user.avatar?.url}
                name={user.fullName}
                userId={user._id}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default FriendReqSection;
