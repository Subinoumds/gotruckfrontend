import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Sidebar.module.css'

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      {/* Overlay sombre */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sheetheader}>
          <div className={styles.primitiveh2}>
            <div className={styles.menu}>Menu</div>
          </div>
          <div className={styles.primitivep}>
            <div className={styles.menuDeNavigation}>Menu de navigation principal</div>
          </div>
        </div>
        <div className={styles.header}>
          <div className={styles.navigation}>
            <div className={styles.link} onClick={() => { navigate('/'); onClose(); }} style={{ cursor: 'pointer' }}>
              <div className={styles.loremIpsum}>Accueil</div>
            </div>
            <div className={styles.link} onClick={() => { navigate('/favoris'); onClose(); }} style={{ cursor: 'pointer' }}>
              <div className={styles.loremIpsum}>Favoris</div>
            </div>
            <div className={styles.link}>
              <div className={styles.loremIpsum}>Contact</div>
            </div>
            <div className={styles.link}>
              <div className={styles.loremIpsum}>Services</div>
            </div>
          </div>
          <div className={styles.primitivediv} />
          <div className={styles.buttonParent}>
            <button className={styles.button} onClick={handleLogout}>
              <div className={styles.inscription}>Déconnexion</div>
            </button>
          </div>
        </div>
        <div className={styles.menuBurger} onClick={onClose}>
          <svg className={styles.calque1Icon} viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="#85031f" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </>
  )
}

export default Sidebar
