import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Zap,
  Activity,
  Sparkles,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Lightbulb,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiInsightsService, AIInsight, AIInsightsStats } from "@/services/aiInsightsService";

const AIInsights = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [topRecommendations, setTopRecommendations] = useState<AIInsight[]>([]);
  const [stats, setStats] = useState<AIInsightsStats>({
    total_recommendations: 0,
    high_priority: 0,
    medium_priority: 0,
    low_priority: 0,
    completed: 0,
    in_progress: 0,
    pending: 0,
    implementation_rate: 0,
    avg_confidence: 0,
    avg_user_engagement: 0,
    avg_conversion_rate: 0
  });
  const [animatedValues, setAnimatedValues] = useState({
    aiRecommendations: 0,
    userEngagement: 0,
    conversionRate: 0
  });

  // Load data from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recommendationsResponse, statsResponse] = await Promise.all([
        aiInsightsService.getTopRecommendations(5),
        aiInsightsService.getAIInsightsStats()
      ]);

      if (recommendationsResponse.success) {
        setTopRecommendations(recommendationsResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
        // Animate numbers with real data
        animateNumbers(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading AI insights:', error);
      toast({
        title: "Error",
        description: "Failed to load AI insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Animate numbers with real data
  const animateNumbers = (realStats: AIInsightsStats) => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        aiRecommendations: Math.floor(realStats.total_recommendations * progress),
        userEngagement: Math.floor(realStats.avg_user_engagement * progress),
        conversionRate: Math.floor(realStats.avg_conversion_rate * progress * 10) / 10
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues({
          aiRecommendations: realStats.total_recommendations,
          userEngagement: Math.round(realStats.avg_user_engagement),
          conversionRate: realStats.avg_conversion_rate
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  };

  const handleGenerateInsights = async () => {
    try {
      setLoading(true);
      const response = await aiInsightsService.generateAIInsights();
      
      if (response.success) {
        toast({
          title: "AI Insights Generated",
          description: "New AI insights have been generated successfully",
        });
        // Reload data to show new insights
        loadData();
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium Priority</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low Priority</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High Impact":
        return "text-green-600 bg-green-50";
      case "Medium Impact":
        return "text-yellow-600 bg-yellow-50";
      case "Low Impact":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            AI Insights Management
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and manage AI-powered insights and recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow-success animate-pulse-glow">
            <Brain className="w-4 h-4 mr-1" />
            AI Active
          </Badge>
          <Button 
            className="bg-gradient-to-r from-primary to-water-blue hover:shadow-primary shadow-md"
            onClick={handleGenerateInsights}
            disabled={loading}
          >
            <Zap className={`w-4 h-4 mr-2 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Generating...' : 'Generate Insights'}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{animatedValues.aiRecommendations.toLocaleString()}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats?.recommendations_growth_percentage ? `+${stats.recommendations_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{animatedValues.userEngagement}%</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats?.engagement_growth_percentage ? `+${stats.engagement_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{animatedValues.conversionRate}%</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats?.conversion_growth_percentage ? `+${stats.conversion_growth_percentage}%` : '0.0%'} from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced AI Insights Overview */}
      <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            AI Insights Overview
          </CardTitle>
          <CardDescription>View and manage AI-powered insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Enhanced Top Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Top Recommendations
                </h3>
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>Loading recommendations...</span>
                  </div>
                </div>
              ) : topRecommendations.length > 0 ? (
                <div className="space-y-3">
                  {topRecommendations.map((recommendation, index) => (
                    <div 
                      key={recommendation.id}
                      className="p-4 border border-slate-200 rounded-xl bg-gradient-to-r from-white to-slate-50/50 hover:from-slate-50 hover:to-slate-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-water-blue/10 flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{recommendation.title || 'N/A'}</h4>
                              {getPriorityIcon(recommendation.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{recommendation.description || 'No description available'}</p>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getImpactColor(recommendation.impact)}`}
                              >
                                {recommendation.impact || 'N/A'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {recommendation.category || 'N/A'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {getPriorityBadge(recommendation.priority)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">No recommendations available</div>
                </div>
              )}
            </div>

            {/* Enhanced Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.total_recommendations || 0}</div>
                <div className="text-sm text-purple-700">Active Recommendations</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.high_priority || 0}</div>
                <div className="text-sm text-blue-700">High Priority Items</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.implementation_rate || 0}%</div>
                <div className="text-sm text-green-700">Implementation Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights; 