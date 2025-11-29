const ContactMessage = require("../models/ContactMessage");

// Create new contact message (frontend)
async function createContactMessage(req, res) {
  try {
    const { name, email, productInterestedIn, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      productInterestedIn,
      message,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      message: "Contact message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get all messages (admin)
async function getAllMessages(req, res) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update read/unread status (admin)
async function updateMessageStatus(req, res) {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (typeof req.body.isRead !== "boolean") {
      return res.status(400).json({ message: "isRead boolean required" });
    }

    message.isRead = req.body.isRead;
    await message.save();

    res.status(200).json({ message: "Message status updated", data: message });
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete a message (admin)
async function deleteMessage(req, res) {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createContactMessage,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
};
