import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return "Could not find the File Path";
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      secure: true,
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Error while uploading image on Cloudinary", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return "Could not find the Public Id";
    const res = await cloudinary.uploader.destroy(publicId);
    return res;
  } catch (error) {
    console.error("Error while deleting image from Cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
