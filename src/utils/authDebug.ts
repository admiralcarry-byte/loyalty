// Debug utility for authentication issues
export const authDebug = {
  // Check current authentication status
  checkAuthStatus() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');
    
    console.log('=== Authentication Debug Info ===');
    console.log('Token exists:', !!token);
    console.log('Refresh token exists:', !!refreshToken);
    console.log('User data exists:', !!user);
    
    if (token) {
      try {
        // Decode JWT token (without verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token expires:', new Date(payload.exp * 1000));
        console.log('Token is expired:', Date.now() >= payload.exp * 1000);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('User data:', userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    console.log('================================');
  },
  
  // Clear all authentication data
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('Authentication data cleared');
  },
  
  // Test API endpoint
  async testAPI() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token available for testing');
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Test Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Test Success:', data);
      } else {
        const error = await response.json();
        console.error('API Test Error:', error);
      }
    } catch (error) {
      console.error('API Test Network Error:', error);
    }
  }
};

// Make it available globally for debugging
(window as any).authDebug = authDebug;