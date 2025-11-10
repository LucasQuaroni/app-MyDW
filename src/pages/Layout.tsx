import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <h1 className="text-xl font-bold text-orange-500">E-Patitas</h1>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  to="/about"
                >
                  About
                </Link>
                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  to="/contact"
                >
                  Contact
                </Link>
                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  to="/admin/tags"
                >
                  🏷️ Admin Tags
                </Link>

                {/* Auth buttons */}
                {currentUser ? (
                  <>
                    <span className="text-gray-400 px-3 py-2 text-sm">
                      {currentUser.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-red-400 hover:bg-red-900/20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      to="/login"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      className="bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-lg"
                      to="/register"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-orange-400 focus:outline-none focus:text-orange-400"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-gray-700">
              <Link
                className="text-gray-300 hover:text-orange-400 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                className="text-gray-300 hover:text-orange-400 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                className="text-gray-300 hover:text-orange-400 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                className="text-gray-300 hover:text-orange-400 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                to="/admin/tags"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏷️ Admin Tags
              </Link>

              {/* Auth buttons mobile */}
              {currentUser ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-400">
                    {currentUser.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-red-400 hover:bg-red-900/20 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="text-gray-300 hover:text-orange-400 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 shadow-lg"
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
