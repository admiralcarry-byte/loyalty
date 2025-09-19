import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLanguageInitialization } from "@/hooks/useLanguageInitialization";
// import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/AdminLayout";
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



const queryClient = new QueryClient();

const App = () => {
  const { isInitialized, isLoading } = useLanguageInitialization();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          {/* //const{<Route path="/admin-welcome" element={<AdminWelcome />} />} */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
          <Route path="/admin/sales" element={<AdminLayout><Sales /></AdminLayout>} />
          <Route path="/admin/commission" element={<AdminLayout><Commission /></AdminLayout>} />
          {/* //const{<Route path="/admin/cashback" element={<AdminLayout><Cashback /></AdminLayout>} />} */}
          <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
          {/* //const{<Route path="/admin/notifications" element={<AdminLayout><Notifications /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/campaigns" element={<AdminLayout><Campaigns /></AdminLayout>} />} */}
          <Route path="/admin/stores" element={<AdminLayout><Stores /></AdminLayout>} />
          <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          {/* //const{<Route path="/admin/ai-integration" element={<AdminLayout><AIIntegration /></AdminLayout>} />} */}
          <Route path="/admin/billing-integration" element={<AdminLayout><BillingIntegration /></AdminLayout>} />
          {/* <Route path="/admin/influencer-levels" element={<AdminLayout><InfluencerLevels /></AdminLayout>} /> */}
          {/* <Route path="/admin/loyalty-levels" element={<AdminLayout><LoyaltyLevels /></AdminLayout>} /> */}
          <Route path="/admin/influencer-levels" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/loyalty-levels" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/qr-analysis" element={<Navigate to="/admin/billing-integration" replace />} />
          {/* //const{<Route path="/admin/client-points" element={<AdminLayout><ClientPoints /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/purchase-history" element={<AdminLayout><PurchaseHistory /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/network-switching" element={<AdminLayout><NetworkSwitching /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/purchase-entry" element={<AdminLayout><PurchaseEntry /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/bank-details" element={<AdminLayout><BankDetails /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/commission-request" element={<AdminLayout><CommissionRequest /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/online-purchases" element={<AdminLayout><OnlinePurchases /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/wallet-integration" element={<AdminLayout><WalletIntegration /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/receipt-upload" element={<AdminLayout><ReceiptUpload /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/scan-uploads" element={<AdminLayout><ScanUploads /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/external-invoices" element={<AdminLayout><ExternalInvoices /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/unified-billing-history" element={<AdminLayout><UnifiedBillingHistory /></AdminLayout>} />} */}
          {/* //const{<Route path="/admin/reconciliation-dashboard" element={<AdminLayout><ReconciliationDashboard /></AdminLayout>} />} */}

          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
