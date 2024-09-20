import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";

const sendFriendRequest = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  if (!receiverId) {
    throw new ApiError(400, "All fields are required");
  }

  const senderId = req.user?._id;
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  if (!sender || !receiver) {
    throw new ApiError(404, "Sender or receiver not found");
  }

  const friendRequestExists = await FriendRequest.findOne({
    $or: [
      // The sender has sent a request to the receiver
      { sender: senderId, receiver: receiverId },
      // The receiver has sent a request to the sender
      { sender: receiverId, receiver: senderId },
    ],
  });

  if (friendRequestExists) {
    throw new ApiError(409, "Friend request already exists");
  }
  const newFriendRequest = await FriendRequest.create({
    sender: senderId,
    receiver: receiverId,
  });
  if (!newFriendRequest) {
    throw new ApiError(
      500,
      "Something went wrong while sending friend request"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newFriendRequest, "Friend request sent successfully")
    );
});

const handleFriendRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { senderId, receiverId } = req.params;
  if (!senderId || !status) {
    throw new ApiError(400, "All fields are required");
  }

  if (receiverId !== req.user?._id.toString()) {
    throw new ApiError(401, "Unauthorized action");
  }

  const friendRequest = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId,
  });
  if (!friendRequest) {
    throw new ApiError(404, "Friend request not found");
  }

  if (friendRequest.receiver.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "Unauthorized action");
  }

  if (status === "accepted") {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      throw new ApiError(404, "Sender or receiver not found");
    }

    sender.friends.push(receiverId);
    receiver.friends.push(senderId);
    await sender.save();
    await receiver.save();
    await FriendRequest.findByIdAndDelete(friendRequest._id);
  } else if (status === "rejected") {
    await FriendRequest.findByIdAndDelete(friendRequest._id);
  } else {
    throw new ApiError(400, "Invalid status");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, `Friend request ${status} successfully`));
});

const getFriendRequests = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const receivedRequests = await FriendRequest.aggregate([
    {
      $match: {
        receiver: userId,
        status: "pending",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "recievedRequests",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "friends",
              foreignField: "_id",
              as: "friends",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              "avatar.url": 1,
              friends: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$recievedRequests",
    },
    {
      $replaceRoot: {
        newRoot: "$recievedRequests",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        receivedRequests,
        "Friend requests fetched successfully"
      )
    );
});

const getSentRequests = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const sentRequests = await FriendRequest.aggregate([
    {
      $match: {
        sender: userId,
        status: "pending",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "sentRequests",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "friends",
              foreignField: "_id",
              as: "friends",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              fullName: 1,
              "avatar.url": 1,
              friends: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$sentRequests",
    },
    {
      $project: {
        _id: 0,
        sentRequests: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, sentRequests, "Sent requests"));
});

export {
  sendFriendRequest,
  handleFriendRequest,
  getFriendRequests,
  getSentRequests,
};
