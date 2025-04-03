import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, FileCheck, AlertCircle, ChevronDown, ChevronUp, 
  Info, UserCircle, Filter, Calendar, Clock, PieChart, Shield, 
  FileText, Link as LinkIcon, Image as ImageIcon, X, Bell 
} from 'lucide-react';
import { functions } from '../data/functions';
import type { Function, Category, Subcategory, Requirement, POI } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import NotificationsDropdown from '../components/NotificationsDropdown';
import { format, addDays } from 'date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type StatusFilter = 'all' | 'pending' | 'in-progress' | 'completed';

export default function Dashboard() {
  const { user } = useAuth();
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [controlStatuses, setControlStatuses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [selectedRequirementForDeadline, setSelectedRequirementForDeadline] = useState<string | null>(null);
  const [newDeadline, setNewDeadline] = useState({
    dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    priority: 'medium' as const,
    description: ''
  });
  const [showChart, setShowChart] = useState(false);
  const [showPoiModal, setShowPoiModal] = useState(false);
  const [selectedRequirementForPoi, setSelectedRequirementForPoi] = useState<string | null>(null);
  const [pois, setPois] = useState<Record<string, POI>>({});
  const [newPoi, setNewPoi] = useState({
    type: 'text' as const,
    content: ''
  });
  const [showPoiViewModal, setShowPoiViewModal] = useState(false);
  const [selectedPoiForView, setSelectedPoiForView] = useState<POI | null>(null);

  useEffect(() => {
    const fetchControlStatuses = async () => {
      try {
        const response = await fetch('/api/controls');
        if (!response.ok) {
          throw new Error('Failed to fetch controls');
        }
        
        const data = await response.json();
        const statuses: Record<string, string> = {};
        
        if (data.controls && typeof data.controls === 'object') {
          Object.entries(data.controls).forEach(([controlId, control]: [string, any]) => {
            if (control.userStatuses && user?.id && control.userStatuses[user.id]) {
              statuses[controlId] = control.userStatuses[user.id];
            }
          });
        }
        
        setControlStatuses(statuses);
      } catch (error) {
        console.error('Error fetching control statuses:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch controls');
      }
    };

    if (user) {
      fetchControlStatuses();
    }
  }, [user]);

  useEffect(() => {
    const fetchPois = async () => {
      try {
        const response = await fetch('/api/pois');
        if (!response.ok) {
          throw new Error('Failed to fetch POIs');
        }
        
        const data = await response.json();
        const poisMap: Record<string, POI> = {};
        data.pois.forEach((poi: POI) => {
          poisMap[poi.controlId] = poi;
        });
        setPois(poisMap);
      } catch (error) {
        console.error('Error fetching POIs:', error);
      }
    };

    if (user) {
      fetchPois();
    }
  }, [user]);

  const getRequirementsForLevel = (requirements: Requirement[]): Requirement[] => {
    if (!user?.cyfunLevel) return [];
    
    switch (user.cyfunLevel) {
      case 'essential':
        return requirements.filter(req => 
          ['basic', 'important', 'essential'].includes(req.cyfunLevel)
        );
      case 'important':
        return requirements.filter(req => 
          ['basic', 'important'].includes(req.cyfunLevel)
        );
      case 'basic':
      default:
        return requirements.filter(req => 
          req.cyfunLevel === 'basic'
        );
    }
  };

  const filterRequirements = (requirements: Requirement[]): Requirement[] => {
    if (statusFilter === 'all') return requirements;
    return requirements.filter(req => {
      const status = controlStatuses[req.id] || 'pending';
      return status === statusFilter;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'in-progress':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const handleStatusChange = async (requirementId: string, newStatus: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          controlId: requirementId,
          status: newStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      setControlStatuses(prev => ({
        ...prev,
        [requirementId]: newStatus
      }));
      setError(null);
    } catch (error) {
      console.error('Error updating control status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;

    functions.forEach(func => {
      func.categories.forEach(cat => {
        cat.subcategories.forEach(subcat => {
          const requirements = getRequirementsForLevel(subcat.requirements);
          requirements.forEach(req => {
            total++;
            const status = controlStatuses[req.id] || 'pending';
            if (status === 'completed') completed++;
            else if (status === 'in-progress') inProgress++;
          });
        });
      });
    });

    return {
      total,
      completed,
      inProgress,
      pending: total - completed - inProgress
    };
  };

  const stats = calculateStats();

  const chartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.inProgress, stats.pending],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderColor: ['#D1FAE5', '#FEF3C7', '#FEE2E2'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="https://www.anderson.be/wp-content/uploads/2024/10/icone-MSP.png" alt="Logo" className="h-8 w-8 text-green-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AuditGov</h1>
              <p className="text-sm text-gray-500">Audit Management</p>
            </div>
          </div>
          <nav className="flex space-x-4 items-center">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Dashboard
            </button>
            <Link 
              to="/reports"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Reports
            </Link>
            <Link 
              to="/notes"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Support Notes
            </Link>
            <Link 
              to="/calendar"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Calendar className="h-5 w-5" />
            </Link>
            <Link 
              to="/compliance"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Shield className="h-5 w-5" />
            </Link>
            <NotificationsDropdown />
            <Link 
              to="/profile"
              className="ml-2 p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              <UserCircle className="h-6 w-6" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Overall Progress
                    </dt>
                    <dd className="flex items-baseline">
                      <div className={`text-2xl font-semibold ${stats.completed === 0 ? 'text-red-600' : stats.completed === stats.total ? 'text-green-600' : 'text-yellow-600'}`}>
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileCheck className={`h-6 w-6 ${stats.completed === 0 ? 'text-red-400' : 'text-green-400'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Requirements
                    </dt>
                    <dd className="flex items-baseline">
                      <div className={`text-2xl font-semibold ${stats.completed === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {stats.completed}/{stats.total}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className={`h-6 w-6 ${stats.inProgress === 0 ? 'text-gray-400' : 'text-yellow-400'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Requirements In Progress
                    </dt>
                    <dd className="flex items-baseline">
                      <div className={`text-2xl font-semibold ${stats.inProgress === 0 ? 'text-gray-600' : 'text-yellow-600'}`}>
                        {stats.inProgress}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className={`h-6 w-6 ${stats.pending === 0 ? 'text-gray-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Requirements
                    </dt>
                    <dd className="flex items-baseline">
                      <div className={`text-2xl font-semibold ${stats.pending === 0 ? 'text-gray-600' : 'text-red-600'}`}>
                        {stats.pending}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium text-gray-900">
                CyFun {user?.cyfunLevel} Requirements
              </h2>
              <button
                onClick={() => setShowChart(!showChart)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PieChart className="h-4 w-4 mr-2" />
                {showChart ? 'Hide Chart' : 'Show Chart'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                    statusFilter === 'all'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b ${
                    statusFilter === 'pending'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('in-progress')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b ${
                    statusFilter === 'in-progress'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                    statusFilter === 'completed'
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {showChart && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow">
              <div className="max-w-xs mx-auto">
                <Pie data={chartData} />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {functions.map(func => {
              let hasFilteredRequirements = false;
              func.categories.forEach(cat => {
                cat.subcategories.forEach(subcat => {
                  const requirements = getRequirementsForLevel(subcat.requirements);
                  if (filterRequirements(requirements).length > 0) {
                    hasFilteredRequirements = true;
                  }
                });
              });

              if (!hasFilteredRequirements && statusFilter !== 'all') return null;

              return (
                <div key={func.id} className="tree-parent">
                  <button
                    onClick={() => setExpandedFunction(expandedFunction === func.id ? null : func.id)}
                    className="w-full bg-white p-4 rounded-lg shadow flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {func.name} ({func.id})
                      </h3>
                    </div>
                    {expandedFunction === func.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {expandedFunction === func.id && (
                    <div className="mt-2 space-y-2 pl-8">
                      {func.categories.map((cat, catIndex) => {
                        let categoryHasFilteredRequirements = false;
                        cat.subcategories.forEach(subcat => {
                          const requirements = getRequirementsForLevel(subcat.requirements);
                          if (filterRequirements(requirements).length > 0) {
                            categoryHasFilteredRequirements = true;
                          }
                        });

                        if (!categoryHasFilteredRequirements && statusFilter !== 'all') return null;

                        return (
                          <div key={cat.id} className={`tree-line ${catIndex === func.categories.length - 1 ? 'last-child' : ''}`}>
                            <button
                              onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                              className="w-full bg-white p-3 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-50 border border-gray-200"
                            >
                              <div className="flex items-center">
                                <h4 className="text-md font-medium text-gray-800">
                                  {cat.name} ({cat.id})
                                </h4>
                              </div>
                              {expandedCategory === cat.id ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </button>

                            {expandedCategory === cat.id && (
                              <div className="mt-2 space-y-2 pl-8">
                                {cat.subcategories.map((subcat, subcatIndex) => {
                                  const requirements = getRequirementsForLevel(subcat.requirements);
                                  const filteredRequirements = filterRequirements(requirements);

                                  if (filteredRequirements.length === 0 && statusFilter !== 'all') return null;

                                  return (
                                    <div key={subcat.id} className={`tree-line ${subcatIndex === cat.subcategories.length - 1 ? 'last-child' : ''}`}>
                                      <button
                                        onClick={() => setExpandedSubcategory(expandedSubcategory === subcat.id ? null : subcat.id)}
                                        className="w-full bg-white p-3 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-50 border border-gray-200"
                                      >
                                        <div className="flex items-center">
                                          <h5 className="text-sm font-medium text-gray-800">
                                            {subcat.id}: {subcat.title}
                                          </h5>
                                        </div>
                                        {expandedSubcategory === subcat.id ? (
                                          <ChevronUp className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4 text-gray-400" />
                                        )}
                                      </button>

                                      {expandedSubcategory === subcat.id && (
                                        <div className="mt-2 space-y-2 pl-8">
                                          {filteredRequirements.map((req, reqIndex) => (
                                            <div
                                              key={req.id}
                                              className={`tree-line ${reqIndex === filteredRequirements.length - 1 ? 'last-child' : ''}`}
                                            >
                                              <div
                                                className={`p-4 rounded-lg shadow-sm border ${
                                                  getStatusColor(controlStatuses[req.id] || 'pending')
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                      <h4 className="font-medium">{req.id}</h4>
                                                      <button
                                                        onClick={() => setSelectedRequirement(selectedRequirement?.id === req.id ? null : req)}
                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                      >
                                                        <Info className="h-4 w-4" />
                                                      </button>
                                                    </div>
                                                    <p className="text-sm opacity-90">{req.title}</p>
                                                    
                                                    {selectedRequirement?.id === req.id && (
                                                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                                        <h5 className="font-medium mb-2">Description</h5>
                                                        <p className="text-sm text-gray-600 mb-4">{req.description}</p>
                                                        
                                                        {req.guidance && req.guidance.length > 0 && (
                                                          <>
                                                            <h5 className="font-medium mb-2">Guidance</h5>
                                                            <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                                                              {req.guidance.map((item, index) => (
                                                                <li key={index} className="mb-1">{item}</li>
                                                              ))}
                                                            </ul>
                                                          </>
                                                        )}
                                                        
                                                        {req.references && req.references.length > 0 && (
                                                          <>
                                                            <h5 className="font-medium mb-2">References</h5>
                                                            <ul className="text-sm text-gray-600">
                                                              {req.references.map((ref, index) => (
                                                                <li key={index} className="mb-1">
                                                                  {ref.name}{ref.clause ? `, ${ref.clause}` : ''}
                                                                </li>
                                                              ))}
                                                            </ul>
                                                          </>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    {controlStatuses[req.id] === 'completed' && (
                                                      <button
                                                        onClick={() => handlePoiClick(req.id)}
                                                        className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                                                        title={pois[req.id] ? "View Proof of Implementation" : "Add Proof of Implementation"}
                                                      >
                                                        {pois[req.id] ? (
                                                          <div className="relative">
                                                            <FileText className="h-5 w-5 text-green-600" />
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                                                          </div>
                                                        ) : (
                                                          <FileText className="h-5 w-5" />
                                                        )}
                                                      </button>
                                                    )}
                                                    {controlStatuses[req.id] === 'in-progress' && (
                                                      <button
                                                        onClick={() => {
                                                          setSelectedRequirementForDeadline(req.id);
                                                          setShowDeadlineModal(true);
                                                        }}
                                                        className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                                                        title="Set deadline"
                                                      >
                                                        <Clock className="h-5 w-5" />
                                                      </button>
                                                    )}
                                                    <select
                                                      value={controlStatuses[req.id] || 'pending'}
                                                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                                      className={`ml-4 rounded-md border py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm ${getStatusColor(controlStatuses[req.id] || 'pending')}`}
                                                    >
                                                      <option value="pending">{getStatusText('pending')}</option>
                                                      <option value="in-progress">{getStatusText('in-progress')}</option>
                                                      <option value="completed">{getStatusText('completed')}</option>
                                                    </select>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* ... (rest of the modals remain unchanged) ... */}
    </div>
  );
}