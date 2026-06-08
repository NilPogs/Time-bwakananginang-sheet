'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/types/database';

type TimesheetEntry = Database['public']['Tables']['timesheet_entries']['Row'];

interface TimesheetListProps {
  entries: TimesheetEntry[];
  onEntryUpdated: () => void;
  onEntryDeleted: () => void;
}

export default function TimesheetList({ entries, onEntryUpdated, onEntryDeleted }: TimesheetListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEdit = (entry: TimesheetEntry) => {
    if (!entry.end_time) {
      alert('Cannot edit an active timer. Please stop it first.');
      return;
    }

    setEditingId(entry.id);
    setEditDescription(entry.activity);

    const start = new Date(entry.start_time);
    const end = new Date(entry.end_time);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    setEditDuration(durationHours.toFixed(2));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDescription('');
    setEditDuration('');
  };

  const handleSaveEdit = async (entryId: string, originalStartTime: string) => {
    setIsSaving(true);
    try {
      const durationInMinutes = parseFloat(editDuration) * 60;

      if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
        alert('Please enter a valid duration');
        setIsSaving(false);
        return;
      }

      const startTime = new Date(originalStartTime);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60 * 1000);

      const { error } = await supabase
        .from('timesheet_entries')
        .update({
          activity: editDescription.trim(),
          end_time: endTime.toISOString(),
          duration_minutes: Math.round(durationInMinutes),
        })
        .eq('id', entryId);

      if (error) throw error;

      setEditingId(null);
      onEntryUpdated();
    } catch (err) {
      console.error('Error updating entry:', err);
      alert('Failed to update entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    setIsDeleting(entryId);
    try {
      const { error } = await supabase
        .from('timesheet_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      onEntryDeleted();
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete entry');
    } finally {
      setIsDeleting(null);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No timesheet entries yet. Start the timer or add a manual entry!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {entries.map((entry) => (
        <div key={entry.id} className="py-4 hover:bg-gray-50 transition-colors px-2">
          {editingId === entry.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-gray-900"
                placeholder="Description"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  step="0.25"
                  min="0.25"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-gray-900"
                  placeholder="Hours"
                />
                <button
                  onClick={() => handleSaveEdit(entry.id, entry.start_time)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{entry.activity}</p>
                <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{formatDate(entry.start_time)}</span>
                  <span>
                    {formatTime(entry.start_time)} - {entry.end_time ? formatTime(entry.end_time) : 'In Progress'}
                  </span>
                  {entry.end_time && (
                    <span className="font-medium text-blue-600">
                      {formatDuration(entry.start_time, entry.end_time)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(entry)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={isDeleting === entry.id}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {isDeleting === entry.id ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}