import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, File as FilePdf, FileText, ChevronLeft, Download, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/categories';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import type { POI } from '../types';

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

const getControlsForLevel = (level: 'basic' | 'important' | 'essential') => {
  switch (level) {
    case 'essential':
      return categories.flatMap(category =>
        category.controls.filter(control => 
          ['basic', 'important', 'essential'].includes(control.cyfunLevel)
        )
      );
    case 'important':
      return categories.flatMap(category =>
        category.controls.filter(control => 
          ['basic', 'important'].includes(control.cyfunLevel)
        )
      );
    case 'basic':
    default:
      return categories.flatMap(category =>
        category.controls.filter(control => 
          control.cyfunLevel === 'basic'
        )
      );
  }
};

function Reports() {
  const { user } = useAuth();
  const [controlStatuses, setControlStatuses] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const [pois, setPois] = useState<Record<string, POI>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusResponse = await fetch('/api/controls');
        if (!statusResponse.ok) {
          throw new Error('Failed to fetch controls');
        }
        const statusData = await statusResponse.json();
        const statuses: Record<string, string> = {};
        
        if (statusData.controls && typeof statusData.controls === 'object') {
          Object.entries(statusData.controls).forEach(([controlId, control]: [string, any]) => {
            if (control.userStatuses && user?.id && control.userStatuses[user.id]) {
              statuses[controlId] = control.userStatuses[user.id];
            }
          });
        }
        
        setControlStatuses(statuses);

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

  const getFilteredControls = (): ControlStatus[] => {
    if (!user) return [];

    const levelControls = getControlsForLevel(user.cyfunLevel);
    
    return levelControls
      .filter(control => {
        const status = controlStatuses[control.id] || 'pending';
        return statusFilter === 'all' || status === statusFilter;
      })
      .map(control => {
        const poi = pois[control.id];
        return {
          id: control.id,
          title: control.title,
          category: categories.find(cat => 
            cat.controls.some(c => c.id === control.id)
          )?.name || '',
          description: control.description,
          status: controlStatuses[control.id] || 'pending',
          isKeyMeasure: control.isKeyMeasure || false,
          references: control.references?.map(ref => `${ref.name}${ref.clause ? `, ${ref.clause}` : ''}`),
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  const filteredControls = getFilteredControls();
  const stats = {
    total: filteredControls.length,
    completed: filteredControls.filter(c => c.status === 'completed').length,
    inProgress: filteredControls.filter(c => c.status === 'in-progress').length,
    pending: filteredControls.filter(c => c.status === 'pending').length,
  };

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
                <div className="text-sm font-medium text-gray-500">Total Controls</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">Completed</div>
                <div className="mt-1 text-2xl font-semibold text-green-600">{stats.completed}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">In Progress</div>
                <div className="mt-1 text-2xl font-semibold text-yellow-600">{stats.inProgress}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500">Pending</div>
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
                        {control.title}
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
      </div>
    </div>
  );
}

export default Reports;