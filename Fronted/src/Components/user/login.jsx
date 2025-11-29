import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style/Login.css";
import { login } from "../../libs/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
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

      // Save token and role
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // Update AuthContext
      setUser({
        id: user.id,
        role: user.role,
        token,
      });

      if (user.role === "admin") navigate("/admin-dashboard");
      else navigate("/");

    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="container h-100">
        <div className="row justify-content-center align-items-stretch login-row">
          {/* LEFT SIDE */}
          <div className="left col-lg-5 bg-rounded-start p-5 d-flex flex-column justify-content-center">
            <div className="left-container">
            <h2 className="text-white mb-3">Welcome Back!</h2>
            <p className="text-white">Login to access your account</p>
          </div>
</div>
          {/* RIGHT SIDE */}
          <div className="right col-lg-5 bg-white p-5 rounded-end shadow d-flex flex-column justify-content-center">
            <h2 className="mb-3">Welcome</h2>
            <h5 className="text-muted mb-4">
              Login to your account to continue
            </h5>

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
                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>
              </div>

              {/* ERROR MESSAGE */}
              {error && <div className="alert alert-danger mt-2">{error}</div>}

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

            {/* SIGNUP LINK */}
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
