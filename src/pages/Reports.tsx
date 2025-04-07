import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, File as FilePdf, FileText, ChevronLeft, Download, Filter, Star, PieChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { functions } from '../data/functions';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import type { POI, Function, Category, Subcategory, Requirement } from '../types';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CSVLink } from 'react-csv';

type StatusFilter = 'all' | 'pending' | 'in-progress' | 'completed';

interface ControlStatus {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  isKeyMeasure: boolean;
  references: string[];
  hasPoi: boolean;
  poiContent?: string;
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
        req.cyfunLevel === 'basic' || req.cyfunLevel === 'important'
      );
    case 'basic':
    default:
      return requirements.filter(req => 
        req.cyfunLevel === 'basic'
      );
  }
}

// Fonctions de comptage
function countRequirements(func: Function, cyfunLevel?: string): number {
  let count = 0;
  func.categories.forEach(cat => {
    cat.subcategories.forEach(subcat => {
      count += getRequirementsForLevel(subcat.requirements, cyfunLevel).length;
    });
  });
  return count;
}

function countCompletedRequirements(func: Function, controlStatuses: Record<string, { userStatuses: Record<string, string> }>, userId?: string, cyfunLevel?: string): number {
  let completed = 0;
  func.categories.forEach(cat => {
    cat.subcategories.forEach(subcat => {
      const requirements = getRequirementsForLevel(subcat.requirements, cyfunLevel);
      requirements.forEach(req => {
        const status = getStatusForRequirementFunction(req.id, controlStatuses, userId);
        if (status === 'completed') {
          completed++;
        }
      });
    });
  });
  return completed;
}

function getStatusForRequirementFunction(reqId: string, controlStatuses: Record<string, { userStatuses: Record<string, string> }>, userId?: string): string {
  if (!userId) return 'pending';
  
  // Check specific requirement status first
  const reqStatus = controlStatuses[reqId]?.userStatuses[userId];
  if (reqStatus) return reqStatus;
  
  // If no specific status, check parent control status
  const parentControlId = reqId.split('.').slice(0, -1).join('.');
  return controlStatuses[parentControlId]?.userStatuses[userId] || 'pending';
}

