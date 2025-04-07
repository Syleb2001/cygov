import React, { useState, useEffect } from 'react';
import { Building2, KeyRound, Smartphone, Shield, ChevronLeft, Lock, ChevronDown, UserPlus, Users, Mail, Copy, CheckCircle, User } from 'lucide-react';
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
  
  // New state for company user management
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cyfunLevel: 'basic'
  });
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [setupUrl, setSetupUrl] = useState('');
  const [showSetupUrl, setShowSetupUrl] = useState(false);

  useEffect(() => {
    if (user) {
      setCyfunLevel(user.cyfunLevel);
      setTwoFactorEnabled(user.twoFactorEnabled || false);
      fetchCompanyUsers();
    }
  }, [user]);

  const fetchCompanyUsers = async () => {
    try {
      const response = await fetch('/api/users/company', {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompanyUsers(data.users.filter((u: any) => u.id !== user?.id));
      }
    } catch (error) {
      console.error('Error fetching company users:', error);
    }
  };

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
    const newLevel = e.target.value;
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
          userId: user?.id,
          preserveStatuses: true
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSetupUrl('');
    
    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newUser,
          companyName: user?.companyName
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      const data = await response.json();
      setSetupUrl(data.setupUrl);
      setShowSetupUrl(true);
      
      // Reset form but keep modal open to show setup URL
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        cyfunLevel: 'basic'
      });
      
      fetchCompanyUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const copySetupUrl = () => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}${setupUrl}`;
    navigator.clipboard.writeText(fullUrl);
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

            {/* Company Users Section */}
            {user?.companyName && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    Company Users
                  </h3>
                  <button
                    onClick={() => setShowNewUserModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {companyUsers.map((companyUser) => (
                      <li key={companyUser.id}>
                        <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {companyUser.firstName[0]}{companyUser.lastName[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {companyUser.firstName} {companyUser.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {companyUser.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                              companyUser.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {companyUser.isActive ? 'Active' : 'Pending'}
                            </span>
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full capitalize bg-gray-100 text-gray-800">
                              {companyUser.cyfunLevel}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

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
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm mx-auto mb-4">
                          {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
                              Loading...
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Scan this QR code with your authenticator app
                        </p>
                        <div className="w-full max-w-xs mx-auto">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
              <button
                onClick={() => {
                  setShowNewUserModal(false);
                  setShowSetupUrl(false);
                  setSetupUrl('');
                  setNewUser({
                    firstName: '',
                    lastName: '',
                    email: '',
                    cyfunLevel: 'basic'
                  });
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            {showSetupUrl ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        User created successfully
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Share this setup link with the new user:</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={window.location.origin + setupUrl}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                    />
                    <button
                      onClick={copySetupUrl}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    This link will expire in 24 hours
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowNewUserModal(false);
                      setShowSetupUrl(false);
                      setSetupUrl('');
                      setNewUser({
                        firstName: '',
                        lastName: '',
                        email: '',
                        cyfunLevel: 'basic'
                      });
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="pl-10 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="pl-10 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="pl-10 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cyfunLevel" className="block text-sm font-medium text-gray-700">
                    Security Level
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                      id="cyfunLevel"
                      value={newUser.cyfunLevel}
                      onChange={(e) => setNewUser({ ...newUser, cyfunLevel: e.target.value })}
                      className="block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none pr-10"
                    >
                      <option value="basic">Basic</option>
                      <option value="important">Important</option>
                      <option value="essential">Essential</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewUserModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Create User
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;