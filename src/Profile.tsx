import React, { useState } from 'react';
import { Building2, KeyRound, Smartphone, Shield, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function Profile() {
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Company Profile</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                  <p className="text-lg text-gray-900">Acme Corporation</p>
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Security Level</h3>
                  <p className="text-lg text-gray-900">CyFun Basic</p>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <KeyRound className="h-5 w-5 text-gray-400 mr-2" />
                Change Password
              </h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* 2FA Settings */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
                Two-Factor Authentication
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Protect your account with 2FA authentication</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Use an authenticator app like Google Authenticator or Authy
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {showQRCode ? 'Hide QR Code' : 'Enable 2FA'}
                  </button>
                </div>
                
                {showQRCode && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm mx-auto mb-4">
                          {/* Placeholder for QR Code */}
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                            QR Code
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Scan this QR code with your authenticator app
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;