import React, { useState, useRef } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Button, CircularProgress, Box } from '@mui/material'
import { supabase } from '../lib/supabase'
import { SadPathData } from '../types/charts'
import EmailModal from './EmailModal'
import ConfirmOverwriteModal from './ConfirmOverwriteModal'
import { useSnackbar } from './SnackbarProvider'

// Generate dummy data for sad path analysis
const generateSadPathData = (): SadPathData[] => {
  return [
    {
      category: 'Customer Hostility',
      value: 25,
      subcategories: [
        { name: 'Verbal Agression', value: 25 }
      ]
    },
    {
      category: 'Unsupported Language',
      value: 30,
      subcategories: [
        { name: 'Assistant did not speak French', value: 15 },
        { name: 'Assistant did not speak Spanish', value: 15 }
      ]
    },
    {
      category: 'Caller Identification Issues',
      value: 45,
      subcategories: [
        { name: 'User refused to confirm identity', value: 15 },
        { name: 'Caller Identification', value: 15 },
        { name: 'Incorrect caller identity', value: 15 }
      ]
    }
  ]
}

const COLORS = {
  inner: ['#10b981', '#3b82f6', '#60a5fa'],
  outer: ['#34d399', '#93c5fd', '#dbeafe']
}

const SadPathChart: React.FC = () => {
  const [data, setData] = useState<SadPathData[]>(generateSadPathData())
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')
  const [previousData, setPreviousData] = useState<SadPathData[] | null>(null)
  const [customData, setCustomData] = useState<SadPathData[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const { showSnackbar } = useSnackbar()

  // Prepare data for inner ring
  const innerData = data.map(item => ({
    name: item.category,
    value: item.value
  }))

  // Prepare data for outer ring
  const outerData = data.flatMap((item, categoryIndex) =>
    item.subcategories.map(sub => ({
      name: sub.name,
      value: sub.value,
      category: item.category,
      categoryIndex
    }))
  )

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
      .eq('chart_type', 'sad_path')
      .single()

    if (existingData && existingData.chart_data) {
      setPreviousData(existingData.chart_data)
      setShowEmailModal(false)
      setShowConfirmModal(true)
    } else {
      setShowEmailModal(false)
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

  const handleSaveCustomData = async (newData: SadPathData[]) => {
    if (!userEmail) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('user_custom_values')
        .upsert({
          email: userEmail,
          chart_type: 'sad_path',
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

  const handleValueChange = (categoryIndex: number, subcategoryIndex: number | null, value: number) => {
    if (!customData) return
    
    const updated = [...customData]
    if (subcategoryIndex !== null) {
      updated[categoryIndex].subcategories[subcategoryIndex].value = value
      // Update category total
      updated[categoryIndex].value = updated[categoryIndex].subcategories.reduce(
        (sum, sub) => sum + sub.value, 0
      )
    } else {
      updated[categoryIndex].value = value
    }
    setCustomData(updated)
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Sad Path Analysis</h2>
        <button onClick={handleEditClick} className="edit-button">
          Edit Values
        </button>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={innerData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {innerData.map((entry, index) => (
              <Cell key={`inner-cell-${index}`} fill={COLORS.inner[index % COLORS.inner.length]} />
            ))}
          </Pie>
          <Pie
            data={outerData}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={130}
            outerRadius={180}
            fill="#82ca9d"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {outerData.map((entry, index) => (
              <Cell 
                key={`outer-cell-${index}`} 
                fill={COLORS.outer[entry.categoryIndex % COLORS.outer.length]} 
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {customData && (
        <div className="custom-data-editor" ref={editorRef}>
          <h3>Edit Custom Values</h3>
          <div className="sad-path-editor">
            {customData.map((category, catIndex) => (
              <div key={catIndex} className="category-section">
                <h4>{category.category}</h4>
                <div className="value-input">
                  <label>Category Total:</label>
                  <input
                    type="number"
                    value={category.value}
                    onChange={(e) => handleValueChange(catIndex, null, parseFloat(e.target.value) || 0)}
                  />%
                </div>
                <div className="subcategories">
                  {category.subcategories.map((sub, subIndex) => (
                    <div key={subIndex} className="subcategory-input">
                      <label>{sub.name}:</label>
                      <input
                        type="number"
                        value={sub.value}
                        onChange={(e) => handleValueChange(catIndex, subIndex, parseFloat(e.target.value) || 0)}
                      />%
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

export default SadPathChart

