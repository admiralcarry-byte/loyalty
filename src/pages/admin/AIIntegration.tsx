import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  MessageSquare,
  FileText,
  Wand2,
  Sparkles,
  Brain,
  Lightbulb,
  Target,
  Users,
  TrendingUp,
  Globe,
  Copy,
  RefreshCw,
  Send,
  Bot,
  Star,
  Crown,
  Medal,
  Gem,
  PartyPopper,
  Droplets,
  Heart,
  Handshake,
  Sun,
  Beach,
  Gift,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiInsightsService, AIInsightsStats } from "@/services/aiInsightsService";

const AIIntegration = () => {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedCampaignType, setSelectedCampaignType] = useState("promotional");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [faqTopic, setFaqTopic] = useState("");
  const [generatedFAQ, setGeneratedFAQ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiStats, setAiStats] = useState<AIInsightsStats>({
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

  // Load AI stats on component mount
  useEffect(() => {
    loadAIStats();
  }, []);

  const loadAIStats = async () => {
    try {
      setLoading(true);
      const response = await aiInsightsService.getAIInsightsStats();
      
      if (response.success) {
        setAiStats(response.data);
      }
    } catch (error) {
      console.error('Error loading AI stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePromotionalText = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const promotionalTexts = {
        all: "Stay hydrated with ÁGUA TWEZAH! Premium water delivery with exclusive rewards. Join thousands of satisfied customers today! #HydrationGoals #ÁguaTwezah",
        new: "Welcome to ÁGUA TWEZAH! Start your hydration journey with us and earn rewards from your very first purchase. Pure water, pure rewards!",
        active: "Our valued customers! Keep enjoying premium water and exclusive rewards. Your loyalty brings you closer to amazing benefits!",
        influencers: "Build your network with ÁGUA TWEZAH! Help others discover quality water and earn rewards for every referral. Grow together!"
      };

      const campaignTexts = {
        promotional: "Special Offer Alert! Get 20% extra cashback on your next ÁGUA TWEZAH order. Limited time only - Pure hydration, pure savings!",
        seasonal: "Summer Hydration Challenge! Beat the heat with ÁGUA TWEZAH. Double rewards all season long. Stay cool, stay hydrated!",
        loyalty: "Celebrating Our Amazing Customers! Special loyalty bonus for all ÁGUA TWEZAH family members. Your trust, our commitment!",
        referral: "Share the Love! Refer friends to ÁGUA TWEZAH and earn incredible bonuses. Pure water for everyone!"
      };

      let text = "";
      if (selectedTier !== "all") {
        text = promotionalTexts[selectedTier];
      } else {
        text = campaignTexts[selectedCampaignType];
      }

      setGeneratedContent(text);
      setIsGenerating(false);
      
      toast({
        title: "Content Generated Successfully!",
        description: "Your AI-powered promotional content is ready to use",
        variant: "success",
      });
    }, 2000);
  };

  const generateSmartFAQ = async () => {
    if (!faqTopic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate helpful FAQ content",
        variant: "warning",
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const faqData = {
        "water quality": [
          {
            q: "What makes ÁGUA TWEZAH water different from regular tap water?",
            a: "ÁGUA TWEZAH undergoes advanced purification processes including reverse osmosis, UV sterilization, and mineral enhancement to ensure the highest quality and taste."
          },
          {
            q: "Is ÁGUA TWEZAH water safe for children and pregnant women?",
            a: "Absolutely! Our water meets all international safety standards and is specifically tested to be safe for all age groups, including infants and expecting mothers."
          },
          {
            q: "How often is the water quality tested?",
            a: "We conduct quality tests every 2 hours at our facilities and perform comprehensive laboratory analysis weekly to ensure consistent excellence."
          }
        ],
        "delivery": [
          {
            q: "What are your delivery hours?",
            a: "We deliver Monday through Saturday from 7 AM to 8 PM. Sunday deliveries are available for emergency orders with a small additional fee."
          },
          {
            q: "How fast can I get my water delivered?",
            a: "Standard delivery within Luanda is 2-4 hours. Express delivery (within 1 hour) is available for a small additional charge."
          },
          {
            q: "Do you deliver to all areas in Angola?",
            a: "We currently serve Luanda, Benguela, Huambo, and Lobito. We're rapidly expanding to cover more cities across Angola."
          }
        ],
        "loyalty program": [
          {
            q: "How does the loyalty program work?",
            a: "Earn points with every purchase! Lead tier starts immediately, Silver at 50L, Gold at 150L, and Platinum at 300L. Higher tiers get better cashback rates."
          },
          {
            q: "When do I receive my cashback rewards?",
            a: "Cashback is credited to your account immediately after each verified purchase and can be used on your next order or withdrawn monthly."
          },
          {
            q: "Can I refer friends to earn more rewards?",
            a: "Yes! Refer friends and earn 10% of their first purchase as bonus cashback. There's no limit to how many friends you can refer."
          }
        ]
      };

      const topic = faqTopic.toLowerCase();
      let faqs = [];
      
      if (topic.includes("water") || topic.includes("quality")) {
        faqs = faqData["water quality"];
      } else if (topic.includes("delivery") || topic.includes("shipping")) {
        faqs = faqData["delivery"];
      } else if (topic.includes("loyalty") || topic.includes("reward") || topic.includes("cashback")) {
        faqs = faqData["loyalty program"];
      } else {
        faqs = [
          {
            q: `What should I know about ${faqTopic}?`,
            a: `Our team is dedicated to providing excellent service regarding ${faqTopic}. For specific questions, please contact our customer support team who will be happy to provide detailed information tailored to your needs.`
          },
          {
            q: `How can ÁGUA TWEZAH help with ${faqTopic}?`,
            a: `We understand the importance of ${faqTopic} to our customers. Our experienced team works continuously to ensure we meet and exceed expectations in this area.`
          }
        ];
      }

      setGeneratedFAQ(faqs);
      setIsGenerating(false);
      
      toast({
        title: "Smart FAQ Generated!",
        description: `Successfully created ${faqs.length} helpful FAQ items for "${faqTopic}"`,
        variant: "success",
      });
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard!",
      description: "Content has been copied and is ready to paste",
      variant: "info",
    });
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "platinum": return <Crown className="w-4 h-4 text-loyalty-platinum" />;
      case "gold": return <Medal className="w-4 h-4 text-loyalty-gold" />;
      case "silver": return <Gem className="w-4 h-4 text-loyalty-silver" />;
      default: return <Star className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-accent/10 border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            AI Integration
          </h1>
          <p className="text-muted-foreground mt-1">Generate promotional content and smart FAQs powered by AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg animate-pulse-glow">
            <Zap className="w-4 h-4 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      {/* AI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-accent/5 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-accent/80">
              <Brain className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{aiStats.total_recommendations || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {aiStats?.recommendations_growth_percentage ? `+${aiStats.recommendations_growth_percentage}%` : '0.0%'} this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-primary/5 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Created</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{aiStats.completed || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>Promotional texts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-water-light/20 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart FAQs</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-water-blue to-water-deep">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water-blue">{aiStats.in_progress || 0}</div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>FAQ sets generated</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-success/10 border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Boost</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-success/80">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+{Math.round(aiStats.avg_user_engagement || 0)}%</div>
            <div className="flex items-center text-xs text-success font-medium">
              <span>AI content performance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="promotional" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="promotional">Promotional Content</TabsTrigger>
          <TabsTrigger value="faq">Smart FAQ Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="promotional" className="space-y-6">
          <Card className="bg-gradient-to-br from-card to-accent/5 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-accent" />
                AI Promotional Text Generator
              </CardTitle>
              <CardDescription>
                Generate engaging promotional content tailored to specific customer tiers and campaign types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Target Audience
                    </Label>
                    <Select value={selectedTier} onValueChange={setSelectedTier}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            All Customers
                          </div>
                        </SelectItem>
                        <SelectItem value="new">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            New Customers
                          </div>
                        </SelectItem>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Active Customers
                          </div>
                        </SelectItem>
                        <SelectItem value="influencers">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Influencers
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      Campaign Type
                    </Label>
                    <Select value={selectedCampaignType} onValueChange={setSelectedCampaignType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotional">
                          <div className="flex items-center gap-2">
                            <PartyPopper className="w-4 h-4" />
                            Promotional Offer
                          </div>
                        </SelectItem>
                        <SelectItem value="seasonal">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Seasonal Campaign
                          </div>
                        </SelectItem>
                        <SelectItem value="loyalty">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Loyalty Program
                          </div>
                        </SelectItem>
                        <SelectItem value="referral">
                          <div className="flex items-center gap-2">
                            <Handshake className="w-4 h-4" />
                            Referral Campaign
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generatePromotionalText}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-accent to-primary hover:shadow-lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    {selectedCampaignType === "promotional" && <PartyPopper className="w-4 h-4 text-purple-600" />}
                    {selectedCampaignType === "seasonal" && <Sun className="w-4 h-4 text-yellow-600" />}
                    {selectedCampaignType === "loyalty" && <Heart className="w-4 h-4 text-pink-600" />}
                    {selectedCampaignType === "referral" && <Handshake className="w-4 h-4 text-blue-600" />}
                    Generated Content
                  </Label>
                  <div className="relative">
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      placeholder="Your AI-generated promotional content will appear here..."
                      className="min-h-[200px] pr-12 bg-gradient-to-br from-muted/50 to-accent/5"
                    />
                    {generatedContent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatedContent)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Send to Campaign
                      </Button>
                      <Button variant="outline" size="sm">
                        <Globe className="w-4 h-4 mr-2" />
                        Schedule Post
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card className="bg-gradient-to-br from-card to-primary/5 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Smart FAQ Generator
              </CardTitle>
              <CardDescription>
                Generate comprehensive FAQ sections automatically based on topics and customer needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="faqTopic">FAQ Topic</Label>
                  <Input
                    id="faqTopic"
                    value={faqTopic}
                    onChange={(e) => setFaqTopic(e.target.value)}
                    placeholder="Enter topic (e.g., water quality, delivery, loyalty program)"
                    className="bg-gradient-to-r from-muted/50 to-primary/5"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={generateSmartFAQ}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-primary to-water-blue hover:shadow-lg"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Generate FAQ
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {generatedFAQ.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Generated FAQ</h3>
                    <Badge variant="secondary">{generatedFAQ.length} questions</Badge>
                  </div>
                  <div className="space-y-3">
                    {generatedFAQ.map((faq, index) => (
                      <Card key={index} className="bg-gradient-to-r from-muted/30 to-water-mist/30 border border-border/50">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-foreground">{faq.q}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(`Q: ${faq.q}\nA: ${faq.a}`)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline">
                      <Send className="w-4 h-4 mr-2" />
                      Add to Website
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Export FAQ
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIIntegration;