import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, CheckCircle, XCircle, Shield, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/categories';

export default function Compliance() {
  const { user } = useAuth();
  const [controlStatuses, setControlStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching control statuses:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch controls');
        setLoading(false);
      }
    };

    if (user) {
      fetchControlStatuses();
    }
  }, [user]);

  const calculateComplianceScore = () => {
    const requiredControls = categories.flatMap(category =>
      category.controls.filter(control => control.cyfunLevel === user?.cyfunLevel)
    );

    const completedControls = requiredControls.filter(
      control => controlStatuses[control.id] === 'completed'
    );

    const score = (completedControls.length / requiredControls.length) * 100;
    return {
      score,
      completed: completedControls.length,
      total: requiredControls.length,
      isCompliant: score >= 85 // Assuming 85% is the threshold for compliance
    };
  };

  const getComplianceStatus = () => {
    const { score, isCompliant } = calculateComplianceScore();
    if (score >= 85) return { color: 'green', text: 'Compliant' };
    if (score >= 70) return { color: 'yellow', text: 'Near Compliance' };
    return { color: 'red', text: 'Non-Compliant' };
  };

  const getCategoryScore = (categoryName: string) => {
    const categoryControls = categories
      .find(c => c.name === categoryName)
      ?.controls.filter(control => control.cyfunLevel === user?.cyfunLevel) || [];

    const completedControls = categoryControls.filter(
      control => controlStatuses[control.id] === 'completed'
    );

    return {
      score: categoryControls.length ? (completedControls.length / categoryControls.length) * 100 : 0,
      completed: completedControls.length,
      total: categoryControls.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading compliance assessment...</div>
      </div>
    );
  }

  const complianceScore = calculateComplianceScore();
  const status = getComplianceStatus();

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
            <h2 className="text-xl font-semibold text-gray-800">Compliance Assessment</h2>
            <p className="mt-1 text-sm text-gray-500">
              CyFun {user?.cyfunLevel} Level Compliance Status
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Overall Compliance Score */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Overall Compliance Score</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {complianceScore.completed} of {complianceScore.total} controls completed
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    status.color === 'green' 
                      ? 'text-green-600' 
                      : status.color === 'yellow' 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                  }`}>
                    {Math.round(complianceScore.score)}%
                  </div>
                  <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    status.color === 'green'
                      ? 'bg-green-100 text-green-800'
                      : status.color === 'yellow'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {status.text}
                  </div>
                </div>
              </div>

              {/* Compliance Gauge */}
              <div className="mt-6">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      status.color === 'green'
                        ? 'bg-green-500'
                        : status.color === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, complianceScore.score)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>0%</span>
                  <span>Target: 85%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Category Breakdown</h3>
              {categories.map(category => {
                const categoryScore = getCategoryScore(category.name);
                const controls = category.controls.filter(
                  control => control.cyfunLevel === user?.cyfunLevel
                );

                if (controls.length === 0) return null;

                return (
                  <div key={category.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-900">{category.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {categoryScore.completed}/{categoryScore.total} Controls
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            categoryScore.score >= 85
                              ? 'bg-green-100 text-green-800'
                              : categoryScore.score >= 70
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {Math.round(categoryScore.score)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4">
                      <div className="space-y-3">
                        {controls.map(control => {
                          const status = controlStatuses[control.id] || 'pending';
                          return (
                            <div 
                              key={control.id}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center space-x-3">
                                {status === 'completed' ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : status === 'in-progress' ? (
                                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span className="text-sm text-gray-900">{control.id}</span>
                              </div>
                              <span className="text-sm text-gray-500">{control.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}