'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ManualEntryFormProps {
  userId: string;
  selectedDate: string;
  onEntryAdded: () => void;
}

export default function ManualEntryForm({ userId, selectedDate, onEntryAdded }: ManualEntryFormProps) {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const durationInMinutes = parseFloat(duration) * 60;

      if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
        setError('Please enter a valid duration in hours (e.g., 2.5 for 2 hours 30 minutes)');
        setIsLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to add entries');
        setIsLoading(false);
        return;
      }

      const startTime = new Date(`${date}T00:00:00`);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60 * 1000);

      const { error: insertError } = await supabase
        .from('timesheet_entries')
        .insert({
          user_id: user.id,
          activity: description.trim(),
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration_minutes: Math.round(durationInMinutes),
          entry_date: date,
        });

      if (insertError) throw insertError;

      setDescription('');
      setDuration('');
      setDate(new Date().toISOString().split('T')[0]);
      
      onEntryAdded();
    } catch (err) {
      console.error('Error adding entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to add entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Manual Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you work on?"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hours)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2.5"
              step="0.25"
              min="0.25"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Entry'}
        </button>
      </form>
    </div>
  );
}