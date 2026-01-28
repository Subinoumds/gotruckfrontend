import { useNavigate } from 'react-router-dom'
import styles from '../styles/SplashscreenSeConnecter.module.css'

const ComingSoonPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.splashscreenSeConnecter} style={{ justifyContent: 'center' }}>
      {/* Pattern d'icônes sur le fond */}
      <div className={styles.backgroundPattern} style={{ width: '100%' }}>
        {/* Rangée 1 */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '92%' }} />
        
        {/* Rangée 2 */}
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '11%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '29%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '47%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '65%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '83%' }} />
        
        {/* Rangée 3 */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '92%' }} />
        
        {/* Rangée 4 */}
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '11%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '29%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '47%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '65%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '83%' }} />
        
        {/* Rangée 5 */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '92%' }} />
        
        {/* Rangée 6 */}
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '11%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '29%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '47%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '65%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '83%' }} />
        
        {/* Rangée 7 */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '92%' }} />
        
        {/* Rangée 8 */}
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '11%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '29%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '47%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '65%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '83%' }} />
      </div>

      {/* Contenu central */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        backgroundColor: 'rgba(255, 251, 248, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        maxWidth: '500px',
        margin: '24px',
        textAlign: 'center'
      }}>
        <img src="/logo-header.png" alt="GoTruck" style={{ height: '45px', marginBottom: '32px' }} />
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#85031f',
          marginBottom: '16px',
          fontFamily: 'Poppins'
        }}>
          Bientôt disponible ! 🚀
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#6d6d6d',
          marginBottom: '32px',
          lineHeight: '1.6',
          fontFamily: 'Poppins'
        }}>
          La connexion avec Google et Facebook sera bientôt disponible.<br />
          En attendant, vous pouvez vous connecter avec votre email.
        </p>
        
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '9999px',
            backgroundColor: '#85031f',
            color: '#fffbf8',
            border: 'none',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Poppins',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#6d0219'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#85031f'}
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  )
}

export default ComingSoonPage
