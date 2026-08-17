import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/Contact.css";
import { sendContactMessage } from "../../libs/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    productInterestedIn: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setErrorMessage("");

    const { name, email, message } = formData;
    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage(
        "Please fill in all required fields: Name, Email, and Message."
      );
      return;
    }

    setSending(true);
    try {
      await sendContactMessage(formData);
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        productInterestedIn: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="container py-5">
        <h2 className="text-start  mb-5">Contact Us</h2>

        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-md-6">
            <div className="p-4 bg-white rounded shadow">
              <h4 className="mb-3">Send us a message</h4>

              {status === "success" && (
                <div className="alert alert-success" role="status">
                  Message sent successfully!
                </div>
              )}
              {status === "error" && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Name + Email in one row */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your Name"
                      aria-label="Your name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      aria-label="Email address"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Product / Item Interested In */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="productInterestedIn"
                    className="form-control"
                    placeholder="Product / Item Interested In (optional)"
                    aria-label="Product or item you are interested in"
                    value={formData.productInterestedIn}
                    onChange={handleChange}
                  />
                </div>

                {/* Message textarea */}
                <div className="mb-3">
                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    placeholder="Your message / questions..."
                    aria-label="Your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="send-message-btn"
                  disabled={sending}
                >
                  {sending ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information + Map */}
          <div className="col-md-6">
            <div className="p-4 bg-white rounded shadow">
              <h4 className="mb-3">Contact Information</h4>

              <p>
                <strong>Address:</strong> 224 Main Street,Hakha City,Myanmar
                Country
              </p>
              <p>
                <strong>Phone:</strong> +95 9897725105
              </p>
              <p>
                <strong>Email:</strong> brChindress@example.
              </p>

              <hr />

              <h5 className="text-center mb-3">
                Our Location (Hakha, Chin State)
              </h5>
              {/* className had a literal leading dot (".map-container"), so
                  the stylesheet rule never matched */}
              <div
                className="map-container"
                style={{ width: "100%", height: "320px" }}
              >
                <iframe
                  title="Chin Shop location in Hakha, Chin State"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.3518998997073!2d93.62007067481118!3d22.64475593170524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3731b9f04f3e2c31%3A0x6d675e1d1ba4f843!2sHakha%2C%20Chin%20State!5e0!3m2!1sen!2smm!4v1732536000000!5m2!1sen!2smm"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
