import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Droplets, Users, BarChart3, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Droplets className="w-12 h-12 text-water-blue" />
            <h1 className="text-4xl font-bold">ÁGUA TWEZAH</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Digital Loyalty Program Admin Portal
          </p>
          <p className="text-muted-foreground">
            Manage your water loyalty program, track sales, and reward customers
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link to="/admin">
            <Button size="lg" className="gap-2">
              <BarChart3 className="w-5 h-5" />
              Access Admin Panel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
