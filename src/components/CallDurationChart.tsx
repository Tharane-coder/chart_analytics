import React, { useState, useRef } from 'react'
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Button, CircularProgress, Box } from '@mui/material'
import { supabase } from '../lib/supabase'
import { CallDurationDataPoint } from '../types/charts'
import EmailModal from './EmailModal'
import ConfirmOverwriteModal from './ConfirmOverwriteModal'
import { useSnackbar } from './SnackbarProvider'

// Generate bell curve data
const generateBellCurveData = (): CallDurationDataPoint[] => {
  const data: CallDurationDataPoint[] = []
  const mean = 180 // Mean duration in seconds (3 minutes)
  const stdDev = 60 // Standard deviation
  
  for (let i = 0; i <= 600; i += 10) {
    const frequency = Math.exp(-Math.pow(i - mean, 2) / (2 * Math.pow(stdDev, 2))) * 100
    data.push({
      duration: i,
      frequency: Math.max(0, frequency)
    })
  }
  
  return data
}

const CallDurationChart: React.FC = () => {
  const [data, setData] = useState<CallDurationDataPoint[]>(generateBellCurveData())
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [previousData, setPreviousData] = useState<CallDurationDataPoint[] | null>(null)
  const [customData, setCustomData] = useState<CallDurationDataPoint[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const { showSnackbar } = useSnackbar()

  const handleEditClick = () => {
    setShowEmailModal(true)
  }

  const handleEmailSubmit = async (email: string) => {
    setUserEmail(email)
    
    // Check if user has previous custom values
    const { data: existingData, error } = await supabase
      .from('user_custom_values')
      .select('chart_data')
      .eq('email', email)
      .eq('chart_type', 'call_duration')
      .single()

    if (existingData && existingData.chart_data) {
      setPreviousData(existingData.chart_data)
      setShowEmailModal(false)
      setShowConfirmModal(true)
    } else {
      setShowEmailModal(false)
      // Show input form for custom values
      setCustomData(data)
      // Scroll to editor after state update
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  const handleConfirmOverwrite = () => {
    setShowConfirmModal(false)
    setCustomData(data)
    // Scroll to editor after state update
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleCancelOverwrite = () => {
    setShowConfirmModal(false)
    if (previousData) {
      setData(previousData)
      setCustomData(null)
    }
  }

  const handleSaveCustomData = async (newData: CallDurationDataPoint[]) => {
    if (!userEmail) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('user_custom_values')
        .upsert({
          email: userEmail,
          chart_type: 'call_duration',
          chart_data: newData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email,chart_type'
        })

      if (!error) {
        setData(newData)
        setCustomData(null)
        showSnackbar('Custom values saved successfully!', 'success')
      } else {
        showSnackbar('Error saving custom values: ' + error.message, 'error')
      }
    } catch (err: any) {
      showSnackbar('Error saving custom values: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDataChange = (index: number, field: 'duration' | 'frequency', value: number) => {
    if (!customData) return
    
    const updated = [...customData]
    updated[index] = { ...updated[index], [field]: value }
    setCustomData(updated)
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Call Duration Analysis</h2>
        <button onClick={handleEditClick} className="edit-button">
          Edit Values
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="duration" 
            label={{ value: 'Duration (seconds)', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis 
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Area
            type="monotone"
            dataKey="frequency"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorDuration)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {customData && (
        <div className="custom-data-editor" ref={editorRef}>
          <h3>Edit Custom Values</h3>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Duration (sec)</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {customData.slice(0, 20).map((point, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        value={point.duration}
                        onChange={(e) => handleDataChange(index, 'duration', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={point.frequency.toFixed(2)}
                        onChange={(e) => handleDataChange(index, 'frequency', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="editor-actions">
            <Button
              variant="contained"
              onClick={() => handleSaveCustomData(customData)}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' },
                minWidth: '140px'
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setCustomData(null)}
              disabled={isLoading}
              sx={{ minWidth: '100px' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
        />
      )}

      {showConfirmModal && previousData && (
        <ConfirmOverwriteModal
          onClose={handleCancelOverwrite}
          onConfirm={handleConfirmOverwrite}
          previousData={previousData}
        />
      )}
    </div>
  )
}

export default CallDurationChart

