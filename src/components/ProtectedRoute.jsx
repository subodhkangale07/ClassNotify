import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) =>
{
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  console.log("stored token" , token );
  console.log("stored role" , role );
  console.log("required role" , requiredRole );

  if (!token || role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
