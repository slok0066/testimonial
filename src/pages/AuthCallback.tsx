import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically handles the hash and sets the session
    // Just wait a moment and redirect to dashboard (or wherever)
    const timer = setTimeout(() => {
      navigate("/dashboard"); // or your main page
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Signing you in...</p>
    </div>
  );
};

export default AuthCallback;
