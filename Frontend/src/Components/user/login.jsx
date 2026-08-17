import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style/Login.css";
import { login } from "../../libs/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login: signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token, user } = await login(email, password);

      // AuthContext owns persistence (token + role + cached profile)
      signIn(token, user);

      if (user.role === "admin") navigate("/admin-dashboard");
      else navigate("/");

    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          {/* LEFT SIDE */}
          <div className="col-lg-5 d-none d-lg-block rounded-start left-side">
            <div className="text-white p-5 h-100 d-flex flex-column justify-content-center align-items-center">
              <h2>Welcome Back!</h2>
              <p>Login to access your account</p>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="right-side col-lg-5 bg-white p-5 rounded-end shadow">
            <h2 className="fw-bold mb-3">Login</h2>
            <h5 className="text-muted mb-4">Login to your account to continue</h5>

            <form onSubmit={handleLogin}>
              {/* EMAIL */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-light">
                  <i className="fa fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa fa-spinner fa-spin me-2"></i> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-center text-muted mt-3">
              Don’t have an account?{" "}
                <span
                  className="signup-link"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
