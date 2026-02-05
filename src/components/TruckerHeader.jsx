import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/TruckerPages.module.css'

const TruckerHeader = ({ currentPage }) => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err)
        }
    }

    return (
        <>
            {/* Desktop/Tablet Header */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1>Interface Trucker</h1>
                    <button onClick={handleLogout} className={styles.btnLogout}>
                        Déconnexion
                    </button>
                </div>
                <nav className={styles.nav}>
                    <a
                        href="/trucker/location"
                        className={currentPage === 'location' ? styles.active : ''}
                    >
                        Ma Localisation
                    </a>
                    <a
                        href="/trucker/profile"
                        className={currentPage === 'profile' ? styles.active : ''}
                    >
                        Mon Profil
                    </a>
                    <a
                        href="/trucker/foodtruck"
                        className={currentPage === 'foodtruck' ? styles.active : ''}
                    >
                        Mon Foodtruck
                    </a>
                    <a
                        href="/trucker/create"
                        className={currentPage === 'create' ? styles.active : ''}
                    >
                        Créer un Foodtruck
                    </a>
                </nav>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className={styles.mobileNav}>
                <a
                    href="/trucker/location"
                    className={`${styles.mobileNavItem} ${currentPage === 'location' ? styles.active : ''}`}
                >
                    <span className={styles.mobileNavIcon}>📍</span>
                    <span>Localisation</span>
                </a>
                <a
                    href="/trucker/profile"
                    className={`${styles.mobileNavItem} ${currentPage === 'profile' ? styles.active : ''}`}
                >
                    <span className={styles.mobileNavIcon}>👤</span>
                    <span>Profil</span>
                </a>
                <a
                    href="/trucker/foodtruck"
                    className={`${styles.mobileNavItem} ${currentPage === 'foodtruck' ? styles.active : ''}`}
                >
                    <span className={styles.mobileNavIcon}>🚚</span>
                    <span>Foodtruck</span>
                </a>
                <a
                    href="/trucker/create"
                    className={`${styles.mobileNavItem} ${currentPage === 'create' ? styles.active : ''}`}
                >
                    <span className={styles.mobileNavIcon}>➕</span>
                    <span>Créer</span>
                </a>
            </nav>
        </>
    )
}

export default TruckerHeader
