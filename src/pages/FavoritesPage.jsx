import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { favoriService } from '../services/favoriService'
import { getImageUrl } from '../services/api'
import styles from '../styles/FoodTruckPage.module.css'
import homeStyles from '../styles/Connexion.module.css'

const FavoritesPage = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [removingId, setRemovingId] = useState(null)

    useEffect(() => {
        const loadFavorites = async () => {
            if (!user) return
            setLoading(true)
            try {
                const data = await favoriService.getAll()
                setFavorites(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Erreur chargement favoris:', err)
            } finally {
                setLoading(false)
            }
        }
        loadFavorites()
    }, [user])

    const handleToggleFavorite = async (e, foodtruckId) => {
        e.stopPropagation()
        const id = Number(foodtruckId)
        setRemovingId(id)

        setTimeout(async () => {
            try {
                await favoriService.toggle(id)
                setFavorites(prev => prev.filter(ft => ft.id !== id))
                setRemovingId(null)
            } catch (err) {
                console.error('Erreur retrait favori:', err)
                setRemovingId(null)
            }
        }, 300)
    }

    const formatDistance = (km) => {
        if (!km) return 'À moins de 1 km'
        if (km < 0.5) return 'Moins de 500m'
        if (km < 1) return 'À moins de 1 km'
        if (km < 2) return 'À moins de 2 km'
        if (km < 5) return 'À moins de 5 km'
        return `${km.toFixed(1)} km`
    }

    return (
        <div className={styles.pageFoodTruckPropos}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Header - Exact copy from FoodTruckPage */}
            <div className={styles.headerWrapper}>
                <div className={styles.header}>
                    <div className={styles.container}>
                        <div className={styles.container2}>
                            <div className={styles.container3}>
                                <div className={styles.menuBurger} onClick={() => setSidebarOpen(true)}>
                                    <img className={styles.calque1Icon} src="/menu-burger.svg" alt="Menu" />
                                </div>
                                <img
                                    className={styles.logoTitreGotruck1Icon}
                                    src="/logo-header.png"
                                    alt="GoTruck"
                                    onClick={() => navigate('/')}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <div className={styles.containerParent}>
                                <div className={styles.container4}>
                                    <div className={styles.container5}>
                                        <div className={styles.container6}>
                                            <div className={styles.button}>
                                                <div className={styles.container7}>
                                                    <b className={styles.fr}>FR</b>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.container8}>
                                            <div className={styles.button2}>
                                                <div className={styles.container7}>
                                                    <b className={styles.fr}>EUR</b>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.containerIcon}>U</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Section with Title */}
            <div style={{
                maxWidth: '1200px',
                margin: '40px auto',
                padding: '0 40px'
            }}>
                {/* Title above cards */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 className={homeStyles.lesFoodTrucks} style={{
                        fontSize: '2.5rem',
                        color: '#85031f',
                        fontWeight: 'bold'
                    }}>
                        Mes Favoris
                    </h1>
                </div>

                {loading ? (
                    <div style={{
                        padding: '60px 0',
                        textAlign: 'left',
                        color: '#85031f',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '16px',
                        width: '100%'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid #f5b07c',
                            borderTop: '4px solid #85031f',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <div style={{ fontSize: '16px', fontWeight: '500' }}>Chargement des favoris...</div>
                    </div>
                ) : favorites.length === 0 ? (
                    <div style={{
                        padding: '60px 0',
                        textAlign: 'center',
                        color: '#85031f'
                    }}>
                        <h2>Vous n'avez pas encore de favoris 😢</h2>
                        <p>Explorez la carte pour en ajouter !</p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                marginTop: '20px',
                                padding: '12px 24px',
                                backgroundColor: '#85031f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Explorer
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '24px',
                        width: '100%',
                        justifyContent: 'flex-start'
                    }}>
                        {favorites.map((ft) => (
                            <div
                                key={ft.id}
                                className={homeStyles.cardFoodTruck}
                                onClick={() => navigate(`/foodtruck/${ft.id}`)}
                                style={{
                                    cursor: 'pointer',
                                    opacity: removingId === ft.id ? 0 : 1,
                                    transform: removingId === ft.id ? 'scale(0.8)' : 'scale(1)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div className={homeStyles.link}>
                                    <div className={homeStyles.background2}>
                                        <img
                                            src={getImageUrl(ft.photo_url) || '/Container.png'}
                                            alt={ft.nom || 'Food Truck'}
                                            style={{
                                                width: '254px',
                                                height: '192px',
                                                objectFit: 'cover',
                                                borderRadius: '12px 12px 0 0'
                                            }}
                                        />
                                        <div className={homeStyles.container8}>
                                            {ft.distance_km && (
                                                <div className={homeStyles.overlay}>
                                                    <div className={homeStyles.moinsDe1}>{formatDistance(ft.distance_km)}</div>
                                                </div>
                                            )}
                                            <div
                                                className={homeStyles.coeur}
                                                onClick={(e) => handleToggleFavorite(e, ft.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <svg
                                                    className={homeStyles.svgIcon}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    style={{
                                                        transition: 'transform 0.2s ease',
                                                        transform: removingId === ft.id ? 'scale(0.8)' : 'scale(1)'
                                                    }}
                                                >
                                                    <path
                                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                                        stroke="#85031f"
                                                        strokeWidth="2"
                                                        fill="#85031f"
                                                        style={{
                                                            transition: 'fill 0.3s ease'
                                                        }}
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={homeStyles.container9}>
                                        <div className={homeStyles.container10}>
                                            <b className={homeStyles.bniBurritos}>{ft.nom?.toUpperCase() || 'FOOD TRUCK'}</b>
                                        </div>
                                        <div className={homeStyles.container11}>
                                            <div className={homeStyles.container12}>
                                                <svg className={homeStyles.svgIcon2} viewBox="0 0 16 16" fill="none">
                                                    <path d="M8 0L10.5 5.5L16 6.5L12 10.5L13 16L8 13L3 16L4 10.5L0 6.5L5.5 5.5L8 0Z" fill="#85031f" />
                                                </svg>
                                                <div className={homeStyles.container13}>
                                                    <div className={homeStyles.loremIpsum}>
                                                        {ft.note_moyenne ? `${parseFloat(ft.note_moyenne).toFixed(1)} ⭐` : 'Nouveau'}
                                                    </div>
                                                </div>
                                            </div>
                                            {ft.emplacement_nom && (
                                                <div className={homeStyles.container14}>
                                                    <svg className={homeStyles.svgIcon2} viewBox="0 0 16 16" fill="none">
                                                        <path d="M8 0C5.2 0 3 2.2 3 5c0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z" fill="#85031f" />
                                                    </svg>
                                                    <div className={homeStyles.container13}>
                                                        <div className={homeStyles.loremIpsum}>{ft.emplacement_nom}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className={homeStyles.container16}>
                                            <div className={homeStyles.container17}>
                                                <div className={homeStyles.menuPartir}>Menu disponible</div>
                                            </div>
                                        </div>
                                        <div className={homeStyles.container18}>
                                            {ft.type_cuisine && (
                                                <div className={homeStyles.tag}>
                                                    <div className={homeStyles.mexicain}>{ft.type_cuisine}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default FavoritesPage
