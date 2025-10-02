import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Eye, EyeOff, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

const InfluencerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        // Check if user has influencer role
        if (response.data.user.role !== 'influencer') {
          toast({
            title: "Access Denied",
            description: "Only influencers can access the influencer portal",
            variant: "destructive",
          });
          return;
        }

        // Store authentication data
        authService.setAuthData(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );

        toast({
          title: "Login Successful",
          description: "Welcome to ÁGUA TWEZAH Influencer Portal",
        });
        navigate("/influencer/users");
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Droplets className="w-10 h-10 text-water-blue" />
            <Megaphone className="w-8 h-8 text-loyalty-platinum" />
          </div>
          <CardTitle className="text-2xl">ÁGUA TWEZAH</CardTitle>
          <CardDescription>Influencer Portal Login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="influencer@example.com"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-loyalty-platinum hover:bg-loyalty-silver" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/influencer/register" className="text-loyalty-platinum hover:underline">
                Register here
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerLogin;