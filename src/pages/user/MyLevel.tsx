import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy,
  Target,
  Droplets,
  Star,
  Award,
  TrendingUp,
  Gift,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { usersService } from "@/services/usersService";

interface LevelData {
  user: {
    first_name: string;
    last_name: string;
    total_liters: number;
    total_purchases: number;
    points_balance: number;
  };
  currentLevel: {
    name: string;
    tier: string;
    level_number: number;
    description: string;
    color?: string;
    icon?: string;
    requirements: {
      minimum_liters: number;
      minimum_points?: number;
      minimum_purchases?: number;
      minimum_spend?: number;
    };
    benefits: {
      points_multiplier?: number;
      discount_percentage?: number;
      cashback_rate?: number;
      free_delivery?: boolean;
      priority_support?: boolean;
    };
  };
  nextLevel: {
    name: string;
    tier: string;
    level_number: number;
    description: string;
    requirements: {
      minimum_liters: number;
      minimum_points?: number;
      minimum_purchases?: number;
      minimum_spend?: number;
    };
    benefits: {
      points_multiplier?: number;
      discount_percentage?: number;
      cashback_rate?: number;
      free_delivery?: boolean;
      priority_support?: boolean;
    };
  } | null;
  progress: {
    currentLiters: number;
    targetLiters: number;
    litersCompleted: number;
    litersRemaining: number;
    progressPercentage: number;
    isMaxLevel: boolean;
  };
}

const MyLevel = () => {
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await usersService.getMyLevelProgress();
        
        if (response.success && response.data) {
          setLevelData(response.data);
        } else {
          setError(response.error || 'Failed to load level information');
        }

      } catch (err: any) {
        console.error('Error fetching level data:', err);
        setError(err.message || 'Failed to load level information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevelData();
  }, []);

  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum": return <Award className="w-8 h-8 text-purple-600" />;
      case "gold": return <Star className="w-8 h-8 text-yellow-500" />;
      case "silver": return <TrendingUp className="w-8 h-8 text-gray-500" />;
      default: return <Trophy className="w-8 h-8 text-blue-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum": return "from-purple-500 to-purple-700";
      case "gold": return "from-yellow-500 to-yellow-700";
      case "silver": return "from-gray-400 to-gray-600";
      default: return "from-blue-500 to-blue-700";
    }
  };

  const getTierBgColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum": return "from-purple-50 to-purple-100";
      case "gold": return "from-yellow-50 to-yellow-100";
      case "silver": return "from-gray-50 to-gray-100";
      default: return "from-blue-50 to-blue-100";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              My Level
            </h1>
            <p className="text-muted-foreground mt-1">Track your loyalty level progress</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading level information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !levelData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              My Level
            </h1>
            <p className="text-muted-foreground mt-1">Track your loyalty level progress</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Level Data</h3>
              <p className="text-muted-foreground">{error || 'Please try again later'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, currentLevel, nextLevel, progress } = levelData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            My Level
          </h1>
          <p className="text-muted-foreground mt-1">Track your loyalty level progress</p>
        </div>
      </div>

      {/* Current Level Card */}
      <Card className={`shadow-lg bg-gradient-to-br ${getTierBgColor(currentLevel.tier)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 bg-gradient-to-br ${getTierColor(currentLevel.tier)} rounded-xl`}>
                {getTierIcon(currentLevel.tier)}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {currentLevel.name} Level
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {currentLevel.description}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Level {currentLevel.level_number}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Total Liters</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.total_liters.toFixed(1)}L</p>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Total Purchases</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('pt-AO', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(user.total_purchases) + ' Kz'}</p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Progress to Next Level */}
      {!progress.isMaxLevel && nextLevel ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Progress to {nextLevel.name} Level
            </CardTitle>
            <CardDescription>
              Keep purchasing to unlock the next level and its benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {progress.currentLiters.toFixed(1)}L of {progress.targetLiters}L
                </span>
                <span className="text-sm font-bold text-primary">
                  {progress.progressPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={progress.progressPercentage} className="h-3" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 font-medium">
                  ✓ Completed: {progress.litersCompleted.toFixed(1)}L
                </span>
                <span className="text-orange-600 font-medium">
                  Remaining: {progress.litersRemaining.toFixed(1)}L
                </span>
              </div>
            </div>

            {/* Next Level Info */}
            <div className={`bg-gradient-to-br ${getTierBgColor(nextLevel.tier)} rounded-lg p-4 border-2 border-dashed border-gray-300`}>
              <div className="flex items-center gap-3 mb-3">
                {getTierIcon(nextLevel.tier)}
                <div>
                  <h3 className="font-bold text-lg">{nextLevel.name} Level</h3>
                  <p className="text-sm text-gray-600">{nextLevel.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Requirements:</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span>Minimum: {nextLevel.requirements.minimum_liters}L</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="font-semibold text-sm text-gray-700">Unlock Benefits:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* {nextLevel.benefits.points_multiplier && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span>{nextLevel.benefits.points_multiplier}x Points</span>
                    </div>
                  )} */}
                  {nextLevel.benefits.discount_percentage && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span>{nextLevel.benefits.discount_percentage}% Discount</span>
                    </div>
                  )}
                  {nextLevel.benefits.cashback_rate && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>{nextLevel.benefits.cashback_rate}% Cashback</span>
                    </div>
                  )}
                  {nextLevel.benefits.free_delivery && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Free Delivery</span>
                    </div>
                  )}
                  {nextLevel.benefits.priority_support && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Priority Support</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="py-8">
            <div className="text-center">
              {/* Modern Sparkles Icon with Gradient and Animation */}
              <div className="relative mx-auto mb-6 w-fit">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative z-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
                  <Sparkles className="w-16 h-16 text-white animate-bounce" />
                </div>
                {/* Floating sparkle effects */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1 -left-2 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
              
              <h3 className="text-2xl font-bold text-purple-900 mb-2 flex items-center justify-center gap-2">
                Congratulations! 
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm opacity-60"></div>
                  <Sparkles className="w-6 h-6 text-yellow-500 relative z-10 animate-pulse" />
                </div>
              </h3>
              <p className="text-lg text-purple-700">
                You've reached the maximum loyalty level!
              </p>
              <p className="text-sm text-purple-600 mt-2">
                Continue purchasing to enjoy all the premium benefits.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyLevel;
