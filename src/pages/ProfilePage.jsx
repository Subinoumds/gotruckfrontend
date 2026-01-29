import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import userService from '../services/userService'
import styles from '../styles/ProfilePage.module.css'

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    // Profile form state
    const [profileData, setProfileData] = useState({
        prenom: '',
        nom: '',
        email: '',
        tel: ''
    })

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        if (user) {
            setProfileData({
                prenom: user.prenom || '',
                nom: user.nom || '',
                email: user.email || '',
                tel: user.tel || ''
            })
        }
    }, [user])

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const updatedUser = await userService.updateProfile(profileData)
            updateUser(updatedUser)
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour' })
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
            return
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
            return
        }

        setLoading(true)

        try {
            await userService.updatePassword(passwordData.currentPassword, passwordData.newPassword)
            setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' })
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors du changement de mot de passe' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.profilePage}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Header */}
            <div className={styles.headerWrapper}>
                <div className={styles.header}>
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.container}>
                    <h1 className={styles.pageTitle}>Mon Profil</h1>

                    {/* Message feedback */}
                    {message.text && (
                        <div className={`${styles.message} ${styles[message.type]}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Profile Information Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Informations personnelles</h2>
                        <form onSubmit={handleProfileSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="prenom" className={styles.label}>Prénom</label>
                                    <input
                                        type="text"
                                        id="prenom"
                                        name="prenom"
                                        value={profileData.prenom}
                                        onChange={handleProfileChange}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="nom" className={styles.label}>Nom</label>
                                    <input
                                        type="text"
                                        id="nom"
                                        name="nom"
                                        value={profileData.nom}
                                        onChange={handleProfileChange}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleProfileChange}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="tel" className={styles.label}>Téléphone</label>
                                    <input
                                        type="tel"
                                        id="tel"
                                        name="tel"
                                        value={profileData.tel}
                                        onChange={handleProfileChange}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </div>

                    {/* Password Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Changer le mot de passe</h2>
                        <form onSubmit={handlePasswordSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="currentPassword" className={styles.label}>Mot de passe actuel</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="newPassword" className={styles.label}>Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={styles.input}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="confirmPassword" className={styles.label}>Confirmer le mot de passe</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={styles.input}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Modification...' : 'Changer le mot de passe'}
                            </button>
                        </form>
                    </div>

                    {/* Logout Section */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Déconnexion</h2>
                        <p className={styles.logoutText}>Vous souhaitez vous déconnecter de votre compte ?</p>
                        <button
                            onClick={() => {
                                logout()
                                navigate('/login')
                            }}
                            className={styles.logoutButton}
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default ProfilePage
