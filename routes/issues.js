const express = require("express");
const router = express.Router();

const axios = require("axios");
const path = require("path");

const Issue = require("../models/Issue");
const upload = require("../middleware/upload");
const categorizeIssue = require("../utils/categorize");

const { imageHash } = require("image-hash");
const validateIssueImage = require("../utils/validateIssueImage");

// ==========================
// CREATE ISSUE
// ==========================
router.post("/", upload.single("image"), async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required"
      });
    }

    const title = (req.body.title || "").trim().toLowerCase();
    const description = (req.body.description || "").trim();
    const location = (req.body.location || "").trim().toLowerCase();

    const category = categorizeIssue(`${title} ${description}`);

    const imagePath = path.join(
      __dirname,
      "../uploads",
      req.file.filename
    );

    // ==========================
    // AI VALIDATION (SAFE OPTIONAL)
    // ==========================
    let aiValidation = {
      isIssue: true,
      category: "General Issue",
      reason: "default"
    };

    try {
      aiValidation = await validateIssueImage(imagePath);
      console.log("AI:", aiValidation);
    } catch (err) {
      console.log("AI skipped:", err.message);
    }

    // ==========================
    // IMAGE HASH (SAFE OPTIONAL)
    // ==========================
    let hashValue = null;

    try {
      hashValue = await new Promise((resolve, reject) => {
        imageHash(imagePath, 16, true, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (err) {
      console.log("Hash failed (ignored):", err.message);
    }

    // ==========================
    // DUPLICATE CHECK (ONLY IF HASH EXISTS)
    // ==========================
    if (hashValue) {
      const duplicate = await Issue.findOne({ imageHash: hashValue });

      if (duplicate) {
        return res.status(400).json({
          message: "Duplicate image detected"
        });
      }
    }

    // ==========================
    // CREATE ISSUE
    // ==========================
    const issue = new Issue({
      title,
      description,
      location,
      category: aiValidation.category || category,
      image: req.file.filename,
      imageHash: hashValue
    });

    await issue.save();

    // ==========================
    // N8N WEBHOOK (NON-BLOCKING)
    // ==========================
    try {
      await axios.post(
        "http://localhost:5678/webhook-test/issues",
        {
          title: issue.title,
          description: issue.description,
          category: issue.category,
          location: issue.location,
          status: issue.status,
          imageUrl: `http://localhost:5000/uploads/${issue.image}`
        }
      );
    } catch (err) {
      console.log("N8N failed:", err.message);
    }

    // RESPONSE
    res.status(201).json(issue);

  } catch (err) {
    console.log("SERVER ERROR:", err.message);

    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
});

// ==========================
// GET ALL ISSUES
// ==========================
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// UPDATE STATUS
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;