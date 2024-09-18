import Recommendation from "../components/Recommendation";
import axiosInstance from "../services/axiosInstance";
import { useQuery } from "@tanstack/react-query";

function RecommendationSection() {
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/recommendations");
      console.log("RECOMMENDATION", response.data.data);
      return response.data?.data || [];
    },
  });
  return (
    <aside className="w-full md:w-1/4 p-4 border-l border-textColor">
      <h2 className="text-xl font-semibold mb-4">Friend Recommendations</h2>
      <div className="space-y-4">
        {recommendedUsers?.map((user) => (
          <Recommendation
            key={user._id}
            avatar={user.avatar?.url}
            name={user.fullName}
            userId={user._id}
            isRequestSent={user.isRequestSent}
          />
        ))}
      </div>
    </aside>
  );
}

export default RecommendationSection;
