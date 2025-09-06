import { useState, useEffect } from "react";
import { notificationsService, Notification } from "@/services/notificationsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Send, 
  Bell, 
  Users, 
  Calendar,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  PartyPopper,
  Trophy,
  Heart,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    audience: "",
    type: "general"
  });
  const { toast } = useToast();

  // State for notifications data
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications data
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await notificationsService.getNotifications();
      
      if (response.success) {
        setNotifications(response.data);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);


  const handleSendNotification = () => {
    if (!notification.title || !notification.message || !notification.audience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to send the notification",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Notification Sent Successfully!",
      description: `Your notification has been sent to ${notification.audience} recipients`,
      variant: "success",
    });

    setNotification({
      title: "",
      message: "",
      audience: "",
      type: "general"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      case "promotion":
        return <PartyPopper className="w-4 h-4 text-purple-600" />;
      case "referral":
        return <Heart className="w-4 h-4 text-pink-600" />;
      case "reward":
        return <Gift className="w-4 h-4 text-green-600" />;
      case "reminder":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="default">Sent</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">Send push notifications and manage communication with users</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">Send push notifications and manage communication with users</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">Failed to load notifications</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchNotifications} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">Send push notifications and manage communication with users</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary animate-pulse-glow">
            <Bell className="w-4 h-4 mr-1" />
            Active System
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Send New Notification
            </CardTitle>
            <CardDescription>Create and send push notifications to users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                value={notification.title}
                onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your notification message..."
                rows={4}
                value={notification.message}
                onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select value={notification.audience} onValueChange={(value) => setNotification(prev => ({ ...prev, audience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="users">Customers Only</SelectItem>
                  <SelectItem value="influencers">Influencers Only</SelectItem>
                  <SelectItem value="lead">Lead Tier</SelectItem>
                  <SelectItem value="silver">Silver Tier</SelectItem>
                  <SelectItem value="gold">Gold Tier</SelectItem>
                  <SelectItem value="platinum">Platinum Tier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select value={notification.type} onValueChange={(value) => setNotification(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="reward">Reward</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="promotion">Level Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSendNotification} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Users</span>
                </div>
                <span className="font-bold">2,845</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Notifications Sent Today</span>
                </div>
                <span className="font-bold">12</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">Delivery Rate</span>
                </div>
                <span className="font-bold text-success">98.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Daily Goal Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Weekly Progress Update
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                New Feature Announcement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Notification History */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Notification History
          </CardTitle>
          <CardDescription>Recent notifications sent to users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Message</TableHead>
                <TableHead className="font-semibold">Audience</TableHead>
                <TableHead className="font-semibold">Recipients</TableHead>
                <TableHead className="font-semibold">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading notifications...</p>
                  </TableCell>
                </TableRow>
              ) : notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-center">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No notifications found</p>
                      <p className="text-sm text-muted-foreground">Send your first notification to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notif, index) => (
                  <TableRow 
                    key={notif.id}
                    className={`${
                      index % 2 === 0 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200' 
                        : 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200'
                    } transition-colors duration-200`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(notif.status)}
                        {getStatusBadge(notif.status)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        {getNotificationTypeIcon(notif.type)}
                        {notif.title}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-700">{notif.message}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-white border-blue-300 text-blue-700">
                        {notif.audience}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800">{notif.recipients || 0}</TableCell>
                    <TableCell className="text-gray-600">{new Date(notif.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;