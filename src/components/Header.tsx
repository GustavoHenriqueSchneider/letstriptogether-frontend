import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

export function Header({ title, subtitle, onBack, showBackButton = true, rightContent }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showBackButton && onBack && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-6 w-6 text-[#01001D]" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-[#01001D]">Let's Trip Together</h1>
              <p className="text-sm text-gray-600">{subtitle || title}</p>
            </div>
          </div>
          
          {rightContent && (
            <div className="flex items-center space-x-3">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}