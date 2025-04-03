import React, { useState, useEffect } from 'react';
import { Building2, KeyRound, Smartphone, Shield, ChevronLeft, Lock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QRCode from 'qrcode';

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cyfunLevel, setCyfunLevel] = useState(user?.cyfunLevel || 'basic');
  const [levelUpdateSuccess, setLevelUpdateSuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);

  useEffect(() => {
    if (user) {
      setCyfunLevel(user.cyfunLevel);
      setTwoFactorEnabled(user.twoFactorEnabled || false);
    }
  }, [user]);

  useEffect(() => {
    if (showQRCode && !qrCodeUrl && !twoFactorEnabled) {
      const setupTwoFactor = async () => {
        try {
          const response = await fetch('/api/auth/setup-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user?.email })
          });

          if (!response.ok) {
            throw new Error('Failed to setup 2FA');
          }

          const data = await response.json();
          setTwoFactorSecret(data.secret);

          const qrCode = await QRCode.toDataURL(data.otpAuthUrl);
          setQrCodeUrl(qrCode);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to setup 2FA');
          setShowQRCode(false);
        }
      };

      setupTwoFactor();
    }
  }, [showQRCode, user?.email, qrCodeUrl, twoFactorEnabled]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLevelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = e.target.value as 'basic' | 'important' | 'essential';
    setCyfunLevel(newLevel);
    setLevelUpdateSuccess(false);
    setError('');

    try {
      const response = await fetch('/api/auth/update-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          cyfunLevel: newLevel,
          userId: user?.id
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update security level');
      }

      const data = await response.json();
      updateUser(data.user);
      setLevelUpdateSuccess(true);
      setTimeout(() => setLevelUpdateSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Revert the select value on error
      setCyfunLevel(user?.cyfunLevel || 'basic');
    }
  };

  const verifyTwoFactor = async () => {
    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          secret: twoFactorSecret,
          token: verificationCode
        })
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
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
                  <p className="text-lg text-gray-900">{user?.companyName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Security Level</h3>
                  <div className="mt-1 relative rounded-md shadow-sm max-w-xs">
                    <select
                      value={cyfunLevel}
                      onChange={handleLevelChange}
                      className="block w-full h-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none pr-10"
                    >
                      <option value="basic">CyFun Basic</option>
                      <option value="important">CyFun Important</option>
                      <option value="essential">CyFun Essential</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                  {levelUpdateSuccess && (
                    <p className="mt-2 text-sm text-green-600">Security level updated successfully</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <KeyRound className="h-5 w-5 text-gray-400 mr-2" />
                Change Password
              </h3>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                  Password updated successfully
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 block w-full h-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 block w-full h-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 block w-full h-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                  {!twoFactorEnabled ? (
                    <button
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {showQRCode ? 'Hide QR Code' : 'Enable 2FA'}
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Enabled
                    </span>
                  )}
                </div>
                
                {showQRCode && !twoFactorEnabled && (
                  <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex flex-col items-center">
                      <div className="w-64 h-64 bg-white p-4 rounded-lg shadow-sm mx-auto mb-6">
                        {qrCodeUrl ? (
                          <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            Loading...
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4 text-center">
                        Scan this QR code with your authenticator app
                      </p>
                      <div className="w-full max-w-xs">
                        <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
                          Enter verification code
                        </label>
                        <input
                          type="text"
                          id="verification-code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter 6-digit code"
                        />
                        <button
                          onClick={verifyTwoFactor}
                          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Verify and Enable
                        </button>
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