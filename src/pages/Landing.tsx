import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Users, Store, User, Megaphone, ArrowRight } from "lucide-react";

const Landing = () => {
  const [showSnippet, setShowSnippet] = useState(true);
  const [showRoles, setShowRoles] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show snippet for 2 seconds, then show roles
    const timer = setTimeout(() => {
      setShowSnippet(false);
      setShowRoles(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRoleClick = (role: string) => {
    if (role === 'seller' || role === 'influencer' || role === 'user') {
      navigate(`/${role}/register`);
    } else {
      navigate(`/${role}/login`);
    }
  };

  if (showSnippet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Droplets className="w-16 h-16 text-water-blue animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-water-blue to-water-deep bg-clip-text text-transparent">
              ÁGUA TWEZAH
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground max-w-3xl animate-slide-up">
            Digital Loyalty Program Platform
          </p>
          <p className="text-lg text-muted-foreground animate-slide-up-delayed">
            Transforming water consumption into rewarding experiences
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-water-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center space-y-8 mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Droplets className="w-12 h-12 text-water-blue" />
            <h1 className="text-4xl font-bold">ÁGUA TWEZAH</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your role to access the appropriate dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Admin Role */}
          <Card 
            className="group hover:shadow-water cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col h-full"
            onClick={() => handleRoleClick('admin')}
          >
            <CardHeader className="text-center space-y-4 flex-1">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-water-blue to-water-deep rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Admin</CardTitle>
              <CardDescription>
                System administration and management
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button className="w-full group-hover:bg-water-blue group-hover:text-white transition-colors duration-300">
                Access Panel
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>

          {/* Seller Role */}
          <Card 
            className="group hover:shadow-water cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col h-full"
            onClick={() => handleRoleClick('seller')}
          >
            <CardHeader className="text-center space-y-4 flex-1">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-loyalty-gold to-loyalty-lead rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Store className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Seller</CardTitle>
              <CardDescription>
                Store management and sales tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button className="w-full group-hover:bg-loyalty-gold group-hover:text-white transition-colors duration-300">
                Access Panel
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>

          {/* User Role */}
          <Card 
            className="group hover:shadow-water cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col h-full"
            onClick={() => handleRoleClick('user')}
          >
            <CardHeader className="text-center space-y-4 flex-1">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">User</CardTitle>
              <CardDescription>
                Customer portal and loyalty management
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button className="w-full group-hover:bg-success group-hover:text-white transition-colors duration-300">
                Access Panel
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>

          {/* Influencer Role */}
          <Card 
            className="group hover:shadow-water cursor-pointer transition-all duration-300 hover:scale-105 flex flex-col h-full"
            onClick={() => handleRoleClick('influencer')}
          >
            <CardHeader className="text-center space-y-4 flex-1">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-loyalty-platinum to-loyalty-silver rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Megaphone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Influencer</CardTitle>
              <CardDescription>
                Commission tracking and referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button className="w-full group-hover:bg-loyalty-platinum group-hover:text-white transition-colors duration-300">
                Access Panel
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;