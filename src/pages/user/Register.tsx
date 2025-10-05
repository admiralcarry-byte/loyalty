import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usersService } from "@/services/usersService";
import { useLanguageContext } from "@/contexts/LanguageContext";

const UserRegister = () => {
  const { translate } = useLanguageContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    influencerPhone: ""
  });
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInfluencers, setIsLoadingInfluencers] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch influencers on component mount
  useEffect(() => {
    const fetchInfluencers = async () => {
      setIsLoadingInfluencers(true);
      try {
        const response = await usersService.getInfluencers();
        if (response.success && response.data) {
          setInfluencers(response.data);
        } else {
          console.error('Failed to fetch influencers:', response.error);
        }
      } catch (error) {
        console.error('Error fetching influencers:', error);
      } finally {
        setIsLoadingInfluencers(false);
      }
    };

    fetchInfluencers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInfluencerSelect = (value: string) => {
    // Filter out special values that are not actual phone numbers
    if (value === "loading" || value === "no-influencers") {
      return;
    }
    setFormData(prev => ({
      ...prev,
      influencerPhone: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.influencerPhone) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields including selecting an influencer",
          variant: "destructive",
        });
        return;
      }

      // Here you would call your API to register the user
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/users/register-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          influencerPhone: formData.influencerPhone
        }),
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "User account created successfully. Please log in.",
        });
        navigate("/user/login");
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
            <User className="w-8 h-8 text-success" />
          </div>
          <CardTitle className="text-2xl">ÁGUA TWEZAH</CardTitle>
          <CardDescription>User Registration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{translate('full.name')} *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={translate('enter.full.name')}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{translate('email.address')} *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={translate('user.example.com')}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{translate('phone.number')} *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={translate('enter.phone.number')}
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="influencerPhone">{translate('influencer.phone')} *</Label>
              <Select onValueChange={handleInfluencerSelect} value={formData.influencerPhone} required>
                <SelectTrigger>
                  <SelectValue placeholder={translate('select.influencer')} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingInfluencers ? (
                    <SelectItem value="loading" disabled>
                      {translate('loading.influencers')}
                    </SelectItem>
                  ) : influencers.length > 0 ? (
                    influencers.map((influencer) => (
                      <SelectItem key={influencer.id} value={influencer.phone}>
                        {influencer.name} - {influencer.phone}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-influencers" disabled>
                      {translate('no.influencers.available')}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {translate('select.influencer.helper')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{translate('password')} *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={translate('enter.password')}
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

            <Button type="submit" className="w-full bg-success hover:bg-accent" disabled={isLoading}>
              {isLoading ? translate('creating.account') : translate('register')}
            </Button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              {translate('already.have.account')}{" "}
              <Link to="/user/login" className="text-success hover:underline">
                Sign in here
              </Link>
            </div>
            <div className="pt-2">
              <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" />
                {translate('back.to.home')}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegister;