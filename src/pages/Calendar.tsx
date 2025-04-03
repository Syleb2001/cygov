import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import type { Deadline } from '../types';

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchDeadlines();
  }, [user]);

  const fetchDeadlines = async () => {
    try {
      const response = await fetch('/api/deadlines');
      if (!response.ok) throw new Error('Failed to fetch deadlines');
      
      const data = await response.json();
      // Filter deadlines for the current user's company
      const filteredDeadlines = data.deadlines.filter((deadline: Deadline) => 
        deadline.companyId === user?.companyName
      );
      setDeadlines(filteredDeadlines);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deadlines');
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getDeadlinesForDate = (date: Date) => {
    return deadlines.filter(deadline => 
      isSameDay(parseISO(deadline.dueDate), date)
    );
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

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
            <h2 className="text-xl font-semibold text-gray-800">Control Deadlines</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage deadlines for your controls
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="mx-4 text-xl font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="bg-white h-32" />
              ))}
              {daysInMonth.map((date) => {
                const dateDeadlines = getDeadlinesForDate(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`bg-white h-32 p-2 cursor-pointer border-t ${
                      isSelected
                        ? 'ring-2 ring-indigo-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          !isSameMonth(date, currentDate)
                            ? 'text-gray-400'
                            : isToday
                            ? 'text-indigo-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {format(date, 'd')}
                      </span>
                      {dateDeadlines.length > 0 && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs font-medium text-indigo-600">
                          {dateDeadlines.length}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dateDeadlines.slice(0, 2).map((deadline) => {
                        const dueDate = parseISO(deadline.dueDate);
                        const isOverdue = isAfter(new Date(), dueDate);
                        const isDueSoon = isBefore(new Date(), dueDate) && isAfter(new Date(), addDays(dueDate, -7));

                        return (
                          <div
                            key={deadline.id}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              isOverdue
                                ? 'bg-red-50 text-red-700'
                                : isDueSoon
                                ? 'bg-yellow-50 text-yellow-700'
                                : 'bg-green-50 text-green-700'
                            }`}
                          >
                            {deadline.controlId}
                          </div>
                        );
                      })}
                      {dateDeadlines.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dateDeadlines.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {Array.from({
                length: 6 - endOfMonth(currentDate).getDay()
              }).map((_, index) => (
                <div key={`empty-end-${index}`} className="bg-white h-32" />
              ))}
            </div>

            {selectedDate && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Deadlines for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <div className="space-y-3">
                  {getDeadlinesForDate(selectedDate).map(deadline => {
                    const dueDate = parseISO(deadline.dueDate);
                    const isOverdue = isAfter(new Date(), dueDate);
                    const isDueSoon = isBefore(new Date(), dueDate) && isAfter(new Date(), addDays(dueDate, -7));

                    return (
                      <div
                        key={deadline.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isOverdue
                            ? 'bg-red-50 border-red-200'
                            : isDueSoon
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-green-50 border-green-200'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{deadline.controlId}</h4>
                            {deadline.description && (
                              <p className="mt-1 text-sm text-gray-600">{deadline.description}</p>
                            )}
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">
                                Due {format(dueDate, 'h:mm a')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(deadline.priority)}`}>
                          {deadline.priority}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}