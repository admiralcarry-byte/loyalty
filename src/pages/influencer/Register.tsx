import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Megaphone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InfluencerRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Here you would call your API to register the influencer
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/users/register-influencer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'influencer'
        }),
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Influencer account created successfully. Please log in.",
        });
        navigate("/influencer/login");
      } else {
        const errorData = await response.json();
        toast({
          title: "Registration Failed",
          description: errorData.message || "An error occurred during registration",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
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
          <CardDescription>Influencer Registration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="influencer@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+244 123 456 789"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
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
              {isLoading ? "Creating Account..." : "Register"}
            </Button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/influencer/login" className="text-loyalty-platinum hover:underline">
                Sign in here
              </Link>
            </div>
            <div className="pt-2">
              <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerRegister;