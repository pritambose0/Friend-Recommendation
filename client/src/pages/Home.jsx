import Header from "../components/Header";
import Users from "../components/Users";
import FriendReqSection from "../components/FriendReqSection";
import RecommendationSection from "../components/RecommendationSection";
import { useState } from "react";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen w-full bg-bgColor text-textColor">
      <Header setSearchQuery={setSearchQuery} />

      <div className="flex flex-col md:flex-row">
        {/* Users Section */}
        <Users />
        {/* Friend Requests Section */}
        <FriendReqSection searchQuery={searchQuery} />
        {/* Friend Recommendations Section */}
        <RecommendationSection />
      </div>
    </div>
  );
};

export default HomePage;
