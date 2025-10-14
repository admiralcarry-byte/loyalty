import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface MaskedPhoneProps {
  phone: string;
  className?: string;
}

const MaskedPhone = ({ phone, className = "" }: MaskedPhoneProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Clear any existing timeout when component unmounts or visibility changes
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleClick = () => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Show the phone number
    setIsVisible(true);

    // Set timeout to hide after 1 second
    const newTimeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  // Generate masked phone number (keep first few characters, mask the rest)
  const getMaskedPhone = (phone: string) => {
    if (!phone || phone === 'N/A') return 'N/A';
    
    // If phone is too short, just show asterisks
    if (phone.length <= 3) {
      return '*'.repeat(phone.length);
    }
    
    // Keep the first 3 characters and mask the rest
    const visiblePart = phone.substring(0, 3);
    const maskedPart = '*'.repeat(phone.length - 3);
    return visiblePart + maskedPart;
  };

  const displayPhone = isVisible ? phone : getMaskedPhone(phone);

  return (
    <div 
      className={`flex items-center gap-1 cursor-pointer hover:text-primary transition-colors ${className}`}
      onClick={handleClick}
      title={isVisible ? "Click to hide" : "Click to reveal phone number"}
    >
      <span className="font-mono">{displayPhone}</span>
      {isVisible ? (
        <Eye className="w-3 h-3 text-primary" />
      ) : (
        <EyeOff className="w-3 h-3 text-muted-foreground" />
      )}
    </div>
  );
};

export default MaskedPhone;
