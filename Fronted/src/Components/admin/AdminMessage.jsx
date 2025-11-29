import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllMessages, deleteMessage, updateMessageStatus } from "../../libs/api";
import { BsTrash, BsEnvelopeOpen, BsEnvelope } from "react-icons/bs";

export default function AdminMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllMessages();
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Delete message
  const handleDelete = async (id) => {

    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // Mark as Read / Unread
  const toggleReadStatus = async (id, currentStatus) => {
    try {
      await updateMessageStatus(id, { isRead: !currentStatus });

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, isRead: !currentStatus } : msg
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="container py-4 bg-white "style={{width:"100%", height:"100vh"}} >
      <h2 className="mb-4 text-black " style={{fontFamily:"arial"}} >📩 Contact Messages</h2>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Interested In</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className={msg.isRead ? "" : "fw-bold"}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.productInterestedIn || "-"}</td>
                  <td style={{ maxWidth: "320px" }}>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleDateString()}</td>

                  {/* Read / Unread */}
                  <td>
                    <button
                      className={`btn btn-sm ${
                        msg.isRead ? "btn-success" : "btn-warning"
                      }`}
                      onClick={() => toggleReadStatus(msg._id, msg.isRead)}
                    >
                      {msg.isRead ? <BsEnvelopeOpen /> : <BsEnvelope />}{" "}
                      {msg.isRead ? "Read" : "Unread"}
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="text-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(msg._id)}
                    >
                      <BsTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
