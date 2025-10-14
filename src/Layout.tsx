import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <br />
                <Link to="/about">About</Link>
                <br />
                <Link to="/contact">Contact</Link>
            </nav>
            <br />
            <h2>Layout</h2>
            <Outlet />
        </div>
    )
};

export default Layout;
