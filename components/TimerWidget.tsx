'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { TimesheetEntry } from '@/lib/types/database'

interface TimerWidgetProps {
  userId: string
  selectedDate: string
  onTimerUpdate: () => void
}

export default function TimerWidget({ userId, selectedDate, onTimerUpdate }: TimerWidgetProps) {
  const supabase = createClient()
  const [isRunning, setIsRunning] = useState(false)
  const [activeEntry, setActiveEntry] = useState<TimesheetEntry | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [description, setDescription] = useState('')
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)

  useEffect(() => {
    checkActiveTimer()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && activeEntry) {
      interval = setInterval(() => {
        const startTime = new Date(activeEntry.start_time).getTime()
        const now = Date.now()
        setElapsedSeconds(Math.floor((now - startTime) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, activeEntry])

  const checkActiveTimer = async () => {
    // Check localStorage for an active timer
    const storedEntryId = localStorage.getItem('activeTimerEntryId')
    const storedDescription = localStorage.getItem('activeTimerDescription')

    if (storedEntryId) {
      const { data } = await supabase
        .from('timesheet_entries')
        .select('*')
        .eq('id', storedEntryId)
        .is('end_time', null)
        .single()

      if (data) {
        setActiveEntry(data)
        setActiveEntryId(data.id)
        setIsRunning(true)
        setDescription(storedDescription || data.activity)
        const startTime = new Date(data.start_time).getTime()
        const now = Date.now()
        setElapsedSeconds(Math.floor((now - startTime) / 1000))
      } else {
        // Entry no longer active, clean up
        localStorage.removeItem('activeTimerEntryId')
        localStorage.removeItem('activeTimerDescription')
      }
    }
  }

  const startTimer = async () => {
    if (!description.trim()) {
      alert('Please enter an activity description')
      return
    }

    const now = new Date()
    const startTime = now.toISOString()

    const { data, error } = await supabase
      .from('timesheet_entries')
      .insert({
        user_id: userId,
        activity: description,
        start_time: startTime,
        entry_date: selectedDate,
        duration_minutes: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error starting timer:', error)
      alert('Error starting timer')
    } else {
      setActiveEntry(data)
      setActiveEntryId(data.id)
      setIsRunning(true)
      setElapsedSeconds(0)
      // Store in localStorage to persist across refreshes
      localStorage.setItem('activeTimerEntryId', data.id)
      localStorage.setItem('activeTimerDescription', description)
    }
  }

  const stopTimer = async () => {
    if (!activeEntry) return

    const now = new Date()
    const endTime = now.toISOString()
    const startTime = new Date(activeEntry.start_time).getTime()
    const duration = Math.floor((now.getTime() - startTime) / 60000)

    const { error } = await supabase
      .from('timesheet_entries')
      .update({
        end_time: endTime,
        duration_minutes: duration,
      })
      .eq('id', activeEntry.id)

    if (error) {
      console.error('Error stopping timer:', error)
      alert('Error stopping timer')
    } else {
      setIsRunning(false)
      setActiveEntry(null)
      setActiveEntryId(null)
      setElapsedSeconds(0)
      setDescription('')
      localStorage.removeItem('activeTimerEntryId')
      localStorage.removeItem('activeTimerDescription')
      onTimerUpdate()
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Timer</h3>

      {!isRunning ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you working on?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 focus:border-transparent"
            />
          </div>
          <button
            onClick={startTimer}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Start Timer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Current Activity:</p>
            <p className="font-medium text-gray-900 mb-4">{description}</p>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">
                {formatTime(elapsedSeconds)}
              </div>
              <p className="text-sm text-gray-600">Elapsed Time</p>
            </div>
          </div>
          <button
            onClick={stopTimer}
            className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Stop Timer
          </button>
        </div>
      )}
    </div>
  )
}