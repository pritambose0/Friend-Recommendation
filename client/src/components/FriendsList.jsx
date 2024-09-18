function FriendsList({ avatar, name }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
        <span>{name}</span>
      </div>
      <button className="text-red-500">Unfriend</button>
    </div>
  );
}

export default FriendsList;
