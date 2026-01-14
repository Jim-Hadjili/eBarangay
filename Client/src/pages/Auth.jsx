import { Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  let image;

  if (location.pathname === "/") {
    image = "/images/SignUpPage.png";
  } else {
    image = "/images/SignInPage.png";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white lg:flex-row lg:bg-white lg:h-screen bg-linear-to-br lg:bg-none from-green-100 via-green-200 to-green-300">
      {/* Left Side - Illustration */}
      <div className="items-center justify-center hidden w-1/2 h-full p-12 lg:flex">
        <div className="relative w-full">
          <img
            src={image}
            alt="Healthcare illustration"
            className="object-contain w-full h-auto"
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full p-4 lg:w-1/2 lg:h-full">
        <div className="w-full max-w-md p-6 bg-white border border-gray-300 shadow-2xl rounded-3xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
