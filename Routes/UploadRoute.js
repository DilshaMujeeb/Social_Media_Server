import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // Use unique filename to prevent overwriting
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  console.log("inside multer");
  try {
    // Respond with a success message or any data you want
    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    // Handle errors appropriately
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
