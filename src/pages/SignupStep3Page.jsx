import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/SignupSteps.module.css'

const SignupStep3Page = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuth()
  
  // Récupérer les données des étapes précédentes
  const initialData = location.state || {}
  
  const [formData, setFormData] = useState({
    newsletter: '',
    notifications_push: '',
    geolocalisation: '',
    camera: '',
    photos: '',
    ...initialData
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const options = [
    { value: '', label: 'Fais ton choix' },
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' }
  ]

  // Fonction pour demander les permissions du navigateur
  const requestBrowserPermission = async (permissionName) => {
    try {
      switch (permissionName) {
        case 'notifications_push':
          // Demander la permission pour les notifications
          if ('Notification' in window) {
            const result = await Notification.requestPermission()
            console.log('Notification permission:', result)
            if (result === 'denied') {
              alert('Tu as refusé les notifications. Tu peux les activer dans les paramètres de ton navigateur.')
            }
          }
          break
          
        case 'geolocalisation':
          // Demander la permission pour la géolocalisation
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log('Geolocation granted:', position.coords)
              },
              (error) => {
                console.log('Geolocation error:', error)
                if (error.code === error.PERMISSION_DENIED) {
                  alert('Tu as refusé la géolocalisation. Tu peux l\'activer dans les paramètres de ton navigateur.')
                }
              }
            )
          }
          break
          
        case 'camera':
          // Demander la permission pour la caméra
          if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true })
              console.log('Camera permission granted')
              // Arrêter le stream immédiatement après avoir obtenu la permission
              stream.getTracks().forEach(track => track.stop())
            } catch (err) {
              console.log('Camera permission error:', err)
              if (err.name === 'NotAllowedError') {
                alert('Tu as refusé l\'accès à la caméra. Tu peux l\'activer dans les paramètres de ton navigateur.')
              }
            }
          }
          break
          
        case 'photos':
          // Pour les photos, on utilise l'API File System Access si disponible
          // Sinon, la permission est généralement demandée au moment de l'utilisation
          if ('showOpenFilePicker' in window) {
            try {
              // Déclenche la demande de permission pour accéder aux fichiers
              await window.showOpenFilePicker({ 
                types: [{ 
                  description: 'Images', 
                  accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] } 
                }],
                multiple: false 
              })
              console.log('Photos permission granted')
            } catch (err) {
              // L'utilisateur a annulé ou refusé
              if (err.name !== 'AbortError') {
                console.log('Photos permission:', err)
              }
            }
          }
          break
          
        default:
          break
      }
    } catch (err) {
      console.error('Permission request error:', err)
    }
  }

  const handleChange = async (e) => {
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Si l'utilisateur sélectionne "Oui", demander la permission
    if (value === 'oui') {
      await requestBrowserPermission(name)
    }
  }

  const handleBack = () => {
    navigate('/signup/step2', { state: formData })
  }

  const handleFinish = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Préparer les données pour l'inscription
      const signupData = {
        email: formData.email,
        password: formData.password,
        nom: formData.nom,
        prenom: formData.prenom,
        tel: formData.tel || null,
        type_user: formData.type_user || 'particulier',
        date_naissance: formData.date_naissance,
        ville: formData.ville,
        code_postal: formData.code_postal,
        preferences_cuisine: formData.preferences_cuisine || [],
        distance_max: formData.distance_max || '10',
        notifications: formData.notifications !== false,
        // Autorisations
        newsletter: formData.newsletter === 'oui',
        notifications_push: formData.notifications_push === 'oui',
        geolocalisation: formData.geolocalisation === 'oui',
        camera: formData.camera === 'oui',
        photos: formData.photos === 'oui'
      }
      
      await signup(signupData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const permissions = [
    {
      name: 'newsletter',
      title: 'Souhaites-tu recevoir notre newsletter ?',
      description: 'Reste informé(e) des nouveaux Food Trucks, des événements gourmands près de chez toi, et de nos offres exclusives !'
    },
    {
      name: 'notifications_push',
      title: 'Souhaites-tu recevoir les notifications push ?',
      description: 'Reste informé(e) des nouveaux Food Trucks autour de toi, des promotions spéciales, et des événements à venir.'
    },
    {
      name: 'geolocalisation',
      title: 'Souhaites-tu activer la géolocalisation ?',
      description: 'Cela nous permettra de te montrer les Food Trucks les plus proches de ta position actuelle.'
    },
    {
      name: 'camera',
      title: 'Souhaites-tu autoriser Go Truck à accéder à ta caméra ?',
      description: 'Cela nous permettra de prendre des photos pour la publication de tes avis sur les Food Trucks fréquentés.'
    },
    {
      name: 'photos',
      title: 'Souhaites-tu autoriser Go Truck à accéder à tes photos ?',
      description: 'Cela te permettra d\'ajouter des photos lors de publication d\'avis sur les Food Trucks ou de partager tes moments préférés.'
    }
  ]

  return (
    <div className={styles.signupStepContainer}>
      {/* Logo en haut à gauche */}
      <div className={styles.logoContainer}>
        <img src="/logo-header.png" alt="GoTruck" className={styles.logo} style={{ filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Stepper (indicateur d'étapes) sur desktop */}
      <div className={styles.stepperContainer}>
        <div className={styles.stepWrapper}>
          <div className={`${styles.stepCircle} ${styles.completed}`}>1</div>
          <img src="/degoulinant.svg" alt="" className={styles.dripEffect} />
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.stepWrapper}>
          <div className={`${styles.stepCircle} ${styles.completed}`}>2</div>
          <img src="/degoulinant.svg" alt="" className={styles.dripEffect} />
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.stepWrapper}>
          <div className={`${styles.stepCircle} ${styles.active}`}>3</div>
        </div>
      </div>

      {/* Panneau de formulaire */}
      <div className={styles.formPanel}>
        {/* Stepper mobile */}
        <div className={styles.mobileStepperContainer}>
          <div className={styles.mobileStepCircle}>1</div>
          <div className={`${styles.mobileStepLine} ${styles.active}`}></div>
          <div className={styles.mobileStepCircle}>2</div>
          <div className={`${styles.mobileStepLine} ${styles.active}`}></div>
          <div className={styles.mobileStepCircle}>3</div>
        </div>

        {/* En-tête */}
        <div className={styles.formHeader}>
          <h1 className={styles.mainTitle}>Nous respectons ta vie privée...</h1>
          <h2 className={styles.subTitle}>Tes autorisations</h2>
        </div>

        <p style={{ color: '#0f0f0f', fontSize: '16px', lineHeight: '1.5', margin: 0, maxWidth: '800px' }}>
          En activant ces autorisations, tu pourras profiter pleinement de toutes les fonctionnalités de Go Truck et découvrir les meilleurs food trucks autour de toi. Tu peux modifier tes préférences à tout moment dans les paramètres de ton compte.
        </p>

        {error && (
          <div style={{ 
            color: '#dc3545', 
            fontSize: '14px', 
            padding: '12px',
            backgroundColor: '#f8d7da',
            borderRadius: '6px',
            width: '100%',
            maxWidth: '800px'
          }}>
            {error}
          </div>
        )}

        {/* Champs des autorisations */}
        <div className={styles.fieldsContainer}>
          {permissions.map((permission) => (
            <div key={permission.name} className={styles.fieldGroup}>
              <label className={styles.fieldLabel} style={{ marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>{permission.title}</span>
                {' '}
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{permission.description}</span>
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <select
                  name={permission.name}
                  className={styles.fieldInput}
                  value={formData[permission.name]}
                  onChange={handleChange}
                  style={{ 
                    cursor: 'pointer',
                    appearance: 'none',
                    paddingRight: '48px'
                  }}
                >
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <svg 
                  style={{ 
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    width: '24px',
                    height: '24px'
                  }} 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <path d="M6 9l6 6 6-6" stroke="#85031f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons */}
        <div className={styles.buttonsContainer}>
          <button type="button" className={styles.btnBack} onClick={handleBack} disabled={loading}>
            <img src="/arrow-left.svg" alt="" className={styles.btnIcon} />
            Retour
          </button>
          <button 
            type="button" 
            className={styles.btnNext} 
            onClick={handleFinish}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Inscription...' : 'Terminer l\'inscription'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignupStep3Page
