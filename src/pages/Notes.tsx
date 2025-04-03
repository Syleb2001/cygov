import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Image, Send, Trash2, Edit2, X, Check, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/categories';
import type { Note } from '../types';

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedControl, setSelectedControl] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [controlStatuses, setControlStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchControlStatuses = async () => {
      try {
        const response = await fetch('/api/controls');
        if (!response.ok) {
          throw new Error('Failed to fetch controls');
        }
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
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
    if (selectedControl && user?.id) {
      fetchNotes();
    }
  }, [selectedControl, user?.id]);

  const fetchNotes = async () => {
    if (!selectedControl || !user?.id) return;

    try {
      const response = await fetch(`/api/notes?controlId=${selectedControl}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      
      const data = await response.json();
      const filteredNotes = data.notes.filter((note: Note) => 
        note.controlId === selectedControl && note.userId === user.id
      );
      setNotes(filteredNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    }
  };

  const handleAddNote = async () => {
    if (!selectedControl || !newNote.trim() || !user) return;

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          controlId: selectedControl,
          userId: user.id,
          companyId: user.companyName,
          content: newNote.trim(),
          attachments: []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add note');
      }

      const data = await response.json();
      setNotes(prev => [...prev, data.note]);
      setNewNote('');
      fetchNotes(); // Refresh notes after adding
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    }
  };

  const handleEditNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update note');
      }

      const data = await response.json();
      setNotes(prev => prev.map(note => 
        note.id === noteId ? data.note : note
      ));
      setEditingNoteId(null);
      setEditContent('');
      fetchNotes(); // Refresh notes after editing
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete note');
      }

      setNotes(prev => prev.filter(note => note.id !== noteId));
      fetchNotes(); // Refresh notes after deleting
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  // Get all controls that are in progress
  const inProgressControls = categories.flatMap(category =>
    category.controls.filter(control => {
      const status = controlStatuses[control.id] || 'pending';
      return status === 'in-progress';
    })
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newNote.trim()) {
        handleAddNote();
      }
    }
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
            <h2 className="text-xl font-semibold text-gray-800">Support Notes</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add notes and track progress for controls in progress
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls List */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Controls In Progress</h3>
                <div className="space-y-2">
                  {inProgressControls.length > 0 ? (
                    inProgressControls.map(control => (
                      <button
                        key={control.id}
                        onClick={() => setSelectedControl(control.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg border ${
                          selectedControl === control.id
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{control.id}</span>
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {control.title}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500">
                        No controls in progress. Mark some controls as "In Progress" from the dashboard to start adding notes.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div className="lg:col-span-2">
                {selectedControl ? (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {notes.map(note => (
                        <div
                          key={note.id}
                          className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                          {editingNoteId === note.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setEditingNoteId(null)}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleEditNote(note.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-900">{note.content}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(note.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => startEdit(note)}
                                    className="text-gray-400 hover:text-gray-500"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="text-red-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              {note.attachments.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {note.attachments.map((attachment, index) => (
                                    <img
                                      key={index}
                                      src={attachment}
                                      alt="Attachment"
                                      className="h-20 w-20 object-cover rounded-lg"
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Add a note..."
                            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <div className="mt-2 flex justify-between items-center">
                            <button
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Image className="h-4 w-4 mr-1" />
                              Add Image
                            </button>
                            <button
                              onClick={handleAddNote}
                              disabled={!newNote.trim()}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No control selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a control from the list to view and add notes
                    </p>
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