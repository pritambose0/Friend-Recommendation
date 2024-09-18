function FriendsList({ avatar, name }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
        <span className="text-sm sm:text-md">{name}</span>
      </div>
      <button className="text-white bg-red-500 px-4 py-2 rounded-md text-sm sm:text-md">
        Unfriend
      </button>
    </div>
  );
}

export default FriendsList;
