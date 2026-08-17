import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style/Signup.css";
import { register } from "../../libs/api";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Visitors always register as customers. Admin accounts are promoted
      // from the admin panel, never chosen on the public signup form.
      await register({ name, email, password });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signup-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          {/* LEFT SIDE */}
          <div className="col-lg-5  d-none d-lg-block rounded-start left-side">
            <div className="text-white p-5 h-100 d-flex flex-column justify-content-center align-items-center">
              <h2>Create Account</h2>
              <p>Join us and enjoy shopping today!</p>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="right-side col-lg-5 bg-white p-5 rounded-end shadow">
            <h2 className="fw-bold mb-3">Sign Up</h2>
            <h5 className="text-muted mb-4">Create your new account</h5>

            <form onSubmit={handleSignup}>
              {/* FULL NAME */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-light">
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  aria-label="Full name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-light">
                  <i className="fa fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  aria-label="Email address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="input-group mb-3 position-relative">
                <span className="input-group-text bg-light">
                  <i className="fa fa-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password (min. 6 characters)"
                  aria-label="Password"
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-reveal-password text-muted"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="alert alert-danger mt-2" role="alert">
                  {error}
                </div>
              )}

              {/* SIGNUP BUTTON */}
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa fa-spinner fa-spin me-2"></i> Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="text-center text-muted mt-3">
              Already have an account?{" "}
                <span
                  className="signup-link"
                  onClick={() => navigate("/login")}
                >
                  Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
