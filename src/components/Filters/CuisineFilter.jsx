import { useState, useRef, useEffect } from 'react'
import pageStyles from '../../styles/Connexion.module.css'
import filterStyles from '../../styles/GroupeBoutonDropdownCuisineSet.module.css'

const CuisineFilter = ({ onCuisineChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const dropdownRef = useRef(null)

  const cuisines = [
    { label: 'Cuisine américaine', value: 'Burger' },
    { label: 'Cuisine antillaise', value: 'Traiteur Antillais' },
    { label: 'Cuisine asiatique', value: 'Asiatique' },
    { label: 'Cuisine française', value: 'Cuisine Française' },
    { label: 'Cuisine italienne', value: 'Italien' },
    { label: 'Cuisine locale', value: 'Local' },
    { label: 'Cuisine mexicaine', value: 'Mexicain' }
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

  const handleSelect = (cuisine) => {
    setSelectedCuisine(cuisine)
    setIsOpen(false)
    if (onCuisineChange) {
      onCuisineChange(cuisine ? cuisine.value : null)
    }
  }

  const handleReset = () => {
    setSelectedCuisine(null)
    setIsOpen(false)
    if (onCuisineChange) {
      onCuisineChange(null)
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '270px', height: '40px' }}>
      {!isOpen ? (
        <div className={pageStyles.groupeBoutonDropdownCuisine} onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
          <div className={pageStyles.labelIcne}>
            <svg className={pageStyles.chefHatIcon} viewBox="0 0 16 16" fill="none" style={{ width: '16px', height: '16px' }}>
              <path d="M8 2L3 6v6c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V6l-5-4z" fill="#fffbf8" />
            </svg>
            <div className={pageStyles.inscription} style={{ flex: 1 }}>
              {selectedCuisine ? selectedCuisine.label : 'Type de cuisine'}
            </div>
            {selectedCuisine && (
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
                <path d="M8 2L3 6v6c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V6l-5-4z" fill="#fffbf8" />
              </svg>
              <div className={pageStyles.inscription}>Type de cuisine</div>
            </div>
            <svg className={pageStyles.chefHatIcon} viewBox="0 0 16 16" fill="none" style={{ width: '16px', height: '16px' }}>
              <path d="M4 6L8 10L12 6" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={filterStyles.labelParent}>
            {cuisines.map((cuisine, idx) => (
              <div key={idx} className={filterStyles.label} onClick={() => handleSelect(cuisine)} style={{ cursor: 'pointer' }}>
                <div className={filterStyles.cuisineAmricaine}>{cuisine.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CuisineFilter
