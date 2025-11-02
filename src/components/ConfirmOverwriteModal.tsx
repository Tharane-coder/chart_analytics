import React from 'react'

interface ConfirmOverwriteModalProps {
  onClose: () => void
  onConfirm: () => void
  previousData: any
}

const ConfirmOverwriteModal: React.FC<ConfirmOverwriteModalProps> = ({ 
  onClose, 
  onConfirm, 
  previousData 
}) => {
  const renderPreviousData = () => {
    if (Array.isArray(previousData)) {
      // For call duration data
      if (previousData[0]?.duration !== undefined) {
        return (
          <div className="previous-data-preview">
            <h4>Previous Call Duration Values:</h4>
            <div className="data-sample">
              {previousData.slice(0, 5).map((point: any, index: number) => (
                <div key={index} className="data-point">
                  Duration: {point.duration}s, Frequency: {point.frequency.toFixed(2)}
                </div>
              ))}
              {previousData.length > 5 && (
                <div className="data-more">... and {previousData.length - 5} more points</div>
              )}
            </div>
          </div>
        )
      }
      // For sad path data
      if (previousData[0]?.category) {
        return (
          <div className="previous-data-preview">
            <h4>Previous Sad Path Values:</h4>
            <div className="data-sample">
              {previousData.map((item: any, index: number) => (
                <div key={index} className="category-preview">
                  <strong>{item.category}:</strong> {item.value}%
                  {item.subcategories?.map((sub: any, subIndex: number) => (
                    <div key={subIndex} className="subcategory-preview">
                      &nbsp;&nbsp;{sub.name}: {sub.value}%
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )
      }
    }
    return <div>Previous data available</div>
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Overwrite Previous Values?</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="confirm-content">
          <p className="confirm-message">
            You have previously saved custom values for this chart. Do you want to overwrite them with new values?
          </p>
          {renderPreviousData()}
          <div className="form-actions">
            <button onClick={onConfirm} className="submit-button confirm-button">
              Yes, Overwrite
            </button>
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOverwriteModal

