import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllMessages, deleteMessage, updateMessageStatus } from "../../libs/api";
import { BsTrash, BsEnvelopeOpen, BsEnvelope } from "react-icons/bs";
import ConfirmDialog from "../common/ConfirmDialog";

export default function AdminMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      setMessages(await getAllMessages());
      setError("");
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError(err.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages
  useEffect(() => {
    fetchData();
  }, []);

  // Delete message
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteMessage(pendingDelete._id);
      setMessages((prev) => prev.filter((msg) => msg._id !== pendingDelete._id));
      toast.success("Message deleted.");
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error(err.message || "Failed to delete message.");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
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
      toast.error(err.message || "Failed to update message status.");
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="container-fluid py-4 px-3 px-md-4 bg-white min-vh-100">
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
        <h2 className="mb-0">📩 Contact Messages</h2>
        {!loading && !error && messages.length > 0 && (
          <span className="badge text-bg-warning">{unreadCount} unread</span>
        )}
      </div>

      {loading ? (
        <p className="text-muted">Loading messages…</p>
      ) : error ? (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchData}>
            Retry
          </button>
        </div>
      ) : messages.length === 0 ? (
        <p className="text-muted">No messages found.</p>
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
                  <td className="text-break">{msg.message}</td>
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
                      aria-label={`Delete message from ${msg.name}`}
                      onClick={() => setPendingDelete(msg)}
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

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this message?"
        message={
          pendingDelete
            ? `The message from ${pendingDelete.name} (${pendingDelete.email}) will be permanently removed.`
            : ""
        }
        confirmLabel="Delete message"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
