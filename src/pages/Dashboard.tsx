import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  BarChart3, FileCheck, AlertCircle, ChevronDown, ChevronUp, 
  Info, UserCircle, Filter, Calendar, Clock, PieChart, Shield, 
  FileText, Link as LinkIcon, Image as ImageIcon, X, Bell, Star, Cog 
} from 'lucide-react';
import { functions } from '../data/functions';
import type { Function, Category, Subcategory, Requirement, POI, MaturityScore } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import NotificationsDropdown from '../components/NotificationsDropdown';
import { format, addDays } from 'date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type StatusFilter = 'all' | 'pending' | 'in-progress' | 'completed';

// Helper functions
function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-50 border-green-200 text-green-700';
    case 'in-progress':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    default:
      return 'bg-red-50 border-red-200 text-red-700';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in-progress':
      return 'In Progress';
    default:
      return 'Pending';
  }
}

function getRequirementsForLevel(requirements: Requirement[], cyfunLevel?: string): Requirement[] {
  if (!cyfunLevel) return [];
  
  switch (cyfunLevel) {
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
}

// Utility functions to count items
function countCategories(func: Function): number {
  return func.categories.length;
}

function countSubcategories(cat: Category): number {
  return cat.subcategories.length;
}

function countRequirements(subcat: Subcategory, cyfunLevel?: string): number {
  return getRequirementsForLevel(subcat.requirements, cyfunLevel).length;
}

// Completion calculation functions
function calculateSubcategoryCompletion(subcat: Subcategory, controlStatuses: Record<string, { userStatuses: Record<string, string> }>, userId?: string, cyfunLevel?: string): number {
  const requirements = getRequirementsForLevel(subcat.requirements, cyfunLevel);
  if (requirements.length === 0) return 0;
  
  const completedCount = requirements.filter(req => {
    const status = getStatusForRequirement(req.id, controlStatuses, userId);
    return status === 'completed';
  }).length;
  return (completedCount / requirements.length) * 100;
}

function calculateCategoryCompletion(cat: Category, controlStatuses: Record<string, { userStatuses: Record<string, string> }>, userId?: string, cyfunLevel?: string): number {
  if (cat.subcategories.length === 0) return 0;
  
  const subcategoryCompletions = cat.subcategories.map(subcat => 
    calculateSubcategoryCompletion(subcat, controlStatuses, userId, cyfunLevel)
  );
  
  const totalCompletion = subcategoryCompletions.reduce((acc, curr) => acc + curr, 0);
  return totalCompletion / cat.subcategories.length;
}

function calculateFunctionCompletion(func: Function, controlStatuses: Record<string, { userStatuses: Record<string, string> }>, userId?: string, cyfunLevel?: string): number {
  if (func.categories.length === 0) return 0;
  
  const categoryCompletions = func.categories.map(cat => 
    calculateCategoryCompletion(cat, controlStatuses, userId, cyfunLevel)
  );
  
  const totalCompletion = categoryCompletions.reduce((acc, curr) => acc + curr, 0);
  return totalCompletion / func.categories.length;
}

function getStatusForRequirement(reqId: string, controlStatuses: Record<string, { userStatuses: Record<string, string> }>, userId?: string): string {
  if (!userId) return 'pending';
  
  // Check specific requirement status first
  const reqStatus = controlStatuses[reqId]?.userStatuses[userId];
  if (reqStatus) return reqStatus;
  
  // If no specific status, check parent control status
  const parentControlId = reqId.split('.').slice(0, -1).join('.');
  return controlStatuses[parentControlId]?.userStatuses[userId] || 'pending';
}

// Circular Progress Component
function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColorClass = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    if (percentage >= 25) return 'text-orange-400';
    return 'text-red-500';
  };
  
  return (
    <div className="relative inline-flex items-center justify-center w-8 h-8 mr-3">
      <svg className="transform -rotate-90 w-8 h-8">
        <circle
          className="text-gray-200"
          strokeWidth="2"
          stroke="currentColor"
          fill="transparent"
          r="14"
          cx="16"
          cy="16"
        />
        <circle
          className={getColorClass(percentage)}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="14"
          cx="16"
          cy="16"
        />
      </svg>
      <span className={`absolute text-xs font-medium ${getColorClass(percentage)}`}>
        {Math.round(percentage)}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { user, isReadOnly } = useAuth();
  const { addNotification } = useNotifications();
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [controlStatuses, setControlStatuses] = useState<Record<string, { userStatuses: Record<string, string> }>>({});
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showKeyMeasuresOnly, setShowKeyMeasuresOnly] = useState(false);
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
  const [maturityScores, setMaturityScores] = useState<Record<string, MaturityScore>>({});
  const [showMaturityModal, setShowMaturityModal] = useState(false);
  const [selectedRequirementForMaturity, setSelectedRequirementForMaturity] = useState<string | null>(null);
  const [selectedMaturityLevel, setSelectedMaturityLevel] = useState<number>(1);
  const [selectedMaturityType, setSelectedMaturityType] = useState<'documentation' | 'implementation'>('documentation');

  useEffect(() => {
    const fetchControlStatuses = async () => {
      try {
        const response = await fetch('/api/controls');
        if (!response.ok) {
          throw new Error('Failed to fetch controls');
        }
        
        const data = await response.json();
        setControlStatuses(data.controls || {});
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

  useEffect(() => {
    const fetchMaturityScores = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/maturity?userId=${user.id}`);
        if (!response.ok) {
          console.error('Failed to fetch maturity scores');
          return;
        }
        
        const data = await response.json();
        setMaturityScores(data.scores || {});
      } catch (error) {
        console.error('Error fetching maturity scores:', error);
      }
    };

    fetchMaturityScores();
  }, [user]);

  const handleStatusChange = async (requirementId: string, newStatus: string) => {
    if (isReadOnly) {
      setError('Cannot change status in read-only mode');
      return;
    }

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
        [requirementId]: {
          userStatuses: {
            ...(prev[requirementId]?.userStatuses || {}),
            [user.id]: newStatus
          }
        }
      }));

      const requirement = functions
        .flatMap(f => f.categories)
        .flatMap(c => c.subcategories)
        .flatMap(s => s.requirements)
        .find(r => r.id === requirementId);

      if (requirement) {
        let message = '';
        switch (newStatus) {
          case 'in-progress':
            message = `${requirementId} has been marked as In Progress. Don't forget to set a deadline!`;
            break;
          case 'completed':
            message = `${requirementId} has been marked as Completed. Don't forget to add proof of implementation!`;
            break;
          case 'pending':
            message = `${requirementId} has been marked as Pending`;
            break;
        }

        addNotification({
          type: 'status',
          title: 'Requirement Status Updated',
          message,
          controlId: requirementId
        });
      }

      setError(null);
    } catch (error) {
      console.error('Error updating control status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const handleAddDeadline = async () => {
    if (!selectedRequirementForDeadline || !user) return;

    try {
      const response = await fetch('/api/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          controlId: selectedRequirementForDeadline,
          userId: user.id,
          ...newDeadline
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add deadline');
      }

      const data = await response.json();
      
      addNotification({
        type: 'deadline',
        title: 'New Deadline Added',
        message: `Deadline set for ${selectedRequirementForDeadline} on ${format(new Date(newDeadline.dueDate), 'MMM d, yyyy')}`,
        controlId: selectedRequirementForDeadline
      });

      setShowDeadlineModal(false);
      setSelectedRequirementForDeadline(null);
      setNewDeadline({
        dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
        priority: 'medium',
        description: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add deadline');
    }
  };

  const handleAddPoi = async () => {
    if (!selectedRequirementForPoi || !user) return;

    try {
      const response = await fetch('/api/pois', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          controlId: selectedRequirementForPoi,
          userId: user.id,
          ...newPoi
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add POI');
      }

      const data = await response.json();
      setPois(prev => ({
        ...prev,
        [selectedRequirementForPoi]: data.poi
      }));

      addNotification({
        type: 'poi',
        title: 'Proof of Implementation Added',
        message: `POI added for ${selectedRequirementForPoi}`,
        controlId: selectedRequirementForPoi
      });

      setShowPoiModal(false);
      setSelectedRequirementForPoi(null);
      setNewPoi({
        type: 'text',
        content: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add POI');
    }
  };

  const handlePoiClick = (requirementId: string) => {
    const poi = pois[requirementId];
    if (poi) {
      setSelectedPoiForView(poi);
      setShowPoiViewModal(true);
    } else {
      setSelectedRequirementForPoi(requirementId);
      setShowPoiModal(true);
    }
  };

  const calculateStats = () => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;

    functions.forEach(func => {
      func.categories.forEach(cat => {
        cat.subcategories.forEach(subcat => {
          const requirements = getRequirementsForLevel(subcat.requirements, user?.cyfunLevel);
          requirements.forEach(req => {
            if (!showKeyMeasuresOnly || req.isKeyMeasure) {
              total++;
              const status = getStatusForRequirement(req.id, controlStatuses, user?.id);
              if (status === 'completed') completed++;
              else if (status === 'in-progress') inProgress++;
            }
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

  const filterRequirements = (requirements: Requirement[]): Requirement[] => {
    let filtered = requirements;
    
    // Apply key measures filter first
    if (showKeyMeasuresOnly) {
      filtered = filtered.filter(req => req.isKeyMeasure);
    }
    
    // Then apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => {
        const status = getStatusForRequirement(req.id, controlStatuses, user?.id);
        return status === statusFilter;
      });
    }
    
    return filtered;
  };

  const updateMaturityLevel = async (requirementId: string, type: 'documentation' | 'implementation', level: number) => {
    if (isReadOnly) {
      setError('Cannot update maturity level in read-only mode');
      return;
    }
    
    if (!user?.id) return;
    
    try {
      const currentScore = maturityScores[requirementId] || { documentation: 1, implementation: 1 };
      const newScore = {
        ...currentScore,
        [type]: level
      };

      const response = await fetch('/api/maturity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requirementId, 
          scores: newScore,
          userId: user.id 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update maturity level');
      }
      
      // Mettre à jour localement
      setMaturityScores(prev => ({
        ...prev,
        [requirementId]: newScore
      }));
      
      addNotification({
        type: 'status',
        title: 'Maturity Level Updated',
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} maturity level for ${requirementId} has been updated to ${level}`,
        controlId: requirementId
      });
      
      // Fermer le modal
      setShowMaturityModal(false);
      setSelectedRequirementForMaturity(null);
    } catch (error) {
      console.error('Error updating maturity level:', error);
      setError(error instanceof Error ? error.message : 'Failed to update maturity level');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="flex items-center space-x-4">
              {/* Key Measures Filter */}
              <button
                onClick={() => setShowKeyMeasuresOnly(!showKeyMeasuresOnly)}
                className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                  showKeyMeasuresOnly
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Star className="h-4 w-4 mr-2" />
                Key Measures Only
              </button>
              
              {/* Status Filter */}
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
                  const requirements = getRequirementsForLevel(subcat.requirements, user?.cyfunLevel);
                  if (filterRequirements(requirements).length > 0) {
                    hasFilteredRequirements = true;
                  }
                });
              });

              if (!hasFilteredRequirements) return null;

              return (
                <div key={func.id} className="tree-parent">
                  <button
                    onClick={() => setExpandedFunction(expandedFunction === func.id ? null : func.id)}
                    className="w-full bg-white p-4 rounded-lg shadow flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <CircularProgress percentage={calculateFunctionCompletion(func, controlStatuses, user?.id, user?.cyfunLevel)} />
                      <h3 className="text-lg font-medium text-gray-900">
                        {func.name} ({func.id}) <span className="text-sm text-gray-500">({countCategories(func)} categories)</span>
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
                          const requirements = getRequirementsForLevel(subcat.requirements, user?.cyfunLevel);
                          if (filterRequirements(requirements).length > 0) {
                            categoryHasFilteredRequirements = true;
                          }
                        });

                        if (!categoryHasFilteredRequirements) return null;

                        return (
                          <div key={cat.id} className={`tree-line ${catIndex === func.categories.length - 1 ? 'last-child' : ''}`}>
                            <button
                              onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                              className="w-full bg-white p-3 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-50 border border-gray-200"
                            >
                              <div className="flex items-center">
                                <CircularProgress percentage={calculateCategoryCompletion(cat, controlStatuses, user?.id, user?.cyfunLevel)} />
                                <h4 className="text-md font-medium text-gray-800">
                                  {cat.name} ({cat.id}) <span className="text-sm text-gray-500">({countSubcategories(cat)} subcategories)</span>
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
                                  const requirements = getRequirementsForLevel(subcat.requirements, user?.cyfunLevel);
                                  const filteredRequirements = filterRequirements(requirements);

                                  if (filteredRequirements.length === 0) return null;

                                  return (
                                    <div key={subcat.id} className={`tree-line ${subcatIndex === cat.subcategories.length - 1 ? 'last-child' : ''}`}>
                                      <button
                                        onClick={() => setExpandedSubcategory(expandedSubcategory === subcat.id ? null : subcat.id)}
                                        className="w-full bg-white p-3 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-50 border border-gray-200"
                                      >
                                        <div className="flex items-center">
                                          <CircularProgress percentage={calculateSubcategoryCompletion(subcat, controlStatuses, user?.id, user?.cyfunLevel)} />
                                          <h5 className="text-sm font-medium text-gray-800">
                                            {subcat.id}: {subcat.title} <span className="text-sm text-gray-500">({countRequirements(subcat, user?.cyfunLevel)} requirements)</span>
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
                                                className={`p-2 rounded-lg shadow-sm border ${
                                                  getStatusColor(getStatusForRequirement(req.id, controlStatuses, user?.id))
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-1">
                                                      <h4 className="text-sm font-medium">{req.id}</h4>
                                                      {req.isKeyMeasure && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                          <Star className="h-3 w-3 mr-0.5" />
                                                          Key Measure
                                                        </span>
                                                      )}
                                                      <button
                                                        onClick={() => setSelectedRequirement(selectedRequirement?.id === req.id ? null : req)}
                                                        className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                                                      >
                                                        <Info className="h-3.5 w-3.5" />
                                                      </button>
                                                    </div>
                                                    <p className="text-xs opacity-90">{req.title}</p>
                                                  </div>
                                                  <div className="flex items-center gap-1">
                                                    {getStatusForRequirement(req.id, controlStatuses, user?.id) === 'completed' && (
                                                      <button
                                                        onClick={() => handlePoiClick(req.id)}
                                                        className="p-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                                                        title={pois[req.id] ? "View Proof of Implementation" : "Add Proof of Implementation"}
                                                      >
                                                        {pois[req.id] ? (
                                                          <div className="relative">
                                                            <FileText className="h-4 w-4 text-green-600" />
                                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                                          </div>
                                                        ) : (
                                                          <FileText className="h-4 w-4" />
                                                        )}
                                                      </button>
                                                    )}
                                                    {getStatusForRequirement(req.id, controlStatuses, user?.id) === 'in-progress' && (
                                                      <button
                                                        onClick={() => {
                                                          setSelectedRequirementForDeadline(req.id);
                                                          setShowDeadlineModal(true);
                                                        }}
                                                        className="p-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                                                        title="Set deadline"
                                                      >
                                                        <Clock className="h-4 w-4" />
                                                      </button>
                                                    )}
                                                    {/* Bouton Maturity */}
                                                    <button
                                                      onClick={() => {
                                                        setSelectedRequirementForMaturity(req.id);
                                                        setSelectedMaturityType('documentation');
                                                        setSelectedMaturityLevel(maturityScores[req.id]?.documentation || 1);
                                                        setShowMaturityModal(true);
                                                      }}
                                                      className="p-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                                                      title="Set maturity level"
                                                      disabled={isReadOnly}
                                                    >
                                                      <div className="relative">
                                                        <BarChart3 className="h-4 w-4" />
                                                        {maturityScores[req.id] && (
                                                          <div className="absolute -top-1 -right-1 flex">
                                                            <div 
                                                              className={`w-2 h-2 rounded-full mr-0.5 ${
                                                                maturityScores[req.id].documentation === 1 
                                                                  ? 'bg-red-500' 
                                                                  : maturityScores[req.id].documentation === 2 
                                                                    ? 'bg-yellow-500' 
                                                                    : 'bg-blue-500'
                                                              }`} 
                                                              title={`Documentation: ${maturityScores[req.id].documentation}/5`}
                                                            />
                                                            <div 
                                                              className={`w-2 h-2 rounded-full ${
                                                                maturityScores[req.id].implementation === 1 
                                                                  ? 'bg-red-500' 
                                                                  : maturityScores[req.id].implementation === 2 
                                                                    ? 'bg-yellow-500' 
                                                                    : 'bg-green-500'
                                                              }`} 
                                                              title={`Implementation: ${maturityScores[req.id].implementation}/5`}
                                                            />
                                                          </div>
                                                        )}
                                                      </div>
                                                    </button>
                                                    <select
                                                      value={getStatusForRequirement(req.id, controlStatuses, user?.id)}
                                                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                                      disabled={isReadOnly}
                                                      className={`rounded-md border py-1 pl-2 pr-7 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${getStatusColor(getStatusForRequirement(req.id, controlStatuses, user?.id))} ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Deadline Modal */}
      {showDeadlineModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Set Deadline</h3>
              <button
                onClick={() => setShowDeadlineModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  id="due-date"
                  value={newDeadline.dueDate}
                  onChange={(e) => setNewDeadline(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  value={newDeadline.priority}
                  onChange={(e) => setNewDeadline(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newDeadline.description}
                  onChange={(e) => setNewDeadline(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeadlineModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDeadline}
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Set Deadline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POI Modal */}
      {showPoiModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Proof of Implementation</h3>
              <button
                onClick={() => setShowPoiModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="poi-type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="poi-type"
                  value={newPoi.type}
                  onChange={(e) => setNewPoi(prev => ({ ...prev, type: e.target.value as 'text' | 'image' | 'link' }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="text">Text</option>
                  <option value="link">Link</option>
                </select>
              </div>
              <div>
                <label htmlFor="poi-content" className="block text-sm font-medium text-gray-700">
                  {newPoi.type === 'text' ? 'Description' : 'URL'}
                </label>
                {newPoi.type === 'text' ? (
                  <textarea
                    id="poi-content"
                    value={newPoi.content}
                    onChange={(e) => setNewPoi(prev => ({ ...prev, content: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                ) : (
                  <input
                    type="url"
                    id="poi-content"
                    value={newPoi.content}
                    onChange={(e) => setNewPoi(prev => ({ ...prev, content: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPoiModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPoi}
                  className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add POI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POI View Modal */}
      {showPoiViewModal && selectedPoiForView && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Proof of Implementation</h3>
              <button
                onClick={() => {
                  setShowPoiViewModal(false);
                  setSelectedPoiForView(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{selectedPoiForView.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                {selectedPoiForView.type === 'link' ? (
                  <a
                    href={selectedPoiForView.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Open Link
                  </a>
                ) : selectedPoiForView.type === 'image' ? (
                  <div className="mt-1">
                    <img
                      src={selectedPoiForView.content}
                      alt="Proof of Implementation"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedPoiForView.content}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Added
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(selectedPoiForView.createdAt), 'PPpp')}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowPoiViewModal(false);
                    setSelectedPoiForView(null);
                  }}
                  className="px-4 py-2 bg-gray-100 border border-transparent rounded-md text-sm font-medium text-gray-900 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requirement Details Modal */}
      {selectedRequirement && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Requirement Details</h3>
              <button
                onClick={() => setSelectedRequirement(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">ID</h4>
                <p className="mt-1">{selectedRequirement.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Title</h4>
                <p className="mt-1">{selectedRequirement.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Description</h4>
                <p className="mt-1">{selectedRequirement.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">CyFun Level</h4>
                <p className="mt-1 capitalize">{selectedRequirement.cyfunLevel}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Guidance</h4>
                <ul className="mt-1 list-disc pl-5 space-y-1">
                  {selectedRequirement.guidance.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">References</h4>
                <ul className="mt-1 space-y-1">
                  {selectedRequirement.references.map((ref, index) => (
                    <li key={index} className="text-sm">
                      {ref.name} - {ref.clause}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maturity Modal */}
      {showMaturityModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Set Maturity Level</h3>
              <button
                onClick={() => setShowMaturityModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select maturity level for <span className="font-medium">{selectedRequirementForMaturity}</span></p>
              
              {/* Tabs for Documentation / Implementation */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => {
                    setSelectedMaturityType('documentation');
                    setSelectedMaturityLevel(maturityScores[selectedRequirementForMaturity]?.documentation || 1);
                  }}
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedMaturityType === 'documentation'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedMaturityType('implementation');
                    setSelectedMaturityLevel(maturityScores[selectedRequirementForMaturity]?.implementation || 1);
                  }}
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedMaturityType === 'implementation'
                      ? 'text-green-600 border-b-2 border-green-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Cog className="w-4 h-4 mr-2" />
                    Implementation
                  </div>
                </button>
              </div>
              
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={`maturity-${level}`}
                    onClick={() => setSelectedMaturityLevel(level)}
                    className={`w-10 h-10 flex items-center justify-center text-sm rounded-full transition-colors ${
                      selectedMaturityLevel === level 
                        ? selectedMaturityType === 'documentation'
                          ? level === 1 
                              ? 'bg-red-500 text-white' 
                              : level === 2 
                                  ? 'bg-yellow-500 text-white' 
                                  : 'bg-blue-500 text-white'
                          : level === 1 
                              ? 'bg-red-500 text-white' 
                              : level === 2 
                                  ? 'bg-yellow-500 text-white' 
                                  : 'bg-green-500 text-white'
                        : level === 1 
                            ? 'bg-gray-200 text-gray-600 hover:bg-red-300' 
                            : level === 2 
                                ? 'bg-gray-200 text-gray-600 hover:bg-yellow-300' 
                                : 'bg-gray-200 text-gray-600 hover:bg-green-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p className="font-medium">{selectedMaturityType === 'documentation' ? 'Documentation' : 'Implementation'} Maturity Levels:</p>
                
                {selectedMaturityType === 'documentation' ? (
                  <>
                    <p>1: Initial - No process documentation or not formally approved</p>
                    <p>2: Repeatable - Documentation exists but not reviewed recently</p>
                    <p>3: Defined - Approved documentation with few exceptions (&lt;5%)</p>
                    <p>4: Managed - Well-defined documentation with minimal exceptions (&lt;3%)</p>
                    <p>5: Optimizing - Continuously improved documentation (&lt;0.5% exceptions)</p>
                  </>
                ) : (
                  <>
                    <p>1: Initial - Standard process does not exist</p>
                    <p>2: Repeatable - Ad-hoc process exists, done informally</p>
                    <p>3: Defined - Formal process with evidence for most activities</p>
                    <p>4: Managed - Formal process with metrics and minimal exceptions</p>
                    <p>5: Optimizing - Consistently improving processes with near-perfect adherence</p>
                  </>
                )}
              </div>
              
              {/* Current maturity scores */}
              {selectedRequirementForMaturity && maturityScores[selectedRequirementForMaturity] && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Current Scores:</p>
                  <div className="flex justify-between">
                    <span>Documentation: {maturityScores[selectedRequirementForMaturity].documentation}/5</span>
                    <span>Implementation: {maturityScores[selectedRequirementForMaturity].implementation}/5</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowMaturityModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedRequirementForMaturity && updateMaturityLevel(selectedRequirementForMaturity, selectedMaturityType, selectedMaturityLevel)}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}