import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API_URL from "../api/apiConfig";

const ProtectedRoute = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {

    const checkAuthentication = async () => {

      const token = localStorage.getItem("adminToken");

      // Token hi nahi hai
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {

        const response = await fetch(
          `${API_URL}/admin/check`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.ok) {

          const data = await response.text();

          console.log("Authentication response:", data);

          if (data === "Authenticated") {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("adminToken");
            setIsAuthenticated(false);
          }

        } else if (response.status === 401) {

          console.log("JWT authentication failed");

          localStorage.removeItem("adminToken");
          setIsAuthenticated(false);

        } else {

          setIsAuthenticated(false);

        }

      } catch (error) {

        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);

      }

    };

    checkAuthentication();

  }, []);

  if (isAuthenticated === null) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;