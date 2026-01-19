// src/auth/Register.jsx
import { useState, useEffect } from "react";
import AuthForm from "./AuthForm";
import { register } from "../../services/authService";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        title="Create an Account"
        buttonText="Create Account"
        onSubmit={handleSubmit}
        success={success}
        error={error}
        loading={loading}
        loadingText="Creating account..."
      >
        {/* First Name and Last Name Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* First Name Input */}
          <div>
            <label
              htmlFor="firstName"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="e.g. Juan"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Last Name Input */}
          <div>
            <label
              htmlFor="lastName"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="e.g. Dela Cruz"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Email and Phone Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Email Address<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="e.g. juan@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="e.g. 09123456789"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              disabled={loading}
              maxLength={11}
              pattern="[0-9]{11}"
              inputMode="numeric"
              required
            />
          </div>
        </div>

        {/* Date of Birth and Gender Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Date of Birth Input */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              placeholder="YYYY-MM-DD"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              disabled={loading}
              required
            />
          </div>

          {/* Gender Input */}
          <div>
            <label
              htmlFor="gender"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              disabled={loading}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Address Input - Full Width */}
        <div>
          <label
            htmlFor="address"
            className="block mb-1 text-xs font-medium text-gray-700"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="e.g. 123 Mabini St., Brgy. Malinis, Lungsod ng Maynila"
            value={formData.address}
            onChange={handleChange}
            rows="2"
            className="w-full px-2.5 py-2.5 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
            disabled={loading}
            required
          />
        </div>

        {/* Password and Confirm Password Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Password Input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Password<span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 pr-8 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 -translate-y-1/2 right-2 top-[calc(50%+9px)] hover:text-gray-600"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
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

          {/* Confirm Password Input */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Confirm Password<span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 pr-8 text-base transition-all border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute text-gray-400 -translate-y-1/2 right-2 top-[calc(50%+9px)] hover:text-gray-600"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                {showConfirmPassword ? (
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
        </div>
      </AuthForm>

      {/* Divider */}
      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <p className="mt-2 text-xs text-center text-gray-600">
        Have an account?{" "}
        <Link
          className="font-semibold text-green-600 cursor-pointer hover:underline"
          to="/SignIn"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
