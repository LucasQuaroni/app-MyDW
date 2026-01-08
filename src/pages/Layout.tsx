import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { logoutUser, observeUser } from "../features/auth/authSlice";
import { UserCircle, X } from "lucide-react";

const Layout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Determines if a navigation link is currently active based on the current location
   * @param path - The path to check against
   * @param exact - Whether to match exactly (default: false for nested routes)
   * @returns boolean indicating if the link is active
   */
  const isActiveRoute = (path: string, exact: boolean = false): boolean => {
    if (exact) {
      return location.pathname === path;
    }
    
    // Special handling for dashboard routes
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname.startsWith("/dashboard/create") ||
        location.pathname.startsWith("/dashboard/edit")
      );
    }
    
    // For other routes, check if pathname starts with the path
    return location.pathname.startsWith(path);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-menu-button]')
      ) {
        setMobileMenuOpen(false);
      }
    };

    // Prevent body scroll when menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActiveRoute("/", true)
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  }`}
                  to="/"
                >
                  Inicio
                  {isActiveRoute("/", true) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                  )}
                </Link>

                <Link
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActiveRoute("/lost-pets", true)
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  }`}
                  to="/lost-pets"
                >
                  Mascotas perdidas
                  {isActiveRoute("/lost-pets", true) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                  )}
                </Link>

                <Link
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActiveRoute("/contact", true)
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  }`}
                  to="/contact"
                >
                  Contacto
                  {isActiveRoute("/contact", true) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                  )}
                </Link>

                {user && (
                  <Link
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActiveRoute("/dashboard")
                        ? "text-orange-400 bg-orange-500/10"
                        : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    }`}
                    to="/dashboard"
                  >
                    Mis mascotas
                    {isActiveRoute("/dashboard") && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                    )}
                  </Link>
                )}

                {user?.isAdmin && (
                  <Link
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActiveRoute("/admin/tags", true)
                        ? "text-orange-400 bg-orange-500/10"
                        : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    }`}
                    to="/admin/tags"
                  >
                    🏷️ Admin Tags
                    {isActiveRoute("/admin/tags", true) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                    )}
                  </Link>
                )}

                {/* Auth buttons */}
                {user ? (
                  <>
                    <Link
                      to="/dashboard/profile"
                      className={`relative font-extrabold flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        isActiveRoute("/dashboard/profile", true)
                          ? "text-orange-400 bg-orange-500/10"
                          : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                      }`}
                      title="Mi perfil"
                    >
                      Mi perfil
                      {isActiveRoute("/dashboard/profile", true) && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                      )}
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
                data-menu-button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-orange-400 focus:outline-none focus:text-orange-400 transition-colors duration-200"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
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
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay and panel */}
        <div
          className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div
            ref={menuRef}
            className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900 border-l border-gray-800 shadow-2xl transform transition-transform duration-300 ease-out ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Menú</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200 p-1 rounded-md hover:bg-gray-800"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu content */}
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              <nav className="px-4 py-6 space-y-2">
                <Link
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group ${
                    isActiveRoute("/", true)
                      ? "text-orange-400 bg-orange-500/10 border-l-4 border-orange-500"
                      : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  }`}
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span
                    className={`transition-transform duration-200 ${
                      isActiveRoute("/", true)
                        ? "translate-x-1"
                        : "group-hover:translate-x-1"
                    }`}
                  >
                    Inicio
                  </span>
                </Link>

                <Link
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group ${
                    isActiveRoute("/lost-pets", true)
                      ? "text-orange-400 bg-orange-500/10 border-l-4 border-orange-500"
                      : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  }`}
                  to="/lost-pets"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span
                    className={`transition-transform duration-200 ${
                      isActiveRoute("/lost-pets", true)
                        ? "translate-x-1"
                        : "group-hover:translate-x-1"
                    }`}
                  >
                    Mascotas perdidas
                  </span>
                </Link>

                <Link
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group ${
                    isActiveRoute("/contact", true)
                      ? "text-orange-400 bg-orange-500/10 border-l-4 border-orange-500"
                      : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                  }`}
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span
                    className={`transition-transform duration-200 ${
                      isActiveRoute("/contact", true)
                        ? "translate-x-1"
                        : "group-hover:translate-x-1"
                    }`}
                  >
                    Contacto
                  </span>
                </Link>

                {user && (
                  <>
                    <div className="border-t border-gray-800 my-4" />
                    <Link
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group ${
                        isActiveRoute("/dashboard")
                          ? "text-orange-400 bg-orange-500/10 border-l-4 border-orange-500"
                          : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                      }`}
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span
                        className={`transition-transform duration-200 ${
                          isActiveRoute("/dashboard")
                            ? "translate-x-1"
                            : "group-hover:translate-x-1"
                        }`}
                      >
                        Mis mascotas
                      </span>
                    </Link>
                  </>
                )}

                {user?.isAdmin && (
                  <Link
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group ${
                      isActiveRoute("/admin/tags", true)
                        ? "text-orange-400 bg-orange-500/10 border-l-4 border-orange-500"
                        : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    }`}
                    to="/admin/tags"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span
                      className={`transition-transform duration-200 ${
                        isActiveRoute("/admin/tags", true)
                          ? "translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    >
                      🏷️ Admin Tags
                    </span>
                  </Link>
                )}

                {/* Auth section */}
                <div className="border-t border-gray-800 my-4" />
                {user ? (
                  <>
                    <Link
                      to="/dashboard/profile"
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group ${
                        isActiveRoute("/dashboard/profile", true)
                          ? "text-orange-400 bg-orange-500/10 border-l-4 border-orange-500"
                          : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircle className="w-5 h-5 flex-shrink-0" />
                      <span
                        className={`transition-transform duration-200 ${
                          isActiveRoute("/dashboard/profile", true)
                            ? "translate-x-1"
                            : "group-hover:translate-x-1"
                        }`}
                      >
                        Mi perfil
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-gray-300 hover:text-red-400 hover:bg-red-900/20 w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        Cerrar sesión
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      className={`relative flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group ${
                        isActiveRoute("/login", true)
                          ? "text-orange-400 bg-orange-500/10 border-l-4 border-orange-500"
                          : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                      }`}
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span
                        className={`transition-transform duration-200 ${
                          isActiveRoute("/login", true)
                            ? "translate-x-1"
                            : "group-hover:translate-x-1"
                        }`}
                      >
                        Iniciar sesión
                      </span>
                    </Link>
                    <Link
                      className={`relative flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-lg group ${
                        isActiveRoute("/register", true)
                          ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white border-l-4 border-orange-400"
                          : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                      }`}
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span
                        className={`transition-transform duration-200 ${
                          isActiveRoute("/register", true)
                            ? "scale-105"
                            : "group-hover:scale-105"
                        }`}
                      >
                        Registrarse
                      </span>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
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
