import Recommendation from "../components/Recommendation";
import axiosInstance from "../services/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const RecommendationSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-700 rounded"></div>
    ))}
  </div>
);

function RecommendationSection() {
  const { data: recommendedUsers, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/recommendations");
      return response.data?.data || [];
    },
  });

  return (
    <aside className="w-full md:w-1/4 p-4 border-l border-textColor">
      <h2 className="text-xl font-semibold mb-4">Friend Recommendations</h2>
      <div className="space-y-4">
        {isLoading ? (
          <RecommendationSkeleton />
        ) : (
          recommendedUsers?.map((user) => (
            <Recommendation
              key={user._id}
              avatar={user.avatar?.url}
              name={user.fullName}
              userId={user._id}
              isRequestSent={user.isRequestSent}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export default RecommendationSection;
