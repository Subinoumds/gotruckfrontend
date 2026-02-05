import { useState, useEffect } from 'react'
import userService from '../../services/userService'
import TruckerHeader from '../../components/TruckerHeader'
import styles from '../../styles/TruckerPages.module.css'

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        tel: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const user = await userService.getProfile()
            setFormData({
                ...formData,
                nom: user.nom || '',
                prenom: user.prenom || '',
                email: user.email || '',
                tel: user.tel || ''
            })
        } catch (err) {
            setError(err.message)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const updateData = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                tel: formData.tel
            }

            // If changing password
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas')
                }
                if (formData.newPassword.length < 6) {
                    throw new Error('Le mot de passe doit contenir au moins 6 caractères')
                }
                updateData.currentPassword = formData.currentPassword
                updateData.newPassword = formData.newPassword
            }

            await userService.updateProfile(updateData)
            setSuccess('Profil mis à jour avec succès !')

            // Clear password fields
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <TruckerHeader currentPage="profile" />

            <div className={styles.content}>
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <div className={styles.card}>
                    <h2>👤 Informations personnelles</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Téléphone</label>
                            <input
                                type="tel"
                                name="tel"
                                value={formData.tel}
                                onChange={handleChange}
                            />
                        </div>

                        <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                        <h3 style={{ marginBottom: '10px' }}>🔒 Changer le mot de passe</h3>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                            Laisse ces champs vides si tu ne veux pas changer ton mot de passe
                        </p>

                        <div className={styles.formGroup}>
                            <label>Mot de passe actuel</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Nouveau mot de passe</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Confirmer le nouveau mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        <button type="submit" className={styles.btnSubmit} disabled={loading}>
                            {loading ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
