import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from '../styles/SignupSteps.module.css'

const SignupStep1Page = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Récupérer les données de l'étape précédente (email, password)
  const initialData = location.state || {}
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    ville: '',
    code_postal: '',
    tel: '',
    ...initialData
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleBack = () => {
    navigate('/signup', { state: formData })
  }

  const handleNext = () => {
    // Validation basique
    if (!formData.nom || !formData.prenom || !formData.date_naissance || !formData.ville || !formData.code_postal) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    // Passer à l'étape 2
    navigate('/signup/step2', { state: formData })
  }

  return (
    <div className={styles.signupStepContainer}>
      {/* Logo en haut à gauche */}
      <div className={styles.logoContainer}>
        <img src="/logo-header.png" alt="GoTruck" className={styles.logo} style={{ filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Stepper (indicateur d'étapes) sur desktop */}
      <div className={styles.stepperContainer}>
        <div className={styles.stepWrapper}>
          <div className={`${styles.stepCircle} ${styles.active}`}>1</div>
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.stepWrapper}>
          <div className={`${styles.stepCircle} ${styles.inactive}`}>2</div>
        </div>
        <div className={styles.stepLine}></div>
        <div className={styles.stepWrapper}>
          <div className={`${styles.stepCircle} ${styles.inactive}`}>3</div>
        </div>
      </div>

      {/* Panneau de formulaire */}
      <div className={styles.formPanel}>
        {/* Stepper mobile */}
        <div className={styles.mobileStepperContainer}>
          <div className={styles.mobileStepCircle}>1</div>
          <div className={`${styles.mobileStepLine} ${styles.active}`}></div>
          <div className={`${styles.mobileStepCircle} ${styles.inactive}`}>2</div>
          <div className={styles.mobileStepLine}></div>
          <div className={`${styles.mobileStepCircle} ${styles.inactive}`}>3</div>
        </div>

        {/* En-tête */}
        <div className={styles.formHeader}>
          <h1 className={styles.mainTitle}>Ça ne te prendra que quelques minutes...</h1>
          <h2 className={styles.subTitle}>Tes informations personnelles</h2>
        </div>

        {/* Champs du formulaire */}
        <div className={styles.fieldsContainer}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Nom de famille <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="nom"
              className={styles.fieldInput}
              placeholder="Dupont"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Prénom <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="prenom"
              className={styles.fieldInput}
              placeholder="Jean"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Date de naissance <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWithIcon}>
              <img src="/calendar.svg" alt="" className={styles.inputIcon} />
              <input
                type="date"
                name="date_naissance"
                className={`${styles.fieldInput} ${styles.fieldInputWithIcon}`}
                placeholder="JJ/MM/AAAA"
                value={formData.date_naissance}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Ville de résidence <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="ville"
              className={styles.fieldInput}
              placeholder="Paris"
              value={formData.ville}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Code postal <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="code_postal"
              className={styles.fieldInput}
              placeholder="75001"
              value={formData.code_postal}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Numéro de téléphone
            </label>
            <input
              type="tel"
              name="tel"
              className={styles.fieldInput}
              placeholder="00 00 00 00 00"
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Boutons */}
        <div className={styles.buttonsContainer}>
          <button type="button" className={styles.btnBack} onClick={handleBack}>
            <img src="/arrow-left.svg" alt="" className={styles.btnIcon} />
            Retour
          </button>
          <button type="button" className={styles.btnNext} onClick={handleNext}>
            Suivant
            <img src="/arrow-right.svg" alt="" className={styles.btnIcon} style={{ filter: 'brightness(0) invert(1)' }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignupStep1Page
