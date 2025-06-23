import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Supabase session to be set before redirecting
    let isMounted = true;
    const checkSession = async () => {
      for (let i = 0; i < 30; i++) { // wait up to 3 seconds
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          navigate("/dashboard");
          return;
        }
        await new Promise(res => setTimeout(res, 100));
      }
      // fallback: still redirect after timeout
      if (isMounted) navigate("/dashboard");
    };
    checkSession();
    return () => { isMounted = false; };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Signing you in...</p>
    </div>
  );
};

export default AuthCallback;
