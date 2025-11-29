const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getAllMessages,
  deleteMessage,
  updateMessageStatus,
} = require("../controllers/contactController");
const authAdmin = require("../middleware/authAdmin");

// routes
router.post("/", createContactMessage);
router.get("/", authAdmin, getAllMessages);
router.patch("/:id", authAdmin, updateMessageStatus);
router.delete("/:id", authAdmin, deleteMessage);

module.exports = router;
