import React from 'react';
import { Brain } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 animate-pulse mx-auto">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div className="text-lg font-medium text-gray-700">Loading...</div>
      </div>
    </div>
  );
}