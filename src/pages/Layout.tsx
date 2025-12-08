import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { logoutUser, observeUser } from "../features/auth/authSlice";
import { UserCircle } from "lucide-react";

const Layout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Firebase auth observer when Layout mounts
  useEffect(() => {
    const setupObserver = async () => {
      await dispatch(observeUser());
    };
    setupObserver();
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 font-elms">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0">
              <Link to="/" className="group flex items-center gap-2">
                <img
                  src="/Logo.svg"
                  alt="E-patitas Logo"
                  className="h-8 w-8 -rotate-20 font-fauna group-hover:rotate-0 transition-transform duration-300 "
                  style={{
                    filter:
                      "invert(57%) sepia(77%) saturate(2064%) hue-rotate(358deg) brightness(101%) contrast(103%)",
                  }}
                />
                <h1 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors duration-300">
                  E-patitas{" "}
                </h1>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  to="/"
                >
                  Inicio
                </Link>

                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  to="/lost-pets"
                >
                  Mascotas perdidas
                </Link>

                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  to="/contact"
                >
                  Contacto
                </Link>

                {user && (
                  <Link
                    className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    to="/dashboard"
                  >
                    Mis mascotas
                  </Link>
                )}

                {user?.isAdmin && (
                  <Link
                    className="text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    to="/admin/tags"
                  >
                    🏷️ Admin Tags
                  </Link>
                )}

                {/* Auth buttons */}
                {user ? (
                  <>
                    <Link
                      to="/dashboard/profile"
                      className="font-extrabold flex items-center gap-2 text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm transition-colors duration-200"
                      title="Mi perfil"
                    >
                      Mi perfil
                    </Link>
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
                to="/lost-pets"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mascotas perdidas
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
              {user && (
                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis mascotas
                </Link>
              )}
              {user?.isAdmin && (
                <Link
                  className="text-gray-300 hover:text-orange-400 hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  to="/admin/tags"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏷️ Admin Tags
                </Link>
              )}
              {/* Auth buttons mobile */}
              {user ? (
                <>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 text-gray-300 hover:text-orange-400 hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircle className="w-5 h-5" />
                    Mi perfil
                  </Link>
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
                    className="bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 shadow-lg"
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
