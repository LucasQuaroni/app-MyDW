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
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import UserDashboard from "./pages/dashboard/UserDashboard.tsx";
import Create from "./pages/dashboard/Create.tsx";
import EditPet from "./pages/dashboard/EditPet.tsx";
import Profile from "./pages/dashboard/Profile.tsx";
import DashboardLayout from "./pages/dashboard/Layout.tsx";
import PublicPetProfile from "./pages/pet/PublicPetProfile.tsx";
import LostPets from "./pages/pet/LostPets.tsx";
import TagGenerator from "./pages/admin/TagGenerator.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";

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
          {
            path: "edit/:id",
            Component: EditPet,
          },
          {
            path: "profile",
            Component: Profile,
          },
        ],
      },
      {
        path: "pet/:id",
        Component: PublicPetProfile,
        errorElement: <div>Error</div>,
      },
      {
        path: "lost-pets",
        Component: LostPets,
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
