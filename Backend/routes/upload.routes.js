import express from "express";
import upload from "../Middlewares/upload.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Convert Buffer to Base64
        const fileBase64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "chatConnect",
            resource_type: "auto",  // Auto-detect file type (image/video)
            public_id: req.file.originalname.split(".")[0], // Remove file extension for public_id
        });

        return res.status(200).json({ imageUrl: result.secure_url }); 
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
