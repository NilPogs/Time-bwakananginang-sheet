'use client'

import { createClient } from '@/lib/supabase/client'
import { TimesheetEntry, Profile } from '@/lib/types/database'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TimerWidget from './TimerWidget'
import ManualEntryForm from './ManualEntryForm'
import TimesheetList from './TimesheetList'
import ExportButton from './ExportButton'
import { User } from '@supabase/supabase-js'
import { exportToPDF } from '@/lib/utils/pdfExport'

interface DashboardProps {
  user: User
  profile: Profile | null
}

export default function Dashboard({ user, profile }: DashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [entries, setEntries] = useState<TimesheetEntry[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [totalHours, setTotalHours] = useState(0)

  // Date range export state
  const [rangeStartDate, setRangeStartDate] = useState(new Date().toISOString().split('T')[0])
  const [rangeEndDate, setRangeEndDate] = useState(new Date().toISOString().split('T')[0])
  const [isExportingRange, setIsExportingRange] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [selectedDate])

  const loadEntries = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('timesheet_entries')
      .select('*')
      .eq('entry_date', selectedDate)
      .order('start_time', { ascending: false })

    if (error) {
      console.error('Error loading entries:', error)
    } else {
      setEntries(data || [])
      calculateTotalHours(data || [])
    }
    setLoading(false)
  }

  const calculateTotalHours = (entries: TimesheetEntry[]) => {
    const total = entries.reduce((sum, entry) => {
      return sum + (entry.duration_minutes || 0)
    }, 0)
    setTotalHours(total / 60)
  }

  const handleExportRange = async () => {
    if (!rangeStartDate || !rangeEndDate) {
      alert('Please select both start and end dates')
      return
    }

    if (rangeStartDate > rangeEndDate) {
      alert('Start date must be before end date')
      return
    }

    setIsExportingRange(true)
    try {
      const { data, error } = await supabase
        .from('timesheet_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', rangeStartDate)
        .lte('entry_date', rangeEndDate)
        .order('entry_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error

      if (!data || data.length === 0) {
        alert('No entries found for the selected date range.')
        return
      }

      exportToPDF({
        entries: data,
        userName: profile?.full_name || 'User',
        startDate: rangeStartDate,
        endDate: rangeEndDate,
      })
    } catch (err) {
      console.error('Error exporting range:', err)
      alert('Failed to export. Please try again.')
    } finally {
      setIsExportingRange(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleEntryAdded = () => {
    loadEntries()
  }

  const handleEntryUpdated = () => {
    loadEntries()
  }

  const handleEntryDeleted = () => {
    loadEntries()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Amoa ning Timesheet</h1>
              <p className="text-sm text-gray-600">Welcome, {profile?.full_name || 'User'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Date Range Export Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm font-medium text-gray-700 whitespace-nowrap">Export Date Range:</p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={rangeStartDate}
              onChange={(e) => setRangeStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 focus:border-transparent text-gray-900 text-sm"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="date"
              value={rangeEndDate}
              onChange={(e) => setRangeEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 focus:border-transparent text-gray-900 text-sm"
            />
            <button
              onClick={handleExportRange}
              disabled={isExportingRange}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isExportingRange ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Entry Forms */}
          <div className="lg:col-span-1 space-y-6">
            <TimerWidget
              userId={user.id}
              selectedDate={selectedDate}
              onTimerUpdate={handleEntryAdded}
            />
            <ManualEntryForm
              userId={user.id}
              selectedDate={selectedDate}
              onEntryAdded={handleEntryAdded}
            />
          </div>

          {/* Right Column - Timesheet List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Timesheet Entries</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: <span className="font-medium">{totalHours.toFixed(2)} hours</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 focus:border-transparent text-gray-900"
                  />
                  <ExportButton
                    entries={entries}
                    userName={profile?.full_name || 'User'}
                    startDate={selectedDate}
                    endDate={selectedDate}
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="text-gray-600">Loading...</div>
                </div>
              ) : (
                <TimesheetList
                  entries={entries}
                  onEntryUpdated={handleEntryUpdated}
                  onEntryDeleted={handleEntryDeleted}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}