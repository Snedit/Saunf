import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateToken } from "../utils/auth";

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
       setLoading(false);
      return;
    }
    else{

      validateToken(token).then((valid) => {
        console.log("is token valid? " , valid);
        
        setAllowed(valid);
        setLoading(false);
      });
    }
    
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        Checking session...
      </div>
    );

  if (!allowed) return <Navigate to="/" replace />;

  return children;
}
