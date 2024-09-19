import { mongoose } from "mongoose";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { FriendRequest } from "../models/friendRequest.model.js";

const generateAccessToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    return accessToken;
  } catch (error) {
    throw new ApiError(500, "Error while generating new Access Token");
  }
};

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Tokens");
  }
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, password, interests } = req.body;

  if ([fullName, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ username });
  if (existedUser) {
    throw new ApiError(409, "User with username already exists");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(
      500,
      "Something went wrong while uploading avatar to cloudinary"
    );
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    password,
    avatar: {
      url: avatar?.secure_url,
      publicId: avatar?.public_id,
    },
    interests: interests || [],
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  setCookies(res, accessToken, refreshToken);

  return res
    .status(200)
    .json(new ApiResponse(200, loggedInUser, "User Logged in Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const renewAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const accessToken = await generateAccessToken(user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid Refresh Token");
  }
});

const getAllFriends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const friends = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
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
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$friends",
    },
    {
      $replaceRoot: {
        newRoot: "$friends",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, friends, "Friends fetched successfully"));
});

const recommededFriends = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("friends interests");

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const { friends, interests } = user;

  const recommendedFriends = await User.aggregate([
    {
      $match: {
        _id: { $ne: user._id, $nin: friends },
      },
    },
    {
      $addFields: {
        mutualFriendsCount: {
          $size: {
            $setIntersection: ["$friends", friends],
          },
        },
      },
    },
    {
      $match: {
        $or: [
          { mutualFriendsCount: { $gt: 0 } },
          { interests: { $in: interests } },
        ],
      },
    },
    {
      $lookup: {
        from: "friendrequests",
        localField: "_id",
        foreignField: "receiver",
        as: "sentRequests",
      },
    },
    {
      $addFields: {
        isRequestSent: {
          $cond: {
            if: { $in: [req.user?._id, "$sentRequests.sender"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        fullName: 1,
        avatar: 1,
        interests: 1,
        // sentRequests: 1,
        isRequestSent: 1,
        mutualFriendsCount: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, recommendedFriends, "Friends fetched successfully")
    );
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const searchFilter = search
    ? {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: req.user?._id,
        },
        ...searchFilter,
      },
    },
    {
      $lookup: {
        from: "friendrequests",
        localField: "_id",
        foreignField: "receiver",
        as: "sentRequests",
      },
    },
    {
      $addFields: {
        isRequestSent: {
          $cond: {
            if: { $in: [req.user?._id, "$sentRequests.sender"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $addFields: {
        isFriend: {
          $cond: {
            if: { $in: [req.user?._id, "$friends"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        fullName: 1,
        avatar: 1,
        isRequestSent: 1,
        isFriend: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const deleteFriend = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { friendId } = req.params;
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (!user || !friend) {
    throw new ApiError(404, "User or friend not found");
  }

  if (!user.friends.includes(friendId)) {
    throw new ApiError(400, "User is not a friend");
  }

  user.friends = user.friends.filter((id) => id.toString() !== friendId);
  friend.friends = friend.friends.filter((id) => id.toString() !== userId);

  await user.save();
  await friend.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Friend deleted successfully"));
});

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  renewAccessToken,
  getAllFriends,
  recommededFriends,
  getAllUsers,
  deleteFriend,
};
