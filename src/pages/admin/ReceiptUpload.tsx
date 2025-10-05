import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Camera,
  FileImage,
  X,
  Eye,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { billingService } from '@/services/billingService';
import { usersService } from '@/services/usersService';
import { storesService } from '@/services/storesService';

interface ExtractedData {
  invoiceNumber: string;
  storeName: string;
  amount: number;
  date: string;
  paymentMethod: string;
}

const ReceiptUpload = () => {
  const { toast } = useToast();
  const { translate } = useLanguageContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [scanUploadId, setScanUploadId] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  
  const [users, setUsers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);

  // Load users and stores on component mount
  React.useEffect(() => {
    loadUsers();
    loadStores();
  }, []);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await usersService.getUsers({ limit: 100 });
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadStores = async () => {
    try {
      setLoadingStores(true);
      const response = await storesService.getStores({ limit: 100, status: 'active' });
      setStores(response.data || []);
    } catch (error) {
      console.error('Error loading stores:', error);
      toast({
        title: "Error",
        description: "Failed to load stores",
        variant: "destructive",
      });
    } finally {
      setLoadingStores(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a JPG, PNG, or PDF file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      // Reset previous results
      setExtractedData(null);
      setConfidence(0);
      setScanUploadId(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedUserId || !selectedStoreId) {
      toast({
        title: "Missing Information",
        description: "Please select a file, user, and store",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await billingService.uploadReceipt(
        selectedFile,
        selectedUserId,
        selectedStoreId,
        purchaseDate || undefined
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setExtractedData(response.data.extractedData);
        setConfidence(response.data.confidence);
        setScanUploadId(response.data.scanUploadId);
        setWarnings(response.data.warnings || []);

        toast({
          title: "Upload Successful",
          description: "Receipt uploaded and processed successfully",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Display extracted OCR data in browser console if available
      if (error && typeof error === 'object' && 'extractedData' in error) {
        console.log('=== OCR EXTRACTED DATA ===');
        console.log('Extracted Text:', (error as any).extractedText);
        console.log('Parsed Data:', (error as any).extractedData);
        console.log('Confidence:', (error as any).confidence);
        console.log('Validation Errors:', (error as any).details);
        console.log('Warnings:', (error as any).warnings);
        console.log('========================');
      }
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload receipt",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    setConfidence(0);
    setScanUploadId(null);
    setWarnings([]);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{translate('receipt.upload')}</h1>
          <p className="text-muted-foreground">
            {translate('upload.receipts.for.ocr.processing')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Receipt
            </CardTitle>
            <CardDescription>
              Select a receipt image or PDF for processing
            </CardDescription>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Upload Requirements:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Upload actual purchase receipts, invoices, or bills</li>
                  <li>• Image must contain: store name, purchase amount, date</li>
                  <li>• Supported formats: JPG, PNG, PDF (max 10MB)</li>
                  <li>• Ensure text is clear and readable</li>
                </ul>
                <p className="mt-2 text-sm text-red-600">
                  <strong>Do not upload:</strong> Screenshots of app notifications, dashboards, or other non-receipt content.
                </p>
              </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Selection */}
            <div className="space-y-2">
              <Label htmlFor="receipt-file">Receipt File</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="receipt-file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user-select">User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading users...
                    </SelectItem>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Store Selection */}
            <div className="space-y-2">
              <Label htmlFor="store-select">Store</Label>
              <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  {loadingStores ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading stores...
                    </SelectItem>
                  ) : (
                    stores.map((store) => (
                      <SelectItem key={store._id} value={store._id}>
                        {store.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <Label htmlFor="purchase-date">Purchase Date (Optional)</Label>
              <Input
                id="purchase-date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedUserId || !selectedStoreId || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Process
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview and Results Section */}
        <div className="space-y-6">
          {/* File Preview */}
          {selectedFile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  File Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <Badge variant="secondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                  
                  {previewUrl && (
                    <div className="mt-4">
                      <img
                        src={previewUrl}
                        alt="Receipt preview"
                        className="w-full h-48 object-contain border rounded"
                      />
                    </div>
                  )}
                  
                  {!previewUrl && selectedFile.type === 'application/pdf' && (
                    <div className="mt-4 p-8 border rounded flex items-center justify-center">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">PDF Preview not available</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* OCR Results */}
          {extractedData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Extracted Data
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getConfidenceColor(confidence)}>
                    {getConfidenceText(confidence)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(confidence * 100)}% confidence
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Invoice Number</Label>
                    <p className="text-sm text-muted-foreground">{extractedData.invoiceNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Amount</Label>
                    <p className="text-sm text-muted-foreground">R$ {extractedData.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Store</Label>
                    <p className="text-sm text-muted-foreground">{extractedData.storeName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <p className="text-sm text-muted-foreground">{extractedData.paymentMethod}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(extractedData.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {scanUploadId && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Receipt uploaded successfully! Scan Upload ID: {scanUploadId}
                    </AlertDescription>
                  </Alert>
                )}

                {warnings.length > 0 && (
                  <Alert variant="default" className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>
                      <div className="text-yellow-800">
                        <p className="font-medium mb-2">Please review the following:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {warnings.map((warning, index) => (
                            <li key={index} className="text-sm">{warning}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptUpload;