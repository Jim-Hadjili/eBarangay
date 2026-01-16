// src/auth/Login.jsx
import { useState, useEffect } from "react";
import AuthForm from "./AuthForm";
import { login } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = await login({ email, password });
      setSuccess(true);
      setEmail("");
      setPassword("");
      localStorage.setItem("token", data.token);
      navigate("/PatientDashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        title="Sign In to Your Account"
        buttonText="Sign In"
        onSubmit={handleSubmit}
        success={success}
        error={error}
        loading={loading}
        loadingText="Signing in..."
      >
        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 transition-all border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 transition-all border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-gray-400 -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
            disabled={loading}
          >
            {/* ...SVG ICON... */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              {showPassword ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
              )}
            </svg>
          </button>
        </div>
      </AuthForm>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <Link
          className="font-semibold text-green-600 cursor-pointer hover:underline"
          to="/"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
}
