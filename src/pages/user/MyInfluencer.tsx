import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone,
  Users,
  Phone,
  Star,
  TrendingUp,
  Award
} from "lucide-react";
import { authService, User as UserType } from "@/services/authService";
import { usersService } from "@/services/usersService";

interface InfluencerData {
  _id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  loyalty_tier: string;
  total_liters: number;
  referred_users_count: number;
  status: string;
  created_at: string;
}

const MyInfluencer = () => {
  const [influencer, setInfluencer] = useState<InfluencerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  // Fetch user data and influencer information
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user from localStorage
        const currentUser = authService.getUser();
        if (!currentUser) {
          setError('User not found. Please log in again.');
          return;
        }

        setUser(currentUser);

        // Check if user has referred_by_phone (influencer phone number)
        if (!currentUser.referred_by_phone) {
          setError('No influencer associated with this account.');
          return;
        }

        // Fetch influencer data by phone number
        const response = await usersService.getInfluencerByPhone(currentUser.referred_by_phone);
        
        if (response.success && response.data) {
          setInfluencer(response.data);
        } else {
          setError('Influencer not found or error fetching data.');
        }

      } catch (err: any) {
        console.error('Error fetching influencer data:', err);
        setError(err.message || 'Failed to load influencer information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum": return <Award className="w-5 h-5 text-purple-600" />;
      case "gold": return <Star className="w-5 h-5 text-yellow-500" />;
      case "silver": return <TrendingUp className="w-5 h-5 text-gray-500" />;
      default: return <Users className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum": return "default";
      case "gold": return "secondary";
      case "silver": return "outline";
      default: return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              My Influencer
            </h1>
            <p className="text-muted-foreground mt-1">Information about your referral influencer</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading influencer information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              My Influencer
            </h1>
            <p className="text-muted-foreground mt-1">Information about your referral influencer</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Influencer Found</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              My Influencer
            </h1>
            <p className="text-muted-foreground mt-1">Information about your referral influencer</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Influencer Data</h3>
              <p className="text-muted-foreground">Unable to load influencer information at this time.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            My Influencer
          </h1>
          <p className="text-muted-foreground mt-1">Information about your referral influencer</p>
        </div>
      </div>

      {/* Influencer Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-loyalty-platinum" />
            Influencer Details
          </CardTitle>
          <CardDescription>
            Your referral influencer's information and network statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-lg font-semibold">
                    {influencer.first_name} {influencer.last_name}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-lg">{influencer.phone}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{influencer.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loyalty Tier</label>
                <div className="flex items-center gap-2 mt-1">
                  {getTierIcon(influencer.loyalty_tier)}
                  <Badge variant={getTierBadgeVariant(influencer.loyalty_tier)}>
                    {influencer.loyalty_tier?.charAt(0).toUpperCase() + influencer.loyalty_tier?.slice(1) || 'Lead'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(influencer.status)}>
                    {influencer.status?.charAt(0).toUpperCase() + influencer.status?.slice(1) || 'Unknown'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <div className="mt-1">
                  <span className="text-lg">
                    {new Date(influencer.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Network Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Total Referred Users</p>
                      <p className="text-2xl font-bold text-blue-700">{influencer.referred_users_count || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Total Liters Consumed</p>
                      <p className="text-2xl font-bold text-green-700">{influencer.total_liters?.toFixed(1) || 0}L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-blue-900">About Your Influencer</div>
              <div className="text-blue-700 mt-1">
                This influencer referred you to ÁGUA TWEZAH. They earn commissions based on your purchases and the purchases of other users they refer.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyInfluencer;