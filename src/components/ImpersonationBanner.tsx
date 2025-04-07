import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserX } from 'lucide-react';

export default function ImpersonationBanner() {
  const { impersonatedUser, stopImpersonating, isReadOnly } = useAuth();

  if (!impersonatedUser) return null;

  return (
    <div className="bg-indigo-600 text-white px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium">
            Viewing as: {impersonatedUser.firstName} {impersonatedUser.lastName}
          </span>
          {isReadOnly && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-800">
              Read Only
            </span>
          )}
        </div>
        <button
          onClick={stopImpersonating}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
        >
          <UserX className="h-4 w-4 mr-1" />
          Exit View
        </button>
      </div>
    </div>
  );
}