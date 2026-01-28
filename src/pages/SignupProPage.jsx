import { useNavigate, useLocation } from 'react-router-dom'
import styles from '../styles/SignupSteps.module.css'

const SignupProPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const formData = location.state || {}

  const handleBack = () => {
    navigate('/signup', { state: formData })
  }

  return (
    <div className={styles.signupStepContainer}>
      {/* Logo en haut à gauche */}
      <div className={styles.logoContainer}>
        <img src="/logo-header.png" alt="GoTruck" className={styles.logo} style={{ filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Panneau de formulaire */}
      <div className={styles.formPanel} style={{ justifyContent: 'center', alignItems: 'center' }}>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '600px',
          gap: '24px'
        }}>
          <div style={{ fontSize: '80px' }}>🚚</div>
          
          <h1 className={styles.mainTitle} style={{ textAlign: 'center' }}>
            Inscription Professionnelle
          </h1>
          
          <h2 className={styles.subTitle} style={{ textAlign: 'center' }}>
            Bientôt disponible !
          </h2>
          
          <p style={{ 
            color: '#6d6d6d', 
            fontSize: '16px', 
            lineHeight: '1.6',
            margin: 0
          }}>
            L'inscription pour les propriétaires de Food Trucks sera bientôt disponible. 
            Tu pourras créer ton profil professionnel, ajouter tes Food Trucks, gérer tes emplacements 
            et bien plus encore !
          </p>
          
          <p style={{ 
            color: '#85031f', 
            fontSize: '16px', 
            fontWeight: 600,
            margin: 0
          }}>
            Reviens très vite pour découvrir toutes les fonctionnalités dédiées aux professionnels.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              type="button" 
              className={styles.btnBack} 
              onClick={handleBack}
            >
              <img src="/arrow-left.svg" alt="" className={styles.btnIcon} />
              Retour
            </button>
            
            <button 
              type="button" 
              className={styles.btnNext} 
              onClick={() => {
                // Désactiver l'option pro et continuer comme utilisateur normal
                navigate('/signup/step1', { state: { ...formData, is_professional: false, type_user: 'particulier' } })
              }}
            >
              Continuer en tant qu'utilisateur
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupProPage
