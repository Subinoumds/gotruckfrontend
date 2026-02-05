import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import truckerService from '../../services/truckerService'
import TruckerHeader from '../../components/TruckerHeader'
import styles from '../../styles/TruckerPages.module.css'

const LocationPage = () => {
    const navigate = useNavigate()
    const [foodtrucks, setFoodtrucks] = useState([])
    const [selectedFoodtruck, setSelectedFoodtruck] = useState(null)
    const [isActive, setIsActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [lastActivation, setLastActivation] = useState(null)

    useEffect(() => {
        loadFoodtrucks()
    }, [])

    useEffect(() => {
        if (selectedFoodtruck) {
            checkLocationStatus()
        }
    }, [selectedFoodtruck])

    useEffect(() => {
        // Check status every minute
        const interval = setInterval(() => {
            if (selectedFoodtruck && isActive) {
                checkLocationStatus()
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [selectedFoodtruck, isActive])

    const loadFoodtrucks = async () => {
        setLoading(true)
        try {
            const data = await truckerService.getFoodtrucks()
            setFoodtrucks(data)
            if (data.length > 0) {
                setSelectedFoodtruck(data[0].id)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const checkLocationStatus = async () => {
        if (!selectedFoodtruck) return

        try {
            const status = await truckerService.getLocationStatus(selectedFoodtruck)
            setIsActive(status.is_active)
            setLastActivation(status.activated_at)

            // Show notification if needed (after 4 hours)
            if (status.needs_notification) {
                showNotification()
            }
        } catch (err) {
            console.error('Erreur lors de la vérification du statut:', err)
        }
    }

    const showNotification = () => {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('GoTruck - Localisation active', {
                body: 'Ta localisation est active depuis plus de 4 heures. N\'oublie pas de la désactiver si tu as terminé !',
                icon: '/logo-header.png'
            })
        }

        // Visual alert
        alert('Ta localisation est active depuis plus de 4 heures. N\'oublie pas de la désactiver si tu as terminé !')
    }

    const handleActivate = async () => {
        if (!selectedFoodtruck) return

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            // Get current position
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        await truckerService.activateLocation(
                            selectedFoodtruck,
                            position.coords.latitude,
                            position.coords.longitude
                        )
                        setIsActive(true)
                        setLastActivation(new Date().toISOString())
                        setSuccess('Localisation activée avec succès !')

                        // Request notification permission
                        if ('Notification' in window && Notification.permission === 'default') {
                            Notification.requestPermission()
                        }
                    } catch (err) {
                        setError(err.message)
                    } finally {
                        setLoading(false)
                    }
                },
                (err) => {
                    setError('Impossible d\'obtenir ta position. Vérifie les autorisations.')
                    setLoading(false)
                }
            )
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const handleDeactivate = async () => {
        if (!selectedFoodtruck) return

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await truckerService.deactivateLocation(selectedFoodtruck)
            setIsActive(false)
            setLastActivation(null)
            setSuccess('Localisation désactivée avec succès !')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatDuration = (ms) => {
        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)

        const displayHours = hours
        const displayMinutes = minutes % 60
        const displaySeconds = seconds % 60

        return `${displayHours}h ${displayMinutes}min ${displaySeconds}s`
    }

    return (
        <div className={styles.container}>
            <TruckerHeader currentPage="location" />

            <div className={styles.content}>
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                {/* Foodtruck Selection */}
                <div className={styles.card}>
                    <h2>Sélectionner un Foodtruck</h2>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : foodtrucks.length === 0 ? (
                        <div>
                            <p>Aucun foodtruck trouvé. Créez-en un pour commencer !</p>
                            <button
                                onClick={() => navigate('/trucker/create')}
                                className={styles.btnPrimary}
                            >
                                Créer mon premier foodtruck
                            </button>
                        </div>
                    ) : (
                        <div className={styles.formGroup}>
                            <label>Foodtruck actif</label>
                            <select
                                className={styles.select}
                                value={selectedFoodtruck || ''}
                                onChange={(e) => setSelectedFoodtruck(Number(e.target.value))}
                            >
                                <option value="">-- Sélectionner --</option>
                                {foodtrucks.map((ft) => (
                                    <option key={ft.id} value={ft.id}>
                                        {ft.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Status Display */}
                {selectedFoodtruck && (
                    <div className={styles.card}>
                        <h2>Statut de localisation</h2>
                        <div className={styles.status}>
                            {isActive ? (
                                <div className={styles.statusActive}>
                                    <span className={styles.statusDot}></span>
                                    <span>Localisation ACTIVE</span>
                                </div>
                            ) : (
                                <div className={styles.statusInactive}>
                                    <span className={styles.statusDot}></span>
                                    <span>Localisation INACTIVE</span>
                                </div>
                            )}
                        </div>

                        {isActive && lastActivation && (
                            <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                                <p><strong>Activé depuis :</strong> {formatDuration(Date.now() - new Date(lastActivation).getTime())}</p>
                                <p><strong>Heure d'activation :</strong> {new Date(lastActivation).toLocaleTimeString('fr-FR')}</p>
                            </div>
                        )}

                        {isActive && (
                            <div className={styles.warning}>
                                ⚠️ N'oubliez pas de désactiver votre localisation lorsque vous fermez !
                            </div>
                        )}

                        {/* Activation Button */}
                        <div style={{ marginTop: '20px' }}>
                            {isActive ? (
                                <button
                                    onClick={handleDeactivate}
                                    disabled={loading}
                                    className={styles.btnDeactivate}
                                >
                                    {loading ? 'Chargement...' : '🛑 Arrêter la localisation'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleActivate}
                                    disabled={loading}
                                    className={styles.btnActivate}
                                >
                                    {loading ? 'Chargement...' : '📍 Activer la localisation'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Info Card */}
                <div className={styles.card}>
                    <h2>ℹ️ Informations</h2>
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li>Activez votre localisation pour être visible sur la carte</li>
                        <li>Les clients pourront voir votre position en temps réel</li>
                        <li>Pensez à désactiver en fin de service</li>
                        <li>Vous recevrez une notification après 4h d'activité</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default LocationPage
