import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Waiting for session...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      for (let i = 0; i < 30; i++) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error && isMounted) {
          setError(error.message);
          break;
        }
        if (session && isMounted) {
          setStatus("Session found, redirecting...");
          navigate("/dashboard");
          return;
        }
        await new Promise(res => setTimeout(res, 100));
      }
      if (isMounted) {
        setStatus("Session not found after waiting. Redirecting anyway...");
        navigate("/dashboard");
      }
    };
    checkSession();
    return () => { isMounted = false; };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>{status}</p>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
    </div>
  );
};

export default AuthCallback;
