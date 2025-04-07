import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Users, Shield, Calendar, FileText, MessageSquare, Search,
  UserCheck, Eye, EyeOff, ArrowRight, Key, X, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User, Note, Deadline, POI, AdminStats } from '../types';

type Tab = 'users' | 'notes' | 'deadlines' | 'pois';

export default function Admin() {
  const { user, impersonateUser, setIsReadOnly } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalControls: 0,
    totalNotes: 0,
    totalDeadlines: 0,
    totalPois: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${user?.id}`,
        'Content-Type': 'application/json'
      };

      const [usersRes, notesRes, deadlinesRes, poisRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/notes', { headers }),
        fetch('/api/admin/deadlines', { headers }),
        fetch('/api/admin/pois', { headers })
      ]);

      if (!usersRes.ok || !notesRes.ok || !deadlinesRes.ok || !poisRes.ok) {
        throw new Error('Failed to fetch admin data');
      }

      const [usersData, notesData, deadlinesData, poisData] = await Promise.all([
        usersRes.json(),
        notesRes.json(),
        deadlinesRes.json(),
        poisRes.json()
      ]);

      const users = Array.isArray(usersData.users) ? usersData.users : [];
      const notes = Array.isArray(notesData.notes) ? notesData.notes : [];
      const deadlines = Array.isArray(deadlinesData.deadlines) ? deadlinesData.deadlines : [];
      const pois = Array.isArray(poisData.pois) ? poisData.pois : [];

      setUsers(users);
      setNotes(notes);
      setDeadlines(deadlines);
      setPois(pois);

      setStats({
        totalUsers: users.length,
        totalControls: Object.keys(usersData.controls || {}).length,
        totalNotes: notes.length,
        totalDeadlines: deadlines.length,
        totalPois: pois.length
      });

      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch admin data');
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const searchTermLower = searchTerm.toLowerCase();

    switch (activeTab) {
      case 'users':
        return Array.isArray(users) ? users.filter(user => 
          user.email?.toLowerCase().includes(searchTermLower) ||
          user.firstName?.toLowerCase().includes(searchTermLower) ||
          user.lastName?.toLowerCase().includes(searchTermLower) ||
          user.companyName?.toLowerCase().includes(searchTermLower)
        ) : [];

      case 'notes':
        return Array.isArray(notes) ? notes.filter(note => 
          note.content?.toLowerCase().includes(searchTermLower) ||
          note.controlId?.toLowerCase().includes(searchTermLower)
        ) : [];

      case 'deadlines':
        return Array.isArray(deadlines) ? deadlines.filter(deadline => 
          deadline.controlId?.toLowerCase().includes(searchTermLower) ||
          deadline.description?.toLowerCase().includes(searchTermLower)
        ) : [];

      case 'pois':
        return Array.isArray(pois) ? pois.filter(poi => 
          poi.controlId?.toLowerCase().includes(searchTermLower) ||
          poi.content?.toLowerCase().includes(searchTermLower)
        ) : [];

      default:
        return [];
    }
  };

  const handleImpersonateUser = (selectedUser: User, readOnly: boolean = false) => {
    const { password, ...userWithoutPassword } = selectedUser;
    impersonateUser(userWithoutPassword);
    setIsReadOnly(readOnly);
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      const selectedUser = users.find(u => u.id === selectedUserId);
      if (!selectedUser) {
        throw new Error("Utilisateur non trouvé");
      }

      const response = await fetch(`/api/admin/password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: selectedUser.email,
          newPassword: newPassword
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update password');
      }

      setSuccessMessage(`Password updated successfully for ${selectedUser.email}`);
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError(null);
        setSuccessMessage(null);
        setSelectedUserId(null);
        setSelectedUserEmail('');
      }, 2000);

      await fetchData();
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error instanceof Error ? error.message : "Erreur lors de la mise à jour du mot de passe");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage users and view system data
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="ml-2 text-sm font-medium text-gray-500">Users</span>
                </div>
                <div className="mt-2 text-2xl font-semibold">{stats.totalUsers}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-sm font-medium text-gray-500">Controls</span>
                </div>
                <div className="mt-2 text-2xl font-semibold">{stats.totalControls}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  <span className="ml-2 text-sm font-medium text-gray-500">Notes</span>
                </div>
                <div className="mt-2 text-2xl font-semibold">{stats.totalNotes}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-red-500" />
                  <span className="ml-2 text-sm font-medium text-gray-500">Deadlines</span>
                </div>
                <div className="mt-2 text-2xl font-semibold">{stats.totalDeadlines}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-yellow-500" />
                  <span className="ml-2 text-sm font-medium text-gray-500">POIs</span>
                </div>
                <div className="mt-2 text-2xl font-semibold">{stats.totalPois}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <div className="flex space-x-4 mb-4 sm:mb-0">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'users'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'notes'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab('deadlines')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'deadlines'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Deadlines
                </button>
                <button
                  onClick={() => setActiveTab('pois')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'pois'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  POIs
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {activeTab === 'users' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2FA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </>
                    )}
                    {activeTab === 'notes' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </>
                    )}
                    {activeTab === 'deadlines' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </>
                    )}
                    {activeTab === 'pois' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredData().map((item: any) => (
                    <tr key={item.id}>
                      {activeTab === 'users' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.firstName} {item.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.companyName}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{item.cyfunLevel}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.twoFactorEnabled ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Enabled
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Disabled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleImpersonateUser(item)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                title="View as user"
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                View As
                              </button>
                              <button
                                onClick={() => handleImpersonateUser(item, true)}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                title="View as read-only"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Read Only
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUserId(item.id);
                                  setShowPasswordModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                title="Change password"
                              >
                                <Key className="h-4 w-4 mr-1" />
                                Change Password
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === 'notes' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">{item.controlId}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 line-clamp-2">{item.content}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                        </>
                      )}
                      {activeTab === 'deadlines' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">{item.controlId}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : item.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : item.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === 'pois' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">{item.controlId}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{item.type}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 line-clamp-2">{item.content}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError(null);
                  setSuccessMessage(null);
                  setSelectedUserId(null);
                  setSelectedUserEmail('');
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded flex items-center">
                  <X className="h-5 w-5 mr-2" />
                  {passwordError}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {successMessage}
                </div>
              )}

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full h-10 px-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full h-10 px-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError(null);
                    setSuccessMessage(null);
                    setSelectedUserId(null);
                    setSelectedUserEmail('');
                  }}
                  className="px-4 py-2 h-10 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={!newPassword || !confirmPassword || !!successMessage}
                  className="px-4 py-2 h-10 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}