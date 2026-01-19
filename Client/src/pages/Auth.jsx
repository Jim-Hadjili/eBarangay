import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  let image;

  if (location.pathname === "/") {
    image = "/images/SignUpPage.png";
  } else {
    image = "/images/SignInPage.png";
  }

  // Check if current page is sign-up
  const isSignUpPage = location.pathname === "/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          navigate("/PatientDashboard");
        }
      } catch (err) {
        // Invalid token, do nothing
      }
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white lg:flex-row lg:bg-white lg:h-screen bg-linear-to-br lg:bg-none from-green-100 via-green-200 to-green-300">
      {/* Left Side - Illustration */}
      <div className="items-center justify-center hidden w-1/2 h-full p-6 lg:flex xl:p-12">
        <div className="relative w-full max-w-2xl">
          <img
            src={image}
            alt="Healthcare illustration"
            className="object-contain w-full h-auto"
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full p-4 sm:p-6 md:p-8 lg:w-1/2 lg:h-full lg:p-4">
        <div
          className={`w-full ${
            isSignUpPage ? "max-w-lg" : "max-w-md"
          } p-4 bg-white border border-gray-300 shadow-2xl sm:p-6 md:p-8 rounded-3xl`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
