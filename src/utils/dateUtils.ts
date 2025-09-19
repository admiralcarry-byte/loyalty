// Utility functions for date formatting and handling

export const formatDateTime = (dateValue: any): { date: string; time: string } => {
  let formattedDate = 'N/A';
  let formattedTime = 'N/A';
  
  if (!dateValue) {
    return { date: formattedDate, time: formattedTime };
  }
  
  try {
    const dateObj = new Date(dateValue);
    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      formattedTime = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else {
      console.warn('Invalid date value:', dateValue);
    }
  } catch (error) {
    console.warn('Date parsing error for value:', dateValue, error);
  }
  
  return { date: formattedDate, time: formattedTime };
};

export const formatDate = (dateValue: any): string => {
  if (!dateValue) return 'N/A';
  
  try {
    const dateObj = new Date(dateValue);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.warn('Date parsing error:', error);
  }
  
  return 'N/A';
};

export const formatTime = (dateValue: any): string => {
  if (!dateValue) return 'N/A';
  
  try {
    const dateObj = new Date(dateValue);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  } catch (error) {
    console.warn('Time parsing error:', error);
  }
  
  return 'N/A';
};

export const formatRelativeTime = (dateValue: any): string => {
  if (!dateValue) return 'N/A';
  
  try {
    const dateObj = new Date(dateValue);
    if (isNaN(dateObj.getTime())) return 'N/A';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return formatDate(dateValue);
  } catch (error) {
    console.warn('Relative time parsing error:', error);
    return 'N/A';
  }
};