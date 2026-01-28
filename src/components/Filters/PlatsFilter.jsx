import { useState, useRef, useEffect } from 'react'
import pageStyles from '../../styles/Connexion.module.css'
import filterStyles from '../../styles/GroupeBoutonDropdownPlatsSet.module.css'

const PlatsFilter = ({ onPlatsChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlats, setSelectedPlats] = useState([])
  const dropdownRef = useRef(null)

  const plats = [
    'Burger/ Sandwich / Frites',
    'Pizza / Pâtes fraîches',
    'Tacos / Burritos',
    'Crêpe sucrée',
    'Galette bretonne'
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

  const handleToggle = (plat) => {
    const newSelected = selectedPlats.includes(plat)
      ? selectedPlats.filter(p => p !== plat)
      : [...selectedPlats, plat]
    setSelectedPlats(newSelected)
    if (onPlatsChange) {
      onPlatsChange(newSelected)
    }
  }

  const handleReset = () => {
    setSelectedPlats([])
    setIsOpen(false)
    if (onPlatsChange) {
      onPlatsChange([])
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '270px', height: '40px' }}>
      {!isOpen ? (
        <div className={pageStyles.groupeBoutonDropdownCuisine} onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
          <div className={pageStyles.labelIcne}>
            <svg className={pageStyles.chefHatIcon} viewBox="0 0 16 16" fill="none" style={{ width: '16px', height: '16px' }}>
              <path d="M7 3v6c0 .6.4 1 1 1h.5v5h1v-5H10c.6 0 1-.4 1-1V3M7 3v2M9 3v2M11 3v2M13 3c0 2 1 3 1 5s-.5 2-.5 2v5h1V3" stroke="#fffbf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className={pageStyles.inscription} style={{ flex: 1 }}>
              {selectedPlats.length > 0 ? `${selectedPlats.length} sélectionné(s)` : 'Type de plats'}
            </div>
            {selectedPlats.length > 0 && (
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
                <path d="M2 2L14 14M14 2L2 14" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className={pageStyles.inscription}>Type de plats</div>
            </div>
            <svg className={pageStyles.chefHatIcon} viewBox="0 0 16 16" fill="none" style={{ width: '16px', height: '16px' }}>
              <path d="M4 6L8 10L12 6" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={filterStyles.labelIcneParent}>
            {plats.map((plat, idx) => (
              <div key={idx} className={filterStyles.labelIcne3} onClick={() => handleToggle(plat)} style={{ cursor: 'pointer' }}>
                <div className={filterStyles.square} style={{
                  border: '1.5px solid #fffbf8',
                  borderRadius: '4px',
                  backgroundColor: selectedPlats.includes(plat) ? '#fffbf8' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedPlats.includes(plat) && (
                    <svg className={filterStyles.vectorIcon} viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#85031f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className={filterStyles.typeDePlats}>{plat}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlatsFilter
