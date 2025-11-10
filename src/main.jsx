import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.js";
import Layout from "./pages/Layout.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import UserDashboard from "./pages/dashboard/UserDashboard.tsx";
import Create from "./pages/dashboard/Create.tsx";
import DashboardLayout from "./pages/dashboard/Layout.tsx";
import PublicPetProfile from "./pages/pet/PublicPetProfile.tsx";
import TagGenerator from "./pages/admin/TagGenerator.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: App,
        errorElement: <div>Error</div>,
      },
      {
        path: "about",
        Component: About,
        errorElement: <div>Error</div>,
      },
      {
        path: "contact",
        Component: Contact,
        errorElement: <div>Error</div>,
      },
      {
        path: "login",
        Component: Login,
        errorElement: <div>Error</div>,
      },
      {
        path: "register",
        Component: Register,
        errorElement: <div>Error</div>,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        errorElement: <div>Error</div>,
        children: [
          {
            index: true,
            Component: UserDashboard,
          },
          {
            path: "create",
            Component: Create,
          },
        ],
      },
      {
        path: "pet/:id",
        Component: PublicPetProfile,
        errorElement: <div>Error</div>,
      },
      {
        path: "admin/tags",
        Component: TagGenerator,
        errorElement: <div>Error</div>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
