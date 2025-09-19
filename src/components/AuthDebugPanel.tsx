import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { authDebug } from '@/utils/authDebug';
import { authService } from '@/services/authService';

export const AuthDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runDebugCheck = () => {
    const originalLog = console.log;
    let logs: string[] = [];
    
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    authDebug.checkAuthStatus();
    authDebug.testAPI();
    
    console.log = originalLog;
    setDebugInfo(logs.join('\n'));
  };

  const clearAuth = () => {
    authDebug.clearAuth();
    setDebugInfo('Authentication data cleared');
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      // Try to login with a test account
      const result = await authService.login({
        email: 'admin@aguatwezah.com',
        password: 'admin123'
      });
      
      if (result.success) {
        authService.setAuthData(
          result.data.accessToken,
          result.data.refreshToken,
          result.data.user
        );
        setDebugInfo('Login successful! Token and user data saved.');
      }
    } catch (error) {
      setDebugInfo(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runDebugCheck} variant="outline">
            Check Auth Status
          </Button>
          <Button onClick={clearAuth} variant="destructive">
            Clear Auth Data
          </Button>
          <Button onClick={testLogin} disabled={isLoading} variant="default">
            {isLoading ? 'Testing Login...' : 'Test Login'}
          </Button>
        </div>
        
        {debugInfo && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Debug Output:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {debugInfo}
            </pre>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Click "Check Auth Status" to see current authentication state</li>
            <li>Click "Test Login" to attempt login with admin credentials</li>
            <li>Click "Clear Auth Data" to remove all stored tokens</li>
            <li>Check browser console for detailed debug information</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};