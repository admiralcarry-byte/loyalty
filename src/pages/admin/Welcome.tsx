import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets } from "lucide-react";

const AdminWelcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/admin/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-blue to-primary flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <Droplets className="w-24 h-24 text-white animate-pulse" />
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            ÁGUA TWEZAH
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Purified Water
          </p>
          <p className="text-lg text-white/80">
            Admin Panel
          </p>
        </div>

        <div className="mt-8">
          <div className="inline-flex items-center gap-2 text-white/70">
            <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;