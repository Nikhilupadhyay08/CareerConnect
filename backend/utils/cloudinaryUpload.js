const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer, folder = "careerconnect/resumes") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = uploadToCloudinary;