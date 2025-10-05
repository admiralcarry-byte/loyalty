import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLanguageInitialization } from "@/hooks/useLanguageInitialization";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/AdminLayout";
import { SellerLayout } from "./components/SellerLayout";
import { UserLayout } from "./components/UserLayout";
import { InfluencerLayout } from "./components/InfluencerLayout";
import { AdminGuard } from "./components/guards/AdminGuard";
import { SellerGuard } from "./components/guards/SellerGuard";
import { UserGuard } from "./components/guards/UserGuard";
import { InfluencerGuard } from "./components/guards/InfluencerGuard";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Sales from "./pages/admin/Sales";
import Commission from "./pages/admin/Commission";
// import Cashback from "./pages/admin/Cashback";
import Reports from "./pages/admin/Reports";
// import Notifications from "./pages/admin/Notifications";
// import Campaigns from "./pages/admin/Campaigns";
import Stores from "./pages/admin/Stores";
// import AdminWelcome from "./pages/admin/Welcome";
import AdminLogin from "./pages/admin/Login";
import AdminProfile from "./pages/admin/Profile";
import AdminSettings from "./pages/admin/Settings";
// import AIIntegration from "./pages/admin/AIIntegration";
import BillingIntegration from "./pages/admin/BillingIntegration";
import AdminRegister from "./pages/admin/Register";
// import InfluencerLevels from "./pages/admin/InfluencerLevels";
// import LoyaltyLevels from "./pages/admin/LoyaltyLevels";
// import ClientPoints from "./pages/admin/ClientPoints";
// import PurchaseHistory from "./pages/admin/PurchaseHistory";
// import NetworkSwitching from "./pages/admin/NetworkSwitching";
// import PurchaseEntry from "./pages/admin/PurchaseEntry";
// import BankDetails from "./pages/admin/BankDetails";
// import CommissionRequest from "./pages/admin/CommissionRequest";
// import OnlinePurchases from "./pages/admin/OnlinePurchases";
// import WalletIntegration from "./pages/admin/WalletIntegration";
// import ReceiptUpload from "./pages/admin/ReceiptUpload";
// import ScanUploads from "./pages/admin/ScanUploads";
// import ExternalInvoices from "./pages/admin/ExternalInvoices";
// import UnifiedBillingHistory from "./pages/admin/UnifiedBillingHistory";
// import ReconciliationDashboard from "./pages/admin/ReconciliationDashboard";

// Seller pages
import SellerLogin from "./pages/seller/Login";
import SellerRegister from "./pages/seller/Register";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerBilling from "./pages/seller/Billing";

// User pages
import UserLogin from "./pages/user/Login";
import UserRegister from "./pages/user/Register";
import UserDashboard from "./pages/user/Dashboard";
import MyInfluencer from "./pages/user/MyInfluencer";
import MyLevel from "./pages/user/MyLevel";

// Influencer pages
import InfluencerLogin from "./pages/influencer/Login";
import InfluencerRegister from "./pages/influencer/Register";
import InfluencerUsers from "./pages/influencer/Users";
import InfluencerStatistics from "./pages/influencer/Statistics";



const queryClient = new QueryClient();

const App = () => {
  const { isInitialized, isLoading } = useLanguageInitialization();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
          <Route path="/admin/users" element={<AdminGuard><AdminLayout><Users /></AdminLayout></AdminGuard>} />
          <Route path="/admin/sales" element={<AdminGuard><AdminLayout><Sales /></AdminLayout></AdminGuard>} />
          <Route path="/admin/commission" element={<AdminGuard><AdminLayout><Commission /></AdminLayout></AdminGuard>} />
          <Route path="/admin/reports" element={<AdminGuard><AdminLayout><Reports /></AdminLayout></AdminGuard>} />
          <Route path="/admin/stores" element={<AdminGuard><AdminLayout><Stores /></AdminLayout></AdminGuard>} />
          <Route path="/admin/profile" element={<AdminGuard><AdminLayout><AdminProfile /></AdminLayout></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><AdminLayout><AdminSettings /></AdminLayout></AdminGuard>} />
          <Route path="/admin/billing-integration" element={<AdminGuard><AdminLayout><BillingIntegration /></AdminLayout></AdminGuard>} />
          <Route path="/admin/influencer-levels" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/loyalty-levels" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/qr-analysis" element={<Navigate to="/admin/billing-integration" replace />} />

          {/* Seller Routes */}
          <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/dashboard" element={<SellerGuard><SellerLayout><SellerDashboard /></SellerLayout></SellerGuard>} />
          <Route path="/seller/billing" element={<SellerGuard><SellerLayout><SellerBilling /></SellerLayout></SellerGuard>} />

          {/* User Routes */}
          <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/dashboard" element={<UserGuard><UserLayout><UserDashboard /></UserLayout></UserGuard>} />
          <Route path="/user/my-level" element={<UserGuard><UserLayout><MyLevel /></UserLayout></UserGuard>} />
          <Route path="/user/my-influencer" element={<UserGuard><UserLayout><MyInfluencer /></UserLayout></UserGuard>} />

        {/* Influencer Routes */}
        <Route path="/influencer" element={<Navigate to="/influencer/users" replace />} />
        <Route path="/influencer/register" element={<InfluencerRegister />} />
        <Route path="/influencer/login" element={<InfluencerLogin />} />
        <Route path="/influencer/users" element={<InfluencerGuard><InfluencerLayout><InfluencerUsers /></InfluencerLayout></InfluencerGuard>} />
        <Route path="/influencer/statistics" element={<InfluencerGuard><InfluencerLayout><InfluencerStatistics /></InfluencerLayout></InfluencerGuard>} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
