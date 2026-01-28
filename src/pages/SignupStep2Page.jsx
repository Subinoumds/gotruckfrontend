import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from '../styles/SignupSteps.module.css'

const SignupStep2Page = () => {
    const navigate = useNavigate()
    const location = useLocation()

    // Récupérer les données des étapes précédentes
    const initialData = location.state || {}

    const [formData, setFormData] = useState({
        preferences_cuisine: [],
        distance_max: '10',
        notifications: true,
        ...initialData
    })

    const cuisineOptions = [
        { id: 'francais', label: 'Français' },
        { id: 'italien', label: 'Italien' },
        { id: 'americain', label: 'Américain' },
        { id: 'asiatique', label: 'Asiatique' },
        { id: 'mexicain', label: 'Mexicain' },
        { id: 'libanais', label: 'Libanais' },
        { id: 'indien', label: 'Indien' },
        { id: 'autre', label: 'Autre' }
    ]

    const handleCuisineToggle = (cuisineId) => {
        setFormData(prev => ({
            ...prev,
            preferences_cuisine: prev.preferences_cuisine.includes(cuisineId)
                ? prev.preferences_cuisine.filter(id => id !== cuisineId)
                : [...prev.preferences_cuisine, cuisineId]
        }))
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleBack = () => {
        navigate('/signup/step1', { state: formData })
    }

    const handleNext = () => {
        // Passer à l'étape 3
        navigate('/signup/step3', { state: formData })
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
                    <div className={`${styles.stepCircle} ${styles.completed}`}>1</div>
                    <img src="/degoulinant.svg" alt="" className={styles.dripEffect} />
                </div>
                <div className={styles.stepLine}></div>
                <div className={styles.stepWrapper}>
                    <div className={`${styles.stepCircle} ${styles.active}`}>2</div>
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
                    <div className={styles.mobileStepCircle}>2</div>
                    <div className={styles.mobileStepLine}></div>
                    <div className={`${styles.mobileStepCircle} ${styles.inactive}`}>3</div>
                </div>

                {/* En-tête */}
                <div className={styles.formHeader}>
                    <h1 className={styles.mainTitle}>On y est presque...</h1>
                    <h2 className={styles.subTitle}>Tes préférences</h2>
                </div>

                {/* Champs du formulaire */}
                <div className={styles.fieldsContainer}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Quels types de cuisine préfères-tu ?
                        </label>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            marginTop: '8px'
                        }}>
                            {cuisineOptions.map(cuisine => (
                                <button
                                    key={cuisine.id}
                                    type="button"
                                    onClick={() => handleCuisineToggle(cuisine.id)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '9999px',
                                        border: '1.5px solid #85031f',
                                        backgroundColor: formData.preferences_cuisine.includes(cuisine.id) ? '#85031f' : '#fffbf8',
                                        color: formData.preferences_cuisine.includes(cuisine.id) ? '#fffbf8' : '#85031f',
                                        cursor: 'pointer',
                                        fontFamily: 'Poppins',
                                        fontSize: '14px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {cuisine.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Distance maximale de recherche
                        </label>
                        <select
                            name="distance_max"
                            className={styles.fieldInput}
                            value={formData.distance_max}
                            onChange={handleChange}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="15">15 km</option>
                            <option value="20">20 km</option>
                            <option value="30">30 km</option>
                            <option value="50">50 km</option>
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={formData.notifications}
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                border: '1.5px solid #85031f',
                                backgroundColor: formData.notifications ? '#85031f' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}>
                                {formData.notifications && (
                                    <svg viewBox="0 0 12 12" fill="none" style={{ width: '14px', height: '14px' }}>
                                        <path d="M2 6L5 9L10 3" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span className={styles.fieldLabel} style={{ marginBottom: 0 }}>
                                Je souhaite recevoir des notifications sur les nouveaux Food Trucks près de moi
                            </span>
                        </label>
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

export default SignupStep2Page
