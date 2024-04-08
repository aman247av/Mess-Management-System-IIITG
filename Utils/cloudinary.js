const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Complaint = require("../Models/complaintModel")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath, id) => {
    try {
        if (!localFilePath) {
            throw new Error("File path is missing");
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        const complaint = await Complaint.findByIdAndUpdate(id, { photo: response.url }, { new: true });

        console.log("Complaint updated: ", complaint);

        fs.unlinkSync(localFilePath);
        return { success: true, url: response.url };

    } catch (error) {
        
        console.error("Error uploading file to Cloudinary: ", error);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return { success: false, error: "Failed to upload file to Cloudinary" };
    }
};

module.exports = uploadOnCloudinary;
