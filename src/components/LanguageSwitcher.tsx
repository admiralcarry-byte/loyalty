import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLanguageContext } from "@/contexts/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = "", 
  showIcon = true,
  size = 'md'
}) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages, translate } = useLanguageContext();

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Globe className="w-4 h-4 text-muted-foreground" />}
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-full ${sizeClasses[size]}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {getAvailableLanguages().map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
