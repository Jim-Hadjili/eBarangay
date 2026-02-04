"use client";

import { useState, useRef, useEffect } from "react";
import LogOutModal from "../modals/logoutModal";

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

export default function Header({
  onLogout,
  onEditProfile,
  onQueueHistory,
  user = null,
  logoSrc = "/images/Logo.png",
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if user is admin or super admin
  const isAdmin =
    user?.userType === "Admin" || user?.userType === "Super Admin";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const getInitials = () => {
    if (!user) return "?";
    return (
      `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "?"
    );
  };

  const getFullName = () => {
    if (!user) return isAdmin ? "Admin" : "User";
    return (
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      (isAdmin ? "Admin" : "User")
    );
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsLogOutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    onLogout?.();
  };

  const handleEditProfileClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    onEditProfile?.();
  };

  const handleQueueHistoryClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    onQueueHistory?.();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-3 py-3 sm:px-4 md:px-6 lg:px-20 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Logo Section - Always Visible */}
            <div className="flex items-center min-w-0 gap-2 sm:gap-3 shrink-0">
              <img
                src={logoSrc || "/placeholder.svg"}
                alt="eBarangay Logo"
                className="object-contain w-8 h-8 sm:w-9 sm:h-9 md:size-14 shrink-0"
              />
              <span className="font-sans text-sm font-bold text-gray-900 truncate sm:text-base md:text-lg lg:text-xl">
                {isAdmin ? "eBarangay Admin" : "eBarangay Healthcare"}
              </span>
            </div>

            {/* Profile Section */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-2 py-2 transition-all duration-200 rounded-lg cursor-pointer sm:gap-3 sm:px-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-gray-100"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {/* Avatar */}
                {user?.profileImage ? (
                  <img
                    src={`${API_BASE_URL}${user.profileImage}`}
                    alt="Profile"
                    className="object-cover w-8 h-8 border-2 border-blue-500 rounded-full sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0"
                  />
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br from-blue-500 to-blue-600 sm:text-sm shrink-0">
                    {getInitials()}
                  </div>
                )}

                {/* User Name - Hidden on very small screens */}
                <span className="hidden text-xs font-medium text-gray-700 truncate sm:block sm:text-sm max-w-30">
                  {getFullName()}
                </span>

                {/* Chevron Icon */}
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-transform duration-200 shrink-0 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 z-50 w-56 mt-2 overflow-hidden duration-200 origin-top-right bg-white border border-gray-100 rounded-lg shadow-xl top-full sm:w-64 animate-in fade-in slide-in-from-top-1">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100 sm:py-4 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-900 truncate sm:text-sm">
                      {getFullName()}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 truncate">
                      {isAdmin ? "Administrator" : "Patient"}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleEditProfileClick}
                      className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 active:bg-blue-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 shrink-0 sm:w-5 sm:h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.5 1.5-4.5 12.362-12.226z"
                        />
                      </svg>
                      <span>Edit Profile</span>
                    </button>

                    {!isAdmin && (
                      <button
                        onClick={handleQueueHistoryClick}
                        className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 active:bg-blue-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 shrink-0 sm:w-5 sm:h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Queue History</span>
                      </button>
                    )}

                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 active:bg-red-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 shrink-0 sm:w-5 sm:h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      <LogOutModal
        isOpen={isLogOutModalOpen}
        onClose={() => setIsLogOutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
