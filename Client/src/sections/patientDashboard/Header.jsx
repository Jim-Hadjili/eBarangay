import Header from "../sections/patientDashboard/Header";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserFromToken, clearToken } from "../../utils/session";
import LogOutModal from "../../components/modals/logoutModal";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userData = getUserFromToken(token);
      setUser(userData);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
    };

    if (isMobileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMobileDropdownOpen]);

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  const handleMobileLogoutClick = () => {
    setIsMobileDropdownOpen(false);
    setIsLogOutModalOpen(true);
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName?.[0] || ""}${
      user.lastName?.[0] || ""
    }`.toUpperCase();
  };

  const getFullName = () => {
    if (!user) return "";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="w-full px-6 py-3 md:px-8 lg:px-20">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Section */}
            <div className="flex items-center gap-2 shrink-0">
              <img
                src="/images/Logo.png"
                alt="HealthQueue Logo"
                className="w-auto h-10 md:h-14"
              />
              <span className="text-base font-bold text-gray-900 sm:text-lg md:text-2xl font-Lexend sm:inline">
                eBarangay Health
              </span>
            </div>

            {/* Desktop Profile and Logout Section */}
            <div className="items-center hidden gap-6 md:flex">
              {/* Profile Section */}
              <button className="flex items-center gap-3 px-3 py-2 transition-colors duration-200 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <div className="flex items-center justify-center text-sm font-semibold text-white rounded-full w-9 h-9 bg-linear-to-br from-blue-500 to-blue-600">
                  {getInitials()}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {getFullName()}
                </span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => setIsLogOutModalOpen(true)}
                className="p-2 text-gray-600 transition-colors duration-200 rounded-lg cursor-pointer md:py-3 md:px-2 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Logout"
                aria-label="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-5 md:size-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Profile with Dropdown */}
            <div className="relative md:hidden" ref={dropdownRef}>
              {/* Profile Avatar Button */}
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="flex items-center justify-center text-xs font-semibold text-white rounded-full size-9 bg-linear-to-br from-blue-500 to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="Profile"
                aria-label="User profile"
              >
                {getInitials()}
              </button>

              {/* Dropdown Menu */}
              {isMobileDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg w-52">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {getFullName()}
                    </p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleMobileLogoutClick}
                    className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-left text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <LogOutModal
        isOpen={isLogOutModalOpen}
        onClose={() => setIsLogOutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
