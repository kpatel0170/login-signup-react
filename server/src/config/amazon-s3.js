// *
// *
// *
// eslint-disable-next-line
import s3Service from "../services/amazon-s3.js";
// eslint-disable-next-line
import multer from "multer";
// eslint-disable-next-line
import multerS3 from "multer-s3";
import express from "express";
import config from "./config.js";

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3Service.s3,
    bucket: config.aws.bucketName,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    }
  })
});

// Backend route handler for uploading images
const uploadImage = async (req, res) => {
  try {
    const { file, user } = req; // Assuming 'file' and 'user' are available from your middleware

    // Upload the image to S3
    const uploadResponse = await s3Service.uploadImage(
      file.originalname,
      file.buffer
    );

    // Store the image URL or key in the user profile data in MongoDB
    user.profileImage = uploadResponse.Location; // Assuming 'profileImage' field in the user schema

    // Save the updated user profile data in MongoDB
    await user.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: uploadResponse.Location
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Backend route handler for multiple image uploads
const uploadMultipleImages = async (req, res) => {
  try {
    const { files, user } = req; // Assuming 'files' and 'user' are available from your middleware

    const uploadedImages = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      const uploadResponse = await s3Service.uploadImage(
        file.originalname,
        file.buffer
      );
      uploadedImages.push(uploadResponse.Location);
    }

    // Store the uploaded image URLs or keys in the user profile data in MongoDB
    user.images = uploadedImages; // Assuming 'images' field in the user schema

    // Save the updated user profile data in MongoDB
    await user.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls: uploadedImages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Backend route handler for fetching user profile image
const getUserProfileImage = async (req, res) => {
  try {
    const { user } = req; // Assuming 'user' is available from your middleware

    // Fetch the image from S3
    const image = await s3Service.downloadImage(user.profileImage);

    // Send the image data back to the client
    res.status(200).send(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Define routes for image upload and fetching user profile image
router.post("/upload", uploadImage);
router.post(
  "/upload/multiple",
  upload.array("images", 5),
  uploadMultipleImages
);
router.get("/user/profile/image", getUserProfileImage);
