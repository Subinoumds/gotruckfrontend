import { useState, useRef, useEffect } from 'react'
import pageStyles from '../../styles/Connexion.module.css'
import filterStyles from '../../styles/GroupeBoutonDropdownPlatsDistanceSet.module.css'

const DistanceFilter = ({ onDistanceChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDistance, setSelectedDistance] = useState(null)
  const dropdownRef = useRef(null)

  const distances = [
    { label: 'Moins de 500m', value: 0.5 },
    { label: 'Entre 500m et 1km', value: 1 },
    { label: 'Entre 1km et 2km', value: 2 },
    { label: 'Entre 2km et 5km', value: 5 },
    { label: 'Plus de 5km', value: 10 }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSelect = (distance) => {
    setSelectedDistance(distance)
    setIsOpen(false)
    if (onDistanceChange) {
      onDistanceChange(distance ? distance.value : null)
    }
  }

  const handleReset = () => {
    setSelectedDistance(null)
    setIsOpen(false)
    if (onDistanceChange) {
      onDistanceChange(null)
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '270px', height: '40px' }}>
      {!isOpen ? (
        <div className={pageStyles.groupeBoutonDropdownCuisine} onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
          <div className={pageStyles.labelIcne}>
            <svg className={pageStyles.chefHatIcon} viewBox="0 0 16 16" fill="none" style={{ width: '16px', height: '16px' }}>
              <path d="M8 0C5.2 0 3 2.2 3 5c0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z" fill="#fffbf8" />
            </svg>
            <div className={pageStyles.inscription} style={{ flex: 1 }}>
              {selectedDistance ? selectedDistance.label : 'Distance'}
            </div>
            {selectedDistance && (
              <div 
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                style={{ 
                  width: '18px', 
                  height: '18px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '4px',
                  cursor: 'pointer'
                }}
              >
                <svg viewBox="0 0 12 12" fill="none" style={{ width: '10px', height: '10px' }}>
                  <path d="M2 2L10 10M10 2L2 10" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
          <svg className={pageStyles.chefHatIcon} viewBox="0 0 16 16" fill="none" style={{ width: '16px', height: '16px' }}>
            <path d="M6 4L10 8L6 12" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '270px', zIndex: 9999 }}>
          <div className={pageStyles.groupeBoutonDropdownCuisine} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer', borderRadius: '10px 10px 0 0' }}>
            <div className={pageStyles.labelIcne}>
              <svg className={pageStyles.chefHatIcon} viewBox="0 0 16 16" fill="none" style={{ width: '16px', height: '16px' }}>
                <path d="M8 0C5.2 0 3 2.2 3 5c0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z" fill="#fffbf8" />
              </svg>
              <div className={pageStyles.inscription}>Distance</div>
            </div>
            <svg className={pageStyles.chefHatIcon} viewBox="0 0 16 16" fill="none" style={{ width: '16px', height: '16px' }}>
              <path d="M4 6L8 10L12 6" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={filterStyles.labelParent}>
            {distances.map((dist, idx) => (
              <div key={idx} className={filterStyles.label} onClick={() => handleSelect(dist)} style={{ cursor: 'pointer' }}>
                <div className={filterStyles.cuisineAmricaine}>{dist.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DistanceFilter
