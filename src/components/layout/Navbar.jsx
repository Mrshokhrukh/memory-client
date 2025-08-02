"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/slices/authSlice"
import { toggleSidebar } from "../../store/slices/uiSlice"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Memoryscape</span>
            </Link>
          </div>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive("/dashboard") ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/capsules"
                className={`text-sm font-medium transition-colors ${
                  isActive("/capsules") ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Capsules
              </Link>
              <Link
                to="/explore"
                className={`text-sm font-medium transition-colors ${
                  isActive("/explore") ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Explore
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Create Capsule Button */}
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => navigate("/create-capsule")}
                  className="hidden sm:inline-flex"
                >
                  Create Capsule
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <Avatar src={user?.avatarUrl} alt={user?.name} size="medium" />
                    <span className="hidden md:block text-gray-700">{user?.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => dispatch(toggleSidebar())}
                  className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign in
                </Link>
                <Button variant="primary" size="small" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />}
    </nav>
  )
}

export default Navbar
