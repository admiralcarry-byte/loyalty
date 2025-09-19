import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Upload,
  QrCode,
  Download,
  User,
  Phone,
  Mail,
  ShoppingCart,
  DollarSign,
  Building,
  TestTube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface InvoiceFormData {
  purchaserName: string;
  phoneNumber: string;
  email: string;
  litersPurchased: number;
  amount: number;
  storeNumber: string;
}

interface ReceiptAnalysisData {
  ocrData: {
    extractedData: {
      purchaserName: string;
      phoneNumber: string;
      email: string;
      litersPurchased: number;
      amount: number;
      storeNumber: string;
      invoiceNumber: string;
      date: string;
      paymentMethod: string;
    };
    confidence: number;
    rawText: string;
    technique: string;
    extractionMethod: string;
    processingTime: number;
  };
  qrData: {
    extractedFields: {
      receiptId: string;
      storeNumber: string;
      amount: number;
      date: string;
      verificationCode: string;
      customerName: string;
      transactionId: string;
      rawData: string;
    };
    success: boolean;
    confidence: number;
    extractionMethod: string;
    error: string;
  };
}

const BillingIntegration = () => {
  const { toast } = useToast();
  
  // Invoice Generation States
  const [invoiceFormData, setInvoiceFormData] = useState<InvoiceFormData>({
    purchaserName: '',
    phoneNumber: '',
    email: '',
    litersPurchased: 0,
    amount: 0,
    storeNumber: ''
  });
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);

  // Receipt Upload States
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isAnalyzingReceipt, setIsAnalyzingReceipt] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptAnalysis, setReceiptAnalysis] = useState<ReceiptAnalysisData | null>(null);
  const [isTestingReceipt, setIsTestingReceipt] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Store data state
  const [availableStores, setAvailableStores] = useState<any[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);

  // Fetch available stores (only active stores for invoice generation)
  const fetchAvailableStores = async () => {
    setIsLoadingStores(true);
    try {
      const response = await makeAuthenticatedRequest('/stores?status=active');
      if (response.success && response.data) {
        setAvailableStores(response.data);
      } else {
        // Clear stores if API returns unsuccessful response
        setAvailableStores([]);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      // Clear stores on error to prevent showing stale data
      setAvailableStores([]);
    } finally {
      setIsLoadingStores(false);
    }
  };

  // Auto-login function
  const autoLogin = async () => {
    try {
      const response = await authService.login({
        email: 'admin@aguatwezah.com',
        password: 'admin123'
      });
      
      if (response.success) {
        authService.setAuthData(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        
        setIsAuthenticated(true);
        toast({
          title: "Auto-login Successful",
          description: "Logged in as admin user",
        });
      } else {
        toast({
          title: "Authentication Required",
          description: "Please log in to use billing features",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: "Please log in to use billing features",
        variant: "destructive"
      });
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
      fetchAvailableStores();
    } else {
      autoLogin();
    }
  }, []);

  // Fetch stores when authenticated
  useEffect(() => {
    if (isAuthenticated && authService.isAuthenticated()) {
      fetchAvailableStores();
    } else if (!isAuthenticated) {
      // Clear stores when not authenticated
      setAvailableStores([]);
    }
  }, [isAuthenticated]);

  // Helper function for authenticated API requests
  const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  };

  // Invoice Generation Functions
  const handleInvoiceFormChange = (field: keyof InvoiceFormData, value: string | number) => {
    // Filter out disabled option values
    if (value === 'loading' || value === 'no-stores') {
      return;
    }
    setInvoiceFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateInvoice = async () => {
    // Validate required fields
    if (!invoiceFormData.purchaserName || !invoiceFormData.litersPurchased || !invoiceFormData.amount) {
      toast({
        title: "Validation Error",
        description: "Name, liters purchased, and amount are required fields",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingInvoice(true);
    try {
      // Generate QR code data (store number hash)
      const storeNumberHash = btoa(invoiceFormData.storeNumber || 'default-store');
      
      // Create invoice data with full datetime
      const now = new Date();
      const invoiceData = {
        ...invoiceFormData,
        dateGenerated: now.toISOString(),
        dateGeneratedFormatted: now.toLocaleDateString('en-GB') + ' - ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        storeNumberHash,
        qrCodeData: storeNumberHash
      };

      // Store in database (API call)
      const result = await makeAuthenticatedRequest('/billing/create-invoice', {
        method: 'POST',
        body: JSON.stringify(invoiceData)
      });

      setGeneratedInvoice(result.data);
      
      // Download invoice
      await downloadInvoice(result.data);
      
        toast({
        title: "Invoice Generated",
        description: "Invoice has been generated and downloaded successfully",
      });
      
      // Reset form and close dialog
      setInvoiceFormData({
        purchaserName: '',
        phoneNumber: '',
        email: '',
        litersPurchased: 0,
        amount: 0,
        storeNumber: ''
      });
      setIsInvoiceDialogOpen(false);
      setSelectedStore(null);
    } catch (error) {
      toast({
        title: "Invoice Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const downloadInvoice = async (invoiceData: any) => {
    // Check if we have an image file from the backend
    if (invoiceData.imageFile && invoiceData.imageFile.filePath) {
      try {
        const token = authService.getToken();
        
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }
        
        // Fetch the image file from the backend with authentication
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/billing/download-invoice/${invoiceData.imageFile.filename}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = invoiceData.imageFile.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          return;
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Download failed' }));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error downloading image file:', error);
        toast({
          title: "Download Failed",
          description: error instanceof Error ? error.message : "Failed to download invoice. Please try again.",
          variant: "destructive"
        });
      }
    }
    
    // Fallback: Create a simple invoice HTML if image download fails
    const qrCodeImg = invoiceData.qrCode?.dataURL 
      ? `<img src="${invoiceData.qrCode.dataURL}" alt="QR Code" style="width: 200px; height: 200px;" />`
      : `<div class="qr-placeholder">QR Code<br/>Store: ${invoiceData.storeNumberHash}</div>`;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoiceData.purchaserName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .invoice { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { margin-bottom: 20px; }
          .qr-code { text-align: center; margin: 20px 0; }
          .qr-placeholder { 
            width: 200px; 
            height: 200px; 
            border: 2px solid #000; 
            margin: 0 auto; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            background: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>INVOICE</h1>
            <p>Date: ${new Date(invoiceData.dateGenerated).toLocaleDateString('en-GB')} - ${new Date(invoiceData.dateGenerated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
            <p>Invoice ID: ${invoiceData.invoiceId || invoiceData.saleId}</p>
          </div>
          <div class="details">
            <p><strong>Purchaser:</strong> ${invoiceData.purchaserName}</p>
            <p><strong>Phone:</strong> ${invoiceData.phoneNumber}</p>
            <p><strong>Email:</strong> ${invoiceData.email}</p>
            <p><strong>Liters Purchased:</strong> ${invoiceData.litersPurchased}</p>
            <p><strong>Amount:</strong> R$ ${invoiceData.amount.toFixed(2)}</p>
            <p><strong>Store Number:</strong> ${invoiceData.storeNumber}</p>
          </div>
          <div class="qr-code">
            ${qrCodeImg}
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.purchaserName}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Receipt Upload Functions
  const handleReceiptFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const analyzeReceipt = async () => {
    if (!receiptFile) {
      toast({
        title: "No File Selected",
        description: "Please select a receipt file to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzingReceipt(true);
    try {
      // First, get available users and stores from the backend
      const token = authService.getToken();
      
      // The backend will now find the user and store based on QR code data
      // We'll use placeholder values that will be replaced by the backend
      // These will be ignored if the backend finds matches from OCR/QR data
      let userId = '68cd4a32867355608b36f722'; // Default admin user ID
      let storeId = '68cd4bc3ae38650719747a69'; // Default store ID

      console.log('Using placeholder IDs - backend will find actual user/store from QR code data');

      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('userId', userId);
      formData.append('storeId', storeId);
      formData.append('purchaseDate', new Date().toISOString());
      
      // Debug: Log what we're sending
      console.log('Sending form data:');
      console.log('userId:', userId, 'type:', typeof userId);
      console.log('storeId:', storeId, 'type:', typeof storeId);
      console.log('purchaseDate:', new Date().toISOString());
      console.log('receiptFile:', receiptFile.name, 'size:', receiptFile.size);
      
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/billing/upload-receipt`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        
        // Extract data from both OCR and QR code results
        const analysisData: ReceiptAnalysisData = {
          ocrData: {
            extractedData: {
              purchaserName: result.data.ocrData?.extractedData?.customerName || 'Not Found',
              phoneNumber: result.data.ocrData?.extractedData?.phoneNumber || 'Not Found',
              email: result.data.ocrData?.extractedData?.email || 'Not Found',
              litersPurchased: result.data.ocrData?.extractedData?.liters || 0,
              amount: result.data.ocrData?.extractedData?.amount || 0,
              storeNumber: result.data.ocrData?.extractedData?.storeName || 'Not Found',
              invoiceNumber: result.data.ocrData?.extractedData?.invoiceNumber || 'Not Found',
              date: result.data.ocrData?.extractedData?.date || 'Not Found',
              paymentMethod: result.data.ocrData?.extractedData?.paymentMethod || 'Not Found'
            },
            confidence: result.data.ocrData?.confidence || 0,
            rawText: result.data.ocrData?.rawText || 'No text extracted',
            technique: result.data.ocrData?.technique || 'unknown',
            extractionMethod: result.data.ocrData?.extractionMethod || 'unknown',
            processingTime: result.data.ocrData?.processingTime || 0
          },
          qrData: {
            extractedFields: {
              receiptId: result.data.qrData?.extractedFields?.receiptId || 'N/A',
              storeNumber: result.data.qrData?.extractedFields?.storeNumber || 'N/A',
              amount: result.data.qrData?.extractedFields?.amount || 0,
              date: result.data.qrData?.extractedFields?.date || 'N/A',
              verificationCode: result.data.qrData?.extractedFields?.verificationCode || 'N/A',
              customerName: result.data.qrData?.extractedFields?.customerName || 'N/A',
              transactionId: result.data.qrData?.extractedFields?.transactionId || 'N/A',
              rawData: result.data.qrData?.extractedFields?.rawData || 'N/A'
            },
            success: result.data.qrData?.success || false,
            confidence: result.data.qrData?.confidence || 0,
            extractionMethod: result.data.qrData?.extractionMethod || 'none',
            error: result.data.qrData?.error || ''
          }
        };
        
        setReceiptAnalysis(analysisData);
        
        toast({
          title: "Receipt Analyzed",
          description: "Receipt has been successfully analyzed",
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        console.error('Upload receipt error:', errorData);
        console.error('Validation details:', JSON.stringify(errorData.details, null, 2));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze receipt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzingReceipt(false);
    }
  };

  const testReceiptData = async () => {
    if (!receiptAnalysis) return;

    setIsTestingReceipt(true);
    try {
      // Database check
      const result = await makeAuthenticatedRequest('/billing/verify-purchase', {
        method: 'POST',
        body: JSON.stringify({
          email: receiptAnalysis.ocrData.extractedData.email,
          phoneNumber: receiptAnalysis.ocrData.extractedData.phoneNumber,
          litersPurchased: receiptAnalysis.ocrData.extractedData.litersPurchased,
          amount: receiptAnalysis.ocrData.extractedData.amount,
          storeNumber: receiptAnalysis.ocrData.extractedData.storeNumber
        })
      });

      toast({
        title: "Verification Complete",
        description: result.found 
          ? "Purchase information found in database" 
          : "Purchase information not found in database",
        variant: result.found ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify purchase data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTestingReceipt(false);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access billing features</p>
          <Button onClick={autoLogin}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-water-blue bg-clip-text text-transparent">
            Billing Integration
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate invoices and process receipt uploads for loyalty point management
          </p>
        </div>
      </div>

      {/* Billing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Billing Management
          </CardTitle>
          <CardDescription>
            Generate invoices and process receipt uploads for loyalty point management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Generation Option */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Invoice Generation</h3>
                    <p className="text-sm text-muted-foreground">Create invoices with QR codes</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate invoices for purchases with customer information, purchase details, 
                  and QR codes containing store information for tracking and verification.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Customer information capture</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>QR code generation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Automatic download</span>
                  </div>
                </div>
                <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Invoice</DialogTitle>
                      <DialogDescription>
                        Enter customer and purchase information to generate an invoice
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="purchaserName">Purchaser Name *</Label>
                          <Input
                            id="purchaserName"
                            placeholder="Enter purchaser name"
                            value={invoiceFormData.purchaserName}
                            onChange={(e) => handleInvoiceFormChange('purchaserName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            placeholder="Enter phone number"
                            value={invoiceFormData.phoneNumber}
                            onChange={(e) => handleInvoiceFormChange('phoneNumber', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={invoiceFormData.email}
                          onChange={(e) => handleInvoiceFormChange('email', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="litersPurchased">Liters Purchased *</Label>
                          <Input
                            id="litersPurchased"
                            type="number"
                            placeholder="Enter liters"
                            value={invoiceFormData.litersPurchased}
                            onChange={(e) => handleInvoiceFormChange('litersPurchased', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (R$) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            value={invoiceFormData.amount}
                            onChange={(e) => handleInvoiceFormChange('amount', parseFloat(e.target.value) || 0)}
                          />
                  </div>
                </div>
                      <div className="space-y-2">
                        <Label htmlFor="storeNumber">Store Number</Label>
                        <div className="space-y-2">
                          <Select 
                            value={selectedStore?._id || ''} 
                            onValueChange={(value) => {
                              if (value === 'loading' || value === 'no-stores') return;
                              const store = availableStores.find(s => s._id === value);
                              setSelectedStore(store);
                              if (store?.address?.postal_code) {
                                handleInvoiceFormChange('storeNumber', store.address.postal_code);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select store number" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingStores ? (
                                <SelectItem value="loading" disabled>Loading stores...</SelectItem>
                              ) : availableStores && availableStores.length > 0 ? (
                                availableStores.map((store) => (
                                  <SelectItem key={store._id} value={store._id}>
                                    {store.address?.postal_code || 'N/A'} - {store.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-stores" disabled>There are no registered stores.</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          
                          {/* Display selected store code */}
                          {selectedStore && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-blue-800">Selected Store Code:</span>
                                <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">
                                  {selectedStore.address?.postal_code || 'N/A'}
                                </span>
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                {selectedStore.name} - {selectedStore.address?.city || 'N/A'}
                              </div>
                            </div>
                          )}
                          
                          <Input
                            id="storeNumber"
                            placeholder="Or enter store number manually"
                            value={invoiceFormData.storeNumber}
                            onChange={(e) => {
                              handleInvoiceFormChange('storeNumber', e.target.value);
                              // Clear selected store if user types manually
                              if (e.target.value !== selectedStore?.address?.postal_code) {
                                setSelectedStore(null);
                              }
                            }}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsInvoiceDialogOpen(false);
                            setSelectedStore(null);
                          }}
                        >
                          Cancel
                        </Button>
                <Button 
                          onClick={generateInvoice}
                          disabled={isGeneratingInvoice}
                        >
                          {isGeneratingInvoice ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4 mr-2" />
                              Create Invoice
                            </>
                          )}
                </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Receipt Upload Option */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Receipt Upload</h3>
                    <p className="text-sm text-muted-foreground">Upload receipts for OCR processing</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload receipt images or PDFs for automatic data extraction using OCR technology. 
                  Extract customer information and QR code data for verification.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>OCR text extraction</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>QR code analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Database verification</span>
                  </div>
                </div>
                <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Receipts
                </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload Receipt</DialogTitle>
                      <DialogDescription>
                        Upload a receipt image or PDF for OCR analysis and verification
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiptFile">Receipt File</Label>
                        <Input
                          id="receiptFile"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleReceiptFileChange}
                        />
          </div>

                      {receiptFile && (
                        <div className="p-4 border rounded-lg bg-gray-50">
                          <p className="text-sm font-medium">Selected file: {receiptFile.name}</p>
                          <p className="text-xs text-gray-500">
                            Size: {(receiptFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                </div>
                      )}
              
                      <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                            setIsReceiptDialogOpen(false);
                            setReceiptFile(null);
                            setReceiptAnalysis(null);
                          }}
                        >
                          Cancel
              </Button>
              <Button 
                          onClick={analyzeReceipt}
                          disabled={!receiptFile || isAnalyzingReceipt}
                        >
                          {isAnalyzingReceipt ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <TestTube className="w-4 h-4 mr-2" />
                              Analyze
                            </>
                          )}
              </Button>
            </div>

                      {receiptAnalysis && (
                        <div className="mt-6 space-y-6">
                          <h4 className="font-medium text-lg">Extracted Information</h4>
                          
                          {/* OCR and QR Code Data in Single Column */}
                          <div className="space-y-6">
                            {/* OCR Data Section */}
                            <div className="p-4 border rounded-lg bg-blue-50">
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <h5 className="font-medium text-blue-800">OCR Text Information</h5>
                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                  {Math.round(receiptAnalysis.ocrData.confidence * 100)}% confidence
                                </span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <p><strong>Name:</strong> {receiptAnalysis.ocrData.extractedData.purchaserName}</p>
                                  <p><strong>Phone:</strong> {receiptAnalysis.ocrData.extractedData.phoneNumber}</p>
                                  <p><strong>Email:</strong> {receiptAnalysis.ocrData.extractedData.email}</p>
                                  <p><strong>Invoice #:</strong> {receiptAnalysis.ocrData.extractedData.invoiceNumber}</p>
                                  <p><strong>Liters:</strong> {receiptAnalysis.ocrData.extractedData.litersPurchased}</p>
                                  <p><strong>Amount:</strong> R$ {receiptAnalysis.ocrData.extractedData.amount.toFixed(2)}</p>
                                  <p><strong>Store:</strong> {receiptAnalysis.ocrData.extractedData.storeNumber}</p>
                                  <p><strong>Date:</strong> {receiptAnalysis.ocrData.extractedData.date}</p>
                                  <p><strong>Payment:</strong> {receiptAnalysis.ocrData.extractedData.paymentMethod}</p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-blue-200">
                                  <p className="text-xs text-blue-600">
                                    <strong>Method:</strong> {receiptAnalysis.ocrData.extractionMethod} | 
                                    <strong> Time:</strong> {receiptAnalysis.ocrData.processingTime}ms
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* QR Code Data Section */}
                            <div className="p-4 border rounded-lg bg-green-50">
                              <div className="flex items-center gap-2 mb-3">
                                <QrCode className="w-5 h-5 text-green-600" />
                                <h5 className="font-medium text-green-800">QR Code Information</h5>
                                {receiptAnalysis.qrData.success ? (
                                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                    {Math.round(receiptAnalysis.qrData.confidence * 100)}% confidence
                                  </span>
                                ) : (
                                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                                    Not detected
                                  </span>
                                )}
                              </div>
                              {receiptAnalysis.qrData.success ? (
                                <div className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <p><strong>Receipt ID:</strong> {receiptAnalysis.qrData.extractedFields.receiptId}</p>
                                    <p><strong>Store #:</strong> {receiptAnalysis.qrData.extractedFields.storeNumber}</p>
                                    <p><strong>Amount:</strong> R$ {receiptAnalysis.qrData.extractedFields.amount.toFixed(2)}</p>
                                    <p><strong>Date:</strong> {receiptAnalysis.qrData.extractedFields.date}</p>
                                    <p><strong>Verification:</strong> {receiptAnalysis.qrData.extractedFields.verificationCode}</p>
                                    <p><strong>Customer Name:</strong> {receiptAnalysis.qrData.extractedFields.customerName}</p>
                                    <p><strong>Transaction:</strong> {receiptAnalysis.qrData.extractedFields.transactionId}</p>
                                  </div>
                                  <div className="mt-3 pt-2 border-t border-green-200">
                                    <p className="text-xs text-green-600">
                                      <strong>Method:</strong> {receiptAnalysis.qrData.extractionMethod}
                                    </p>
                                    {receiptAnalysis.qrData.extractedFields.rawData && (
                                      <details className="mt-1">
                                        <summary className="text-xs text-green-600 cursor-pointer">Raw QR Data</summary>
                                        <p className="text-xs text-gray-600 mt-1 break-all">
                                          {receiptAnalysis.qrData.extractedFields.rawData}
                                        </p>
                                      </details>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-600">
                                  <p>No QR code detected in the image.</p>
                                  {receiptAnalysis.qrData.error && (
                                    <p className="text-xs text-red-600 mt-1">
                                      Error: {receiptAnalysis.qrData.error}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              onClick={testReceiptData}
                              disabled={isTestingReceipt}
                              className="w-full"
                            >
                              {isTestingReceipt ? (
                                <>
                                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  Testing...
                                </>
                              ) : (
                                <>
                                  <TestTube className="w-4 h-4 mr-2" />
                                  Test Database Verification
                                </>
                              )}
                      </Button>
                    </div>
                  </div>
                      )}
              </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
              </div>
            </CardContent>
          </Card>

    </div>
  );
};

export default BillingIntegration;
