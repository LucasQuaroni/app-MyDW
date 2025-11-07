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
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Brand */}
                        <div className="flex-shrink-0">
                            <Link to="/">
                                <h1 className="text-xl font-bold text-gray-800">MyDW</h1>
                            </Link>
                        </div>
                        
                        {/* Navigation Links */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link 
                                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
                                    to="/"
                                >
                                    Home
                                </Link>
                                <Link 
                                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
                                    to="/about"
                                >
                                    About
                                </Link>
                                <Link 
                                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
                                    to="/contact"
                                >
                                    Contact
                                </Link>
                                
                                {/* Auth buttons */}
                                {currentUser ? (
                                    <>
                                        <span className="text-gray-700 px-3 py-2 text-sm">
                                            {currentUser.email}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
                                            to="/login"
                                        >
                                            Iniciar sesión
                                        </Link>
                                        <Link 
                                            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200" 
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
                                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                            <Link 
                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" 
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" 
                                to="/about"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link 
                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" 
                                to="/contact"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            
                            {/* Auth buttons mobile */}
                            {currentUser ? (
                                <>
                                    <div className="px-3 py-2 text-sm text-gray-700">
                                        {currentUser.email}
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" 
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link 
                                        className="bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" 
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
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <Outlet />
                </div>
            </main>
        </div>
    )
};

export default Layout;
