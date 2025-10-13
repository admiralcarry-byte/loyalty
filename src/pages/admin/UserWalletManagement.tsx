import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Smartphone,
  CreditCard,
  Globe,
  WalletIcon,
  Search,
  RefreshCw
} from 'lucide-react';
import { walletManagementService, UserWallet } from '@/services/walletManagementService';
import { toast } from 'sonner';

const UserWalletManagement: React.FC = () => {
  const [users, setUsers] = useState<UserWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWallet | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    wallet_number: '',
    wallet_provider: 'mobile_money' as const
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsersWithWallets();
  }, []);

  const loadUsersWithWallets = async () => {
    try {
      setLoading(true);
      const response = await walletManagementService.getUsersWithVerifiedWallets();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error loading users with wallets:', error);
      toast.error('Failed to load users with wallets');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserWallet) => {
    setSelectedUser(user);
    setEditFormData({
      wallet_number: user.wallet.wallet_number || '',
      wallet_provider: user.wallet.wallet_provider
    });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  const validateEditForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editFormData.wallet_number.trim()) {
      newErrors.wallet_number = 'Wallet number is required';
    } else {
      const isValid = walletManagementService.validateWalletNumber(
        editFormData.wallet_number, 
        editFormData.wallet_provider
      );
      if (!isValid) {
        newErrors.wallet_number = walletManagementService.getWalletValidationMessage(editFormData.wallet_provider);
      }
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!selectedUser || !validateEditForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      setSaving(true);
      await walletManagementService.updateUserWallet(selectedUser.id, editFormData);
      await loadUsersWithWallets();
      setEditDialogOpen(false);
      toast.success('User wallet updated successfully');
    } catch (error: any) {
      console.error('Error updating user wallet:', error);
      toast.error(error.message || 'Failed to update user wallet');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyUser = async (userId: string, verified: boolean) => {
    try {
      setSaving(true);
      await walletManagementService.verifyUserWallet(userId, verified);
      await loadUsersWithWallets();
      toast.success(`User wallet ${verified ? 'verified' : 'unverified'} successfully`);
    } catch (error: any) {
      console.error('Error verifying user wallet:', error);
      toast.error(error.message || 'Failed to verify user wallet');
    } finally {
      setSaving(false);
    }
  };

  const getWalletProviderIcon = (provider: string) => {
    switch (provider) {
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer':
        return <CreditCard className="h-4 w-4" />;
      case 'crypto':
        return <Globe className="h-4 w-4" />;
      case 'digital_wallet':
        return <WalletIcon className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.wallet.wallet_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users with wallets...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Wallet Management</h1>
          <p className="text-muted-foreground">
            Manage user wallet information and verification status
          </p>
        </div>
        <Button onClick={loadUsersWithWallets} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users with Wallets ({users.length})
          </CardTitle>
          <CardDescription>
            Users who have registered wallet information for commission transfers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or wallet number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getWalletProviderIcon(user.wallet.wallet_provider)}
                        <div>
                          <div className="text-sm font-medium">
                            {walletManagementService.getWalletProviderDisplayName(user.wallet.wallet_provider)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ***{user.wallet.wallet_number.slice(-4)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.wallet.wallet_verified ? "default" : "secondary"}>
                        {user.wallet.wallet_verified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {walletManagementService.formatCurrency(user.wallet.wallet_balance)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyUser(user.id, !user.wallet.wallet_verified)}
                          disabled={saving}
                        >
                          {user.wallet.wallet_verified ? (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No users found matching your search.' : 'No users with wallets found.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Wallet Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Wallet</DialogTitle>
            <DialogDescription>
              Update wallet information for {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet_provider">Wallet Provider</Label>
              <Select
                value={editFormData.wallet_provider}
                onValueChange={(value) => setEditFormData({ ...editFormData, wallet_provider: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile_money">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Money
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="crypto">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Cryptocurrency
                    </div>
                  </SelectItem>
                  <SelectItem value="digital_wallet">
                    <div className="flex items-center gap-2">
                      <WalletIcon className="h-4 w-4" />
                      Digital Wallet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet_number">Wallet Number</Label>
              <Input
                id="wallet_number"
                value={editFormData.wallet_number}
                onChange={(e) => setEditFormData({ ...editFormData, wallet_number: e.target.value })}
                placeholder="Enter wallet number"
                className={editErrors.wallet_number ? 'border-red-500' : ''}
              />
              {editErrors.wallet_number && (
                <p className="text-sm text-red-600">{editErrors.wallet_number}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {walletManagementService.getWalletValidationMessage(editFormData.wallet_provider)}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSaveEdit} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserWalletManagement;