function Reports() {
  const { user } = useAuth();
  const [controlStatuses, setControlStatuses] = useState<Record<string, { userStatuses: Record<string, string> }>>({});
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const [pois, setPois] = useState<Record<string, POI>>({});
  const [showChart, setShowChart] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(user?.cyfunLevel || 'basic');
  const [reportData, setReportData] = useState<any[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusResponse = await fetch('/api/controls');
        if (!statusResponse.ok) {
          throw new Error('Failed to fetch controls');
        }
        const statusData = await statusResponse.json();
        setControlStatuses(statusData.controls || {});

        const poisResponse = await fetch('/api/pois');
        if (!poisResponse.ok) {
          throw new Error('Failed to fetch POIs');
        }
        const poisData = await poisResponse.json();
        const poisMap: Record<string, POI> = {};
        poisData.pois.forEach((poi: POI) => {
          poisMap[poi.controlId] = poi;
        });
        setPois(poisMap);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user?.cyfunLevel) {
      setCurrentLevel(user.cyfunLevel);
    }
  }, [user]);

  useEffect(() => {
    if (user && Object.keys(controlStatuses).length > 0) {
      generateReportData();
    }
  }, [user, controlStatuses, currentLevel]);

  const getStatusForRequirement = (reqId: string, userId?: string): string => {
    if (!userId) return 'pending';
    
    // Check specific requirement status first
    const reqStatus = controlStatuses[reqId]?.userStatuses[userId];
    if (reqStatus) return reqStatus;
    
    // If no specific status, check parent control status
    const parentControlId = reqId.split('.').slice(0, -1).join('.');
    return controlStatuses[parentControlId]?.userStatuses[userId] || 'pending';
  };

  const getFilteredControls = (): ControlStatus[] => {
    if (!user) return [];

    // Get all requirements that match the user's level
    const allRequirements: Requirement[] = [];
    functions.forEach(func => {
      func.categories.forEach(cat => {
        cat.subcategories.forEach(subcat => {
          const levelRequirements = getRequirementsForLevel(subcat.requirements, currentLevel);
          allRequirements.push(...levelRequirements);
        });
      });
    });

    // Filter based on status if needed
    const filteredRequirements = statusFilter === 'all' 
      ? allRequirements
      : allRequirements.filter(req => getStatusForRequirement(req.id, user.id) === statusFilter);

    // Map to control status objects
    return filteredRequirements.map(req => {
      const category = functions
        .flatMap(f => f.categories)
        .find(cat => cat.subcategories.some(sub => 
          sub.requirements.some(r => r.id === req.id)
        ))?.name || '';

      const poi = pois[req.id];
      const status = getStatusForRequirement(req.id, user.id);

      return {
        id: req.id,
        title: req.title,
        category,
        description: req.description,
        status,
        isKeyMeasure: req.isKeyMeasure || false,
        references: req.references?.map(ref => `${ref.name}${ref.clause ? `, ${ref.clause}` : ''}`),
        hasPoi: Boolean(poi),
        poiContent: poi?.content
      };
    });
  };

  const exportToExcel = () => {
    const controls = getFilteredControls();
    const worksheet = XLSX.utils.json_to_sheet(controls.map(control => ({
      'Control ID': control.id,
      'Category': control.category,
      'Title': control.title,
      'Description': control.description,
      'Status': control.status,
      'Key Measure': control.isKeyMeasure ? 'Yes' : 'No',
      'Has Proof of Implementation': control.hasPoi ? 'Yes' : 'No',
      'Proof of Implementation': control.status === 'completed' && control.poiContent ? control.poiContent : '',
      'References': control.references.join('; '),
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Controls');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, `cyfun-controls-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const controls = getFilteredControls();
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('CyFun Controls Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Company: ${user?.companyName}`, 20, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Security Level: CyFun ${user?.cyfunLevel}`, 20, 50);
    
    let y = 70;
    controls.forEach((control) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`${control.id} - ${control.title}`, 20, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.text(`Category: ${control.category}`, 25, y);
      y += 7;
      
      doc.text(`Status: ${control.status}`, 25, y);
      y += 7;
      
      if (control.isKeyMeasure) {
        doc.text('Key Measure: Yes', 25, y);
        y += 7;
      }

      if (control.status === 'completed' && control.hasPoi) {
        const poiContent = control.poiContent || '';
        const contentLines = doc.splitTextToSize(
          `Proof of Implementation: ${poiContent}`,
          160
        );
        contentLines.forEach(line => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 25, y);
          y += 7;
        });
      }
      
      y += 10;
    });
    
    doc.save(`cyfun-controls-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToCSV = () => {
    const controls = getFilteredControls();
    const csvContent = [
      ['Control ID', 'Category', 'Title', 'Description', 'Status', 'Key Measure', 'Has Proof of Implementation', 'Proof of Implementation', 'References'],
      ...controls.map(control => [
        control.id,
        control.category,
        control.title,
        control.description,
        control.status,
        control.isKeyMeasure ? 'Yes' : 'No',
        control.hasPoi ? 'Yes' : 'No',
        control.status === 'completed' && control.poiContent ? control.poiContent : '',
        control.references.join('; '),
      ])
    ]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `cyfun-controls-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateReportData = () => {
    const data = functions.map(func => {
      const categories = func.categories.map(cat => {
        const subcategories = cat.subcategories.map(subcat => {
          const requirements = getRequirementsForLevel(subcat.requirements, currentLevel).map(req => {
            const status = getStatusForRequirement(req.id, user?.id);
            return {
              ...req,
              status
            };
          });
          
          return {
            ...subcat,
            requirements
          };
        }).filter(subcat => subcat.requirements.length > 0);
        
        return {
          ...cat,
          subcategories
        };
      }).filter(cat => cat.subcategories.length > 0);
      
      const totalReqs = countRequirements(func, currentLevel);
      const completedReqs = countCompletedRequirements(func, controlStatuses, user?.id, currentLevel);
      const completion = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;
      
      return {
        ...func,
        categories,
        completion,
        totalReqs,
        completedReqs
      };
    }).filter(func => func.categories.length > 0);
    
    setReportData(data);
    
    // Generate CSV data
    const csv: any[] = [];
    data.forEach(func => {
      func.categories.forEach(cat => {
        cat.subcategories.forEach(subcat => {
          subcat.requirements.forEach(req => {
            csv.push({
              Function: func.name,
              'Function ID': func.id,
              Category: cat.name,
              'Category ID': cat.id,
              Subcategory: subcat.title,
              'Subcategory ID': subcat.id,
              Requirement: req.title,
              'Requirement ID': req.id,
              Status: req.status,
              'CyFun Level': req.cyfunLevel
            });
          });
        });
      });
    });
    
    setCsvData(csv);
  };

  const chartData = {
    labels: functions.map(f => f.name),
    datasets: [
      {
        label: 'Completion Percentage',
        data: reportData.map(f => f.completion),
        backgroundColor: [
          '#4BC0C0', '#FF6384', '#FFCE56', '#36A2EB', '#9966FF', '#FF9F40'
        ]
      }
    ]
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  const stats = {
    // Total des requirements pour le niveau actuel
    total: reportData.reduce((acc, func) => acc + func.totalReqs, 0),
    
    // Nombre de requirements complétés
    completed: reportData.reduce((acc, func) => acc + func.completedReqs, 0),
    
    // Nombre de requirements en cours
    inProgress: (() => {
      let count = 0;
      reportData.forEach(func => {
        func.categories.forEach(cat => {
          cat.subcategories.forEach(subcat => {
            subcat.requirements.forEach(req => {
              if (req.status === 'in-progress') {
                count++;
              }
            });
          });
        });
      });
      return count;
    })(),
    
    // Nombre de requirements en attente
    pending: (() => {
      let count = 0;
      reportData.forEach(func => {
        func.categories.forEach(cat => {
          cat.subcategories.forEach(subcat => {
            subcat.requirements.forEach(req => {
              if (req.status === 'pending') {
                count++;
              }
            });
          });
        });
      });
      return count;
    })()
  };

  const filteredControls = getFilteredControls();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
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

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Controls Report</h2>
              <div className="flex space-x-4">
                <button
                  onClick={exportToExcel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
                  Export to Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FilePdf className="h-5 w-5 mr-2 text-red-600" />
                  Export to PDF
                </button>
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Export to CSV
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">Total Requirements</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">Completed Requirements</div>
                <div className="mt-1 text-2xl font-semibold text-green-600">{stats.completed}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">Requirements In Progress</div>
                <div className="mt-1 text-2xl font-semibold text-yellow-600">{stats.inProgress}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">Pending Requirements</div>
                <div className="mt-1 text-2xl font-semibold text-red-600">{stats.pending}</div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Control ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key Measure
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proof of Implementation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredControls.map((control) => (
                    <tr key={control.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {control.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {control.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          {control.title}
                          {control.isKeyMeasure && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              <Star className="h-3 w-3 mr-0.5" />
                              Key Measure
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          control.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : control.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {control.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {control.isKeyMeasure ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {control.status === 'completed' && (
                          control.hasPoi ? (
                            <div className="relative inline-block" title={control.poiContent}>
                              <FileText className="h-5 w-5 text-green-600" />
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                            </div>
                          ) : (
                            <FileText className="h-5 w-5 text-gray-400" />
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">CyFun Requirements</h2>
            <select 
              value={currentLevel} 
              onChange={(e) => setCurrentLevel(e.target.value)}
              className="rounded-md border-gray-300 text-sm"
            >
              <option value="basic">Basic</option>
              <option value="important">Important</option>
              <option value="essential">Essential</option>
            </select>
          </div>

          {showChart && reportData.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Completion by Function</h3>
              <div className="max-w-md mx-auto">
                <Pie data={chartData} />
              </div>
            </div>
          )}

          <div className="space-y-8">
            {reportData.map(func => (
              <div key={func.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">{func.name} ({func.id})</h4>
                    <p className="text-sm text-gray-500">
                      {func.completedReqs} of {func.totalReqs} requirements completed ({func.completion}%)
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-blue-800 font-medium">{func.completion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;