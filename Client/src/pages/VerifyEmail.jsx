// pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/authService";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token was found in the link.");
      return;
    }

    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.message || "The verification link is invalid or has expired.",
        );
      });
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-green-100 via-green-200 to-green-300">
      <div className="w-full max-w-md p-8 bg-white border border-gray-300 shadow-2xl rounded-3xl text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <img
              src="/images/Logo.png"
              alt="eBarangay Logo"
              className="w-auto h-10"
            />
            <span className="text-sm text-gray-800 font-Lexend">
              eBarangay Healthcare
            </span>
          </div>
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-Lexend mb-2">
              Verifying Your Email
            </h2>
            <p className="text-sm text-gray-500">
              Please wait, we are verifying your email address…
            </p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-Lexend mb-2">
              Email Verified!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Your account has been created successfully. You can now sign in
              with your credentials.
            </p>
            <Link
              to="/SignIn"
              className="inline-block w-full py-2.5 font-semibold text-sm text-white bg-linear-to-r from-green-400 to-green-500 rounded-xl hover:from-green-500 hover:to-green-600 shadow-lg text-center transition-all hover:-translate-y-0.5"
            >
              Sign In to Your Account
            </Link>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-Lexend mb-2">
              Verification Failed
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {message || "The verification link is invalid or has expired."}
            </p>
            <Link
              to="/"
              className="inline-block w-full py-2.5 font-semibold text-sm text-white bg-linear-to-r from-green-400 to-green-500 rounded-xl hover:from-green-500 hover:to-green-600 shadow-lg text-center transition-all hover:-translate-y-0.5"
            >
              Try Registering Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
