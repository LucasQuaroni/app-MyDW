import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Brand */}
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-800">MyDW</h1>
                        </div>
                        
                        {/* Navigation Links */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
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
                            </div>
                        </div>
                        
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile menu */}
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                        <Link 
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" 
                            to="/"
                        >
                            Home
                        </Link>
                        <Link 
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" 
                            to="/about"
                        >
                            About
                        </Link>
                        <Link 
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" 
                            to="/contact"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
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
