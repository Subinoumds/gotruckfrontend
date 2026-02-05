import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styles from '../styles/FoodTruckPage.module.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { foodtruckService } from '../services/foodtruckService'
import { favoriService } from '../services/favoriService'
import { getImageUrl } from '../services/api'
import Footer from '../components/Footer'
import FoodTruckServices from '../components/FoodTruckServices'
import FoodTruckMenu from '../components/FoodTruckMenu';
import FoodTruckPayment from '../components/FoodTruckPayment';
import FoodTruckReviews from '../components/FoodTruckReviews';
import FoodTruckLocation from '../components/FoodTruckLocation';

// Use the same footer as MapPage/HomePage if possible, but for now I will create a simple wrapper or import if it exists. 
// Since there's no standalone Footer component in the previously viewed files (it was inline in MapPage), 
// I will check if I should extract it or copy it. The user said "reuse your existing Footer".
// I'll assume for now I should copy the footer structure from map page or if I should quickly extract it.
// Given the instructions, I'll copy the footer structure from MapPage.jsx for consistency and speed, 
// unless I see a Footer.jsx in components. 
// CHECK: I see "import Footer from '../components/Footer'" in the previous turn? No, I saw it in MapPage inline.
// Wait, I will look for Footer component first.

const FoodTruckPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [foodtruck, setFoodtruck] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isFavorite, setIsFavorite] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('propos')

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const data = await foodtruckService.getById(id)
                setFoodtruck(data)

                // Check favorite status
                try {
                    const favIds = await favoriService.getIds()
                    const isFav = favIds.some(fid => Number(fid) === Number(id))
                    setIsFavorite(isFav)
                } catch (e) {
                    console.error("Favoris error", e)
                }

            } catch (err) {
                console.error("Error loading foodtruck:", err)
                setError("Impossible de charger les informations du food truck.")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [id])

    const handleToggleFavorite = async () => {
        try {
            await favoriService.toggle(Number(id))
            setIsFavorite(!isFavorite)
        } catch (err) {
            console.error("Error toggling favorite", err)
        }
    }

    // Helper to extract social links from text like "Facebook: url\nInstagram: url"
    const getSocialLink = (text, type) => {
        if (!text) return null;
        // Simple regex to find URL after type
        // e.g. "Facebook: https://..." or just containing "facebook.com"
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.toLowerCase().includes(type.toLowerCase())) {
                const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                return urlMatch ? urlMatch[0] : null;
            }
        }
        return null;
    }

    if (loading) return <div className={styles.loading}>Chargement...</div>
    if (error) return <div className={styles.error}>{error}</div>
    if (!foodtruck) return <div className={styles.error}>Food Truck introuvable</div>

    const extraPhotos = foodtruck.photos && Array.isArray(foodtruck.photos) ? foodtruck.photos : [];

    const mainPhoto = getImageUrl(foodtruck.photo_url) || '/Container.png';

    // Use uploaded photos or fallback to placeholder
    const photo2 = extraPhotos.length > 0 ? getImageUrl(extraPhotos[0]) : '/Container.png';
    const photo3 = extraPhotos.length > 1 ? getImageUrl(extraPhotos[1]) : '/Container.png';
    const photo4 = extraPhotos.length > 2 ? getImageUrl(extraPhotos[2]) : '/Container.png';
    const photo5 = extraPhotos.length > 3 ? getImageUrl(extraPhotos[3]) : '/Container.png';

    return (
        <div className={styles.pageFoodTruckPropos}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Header Wrapper */}
            <div className={styles.headerWrapper}>
                <div className={styles.header}>
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                </div>
            </div>

            {/* Breadcrumb */}
            <div className={styles.paragraph}>
                <div className={styles.linkToutes} onClick={() => navigate('/map')}>Tous les Food Trucks</div>
                <div className={styles.div}>{`>`}</div>
                <div className={styles.linkTrail}>{foodtruck.type_cuisine || 'Cuisine'}</div>
                <div className={styles.div}>{`>`}</div>
                <b className={styles.linkTrail2}>{foodtruck.nom}</b>
            </div>

            {/* Title & Action */}
            <div className={styles.beniBurritosParent}>
                <div className={styles.beniBurritosTitle}>{foodtruck.nom}</div>
                <div className={styles.bouton} onClick={handleToggleFavorite}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? '#ec6827' : 'none'}
                        stroke={isFavorite ? '#ec6827' : '#85031f'}
                        strokeWidth="2"
                        style={{ marginRight: '8px' }}
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <div className={styles.beniBurritos}>{isFavorite ? 'Enregistré' : 'Enregistrer'}</div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className={styles.container10}>
                <div className={styles.container11}>
                    <div
                        className={styles.thpTrailDeHauteProvence}
                        style={{ backgroundImage: `url(${mainPhoto})` }}
                    >
                        <div className={styles.boutonVoirPhotos}>
                            <div className={styles.beniBurritos}>Voir toutes les photos</div>
                        </div>
                    </div>
                    <div className={styles.thpTrailDeHauteProvenceParent}>
                        <img className={styles.thpTrailDeHauteProvence2} src={photo2} alt="" />
                        <img className={styles.thpTrailDeHauteProvence2} src={photo3} alt="" />
                    </div>
                    <div className={styles.thpTrailDeHauteProvenceParent}>
                        <img className={styles.thpTrailDeHauteProvence4} src={photo4} alt="" />
                        <img className={styles.thpTrailDeHauteProvence5} src={photo5} alt="" />
                    </div>
                </div>
            </div>

            {/* Content Tabs & Description */}
            <div className={styles.tabParent}>
                <div className={styles.tab}>
                    <div className={styles.nav}>
                        <div
                            className={activeTab === 'propos' ? styles.link : styles.link2}
                            onClick={() => setActiveTab('propos')}
                            style={{ cursor: 'pointer' }}
                        >
                            <b className={styles.propos}>À propos</b>
                        </div>
                        <div
                            className={activeTab === 'services' ? styles.link : styles.link2}
                            onClick={() => setActiveTab('services')}
                            style={{ cursor: 'pointer' }}
                        >
                            <b className={styles.propos}>Services</b>
                        </div>
                        <div
                            className={activeTab === 'menu' ? styles.link : styles.link2}
                            onClick={() => setActiveTab('menu')}
                            style={{ cursor: 'pointer' }}
                        >
                            <b className={styles.propos}>Menu</b>
                        </div>
                        <div
                            className={activeTab === 'paiement' ? styles.link : styles.link2}
                            onClick={() => setActiveTab('paiement')}
                            style={{ cursor: 'pointer' }}
                        >
                            <b className={styles.propos}>Moyens de paiement</b>
                        </div>
                        <div
                            className={activeTab === 'avis' ? styles.link : styles.link2}
                            onClick={() => setActiveTab('avis')}
                            style={{ cursor: 'pointer' }}
                        >
                            <b className={styles.propos}>Avis Google</b>
                        </div>
                        <div
                            className={activeTab === 'location' ? styles.link : styles.link2}
                            onClick={() => setActiveTab('location')}
                            style={{ cursor: 'pointer' }}
                        >
                            <b className={styles.propos}>Localiser le Food Truck</b>
                        </div>
                    </div>
                </div>

                {activeTab === 'propos' && (
                    <div className={styles.background}>
                        <div className={styles.quiEstBniContainer}>
                            <span className={styles.beniBurritosEst}>
                                {foodtruck.description || "Aucune description disponible."}
                            </span>
                        </div>

                        <div className={styles.frameParent}>
                            {foodtruck.tel && (
                                <div className={styles.siteWebParent}>
                                    <img className={styles.siteWebIcon} src="/phone.svg" alt="" />
                                    <div className={styles.beniBurritos}>{foodtruck.tel}</div>
                                </div>
                            )}

                            {foodtruck.site_web && (
                                <div className={styles.siteWebParent}>
                                    <img className={styles.siteWebIcon} src="/siteinternet.svg" alt="" />
                                    <a href={foodtruck.site_web} target="_blank" rel="noopener noreferrer" className={styles.beniBurritos} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {foodtruck.site_web}
                                    </a>
                                </div>
                            )}

                            {foodtruck.email && (
                                <div className={styles.siteWebParent}>
                                    <img className={styles.siteWebIcon} src="/mail.svg" alt="" />
                                    <a href={`mailto:${foodtruck.email}`} className={styles.beniBurritos} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {foodtruck.email}
                                    </a>
                                </div>
                            )}

                            {/* Social Media Links */}
                            {getSocialLink(foodtruck.reseaux_sociaux, 'facebook') && (
                                <div className={styles.siteWebParent}>
                                    <img className={styles.siteWebIcon} src="/facebookpagefoodtruck.svg" alt="Facebook" style={{ width: '32px', height: '32px' }} />
                                    <a href={getSocialLink(foodtruck.reseaux_sociaux, 'facebook')} target="_blank" rel="noopener noreferrer" className={styles.beniBurritos} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Facebook
                                    </a>
                                </div>
                            )}

                            {getSocialLink(foodtruck.reseaux_sociaux, 'instagram') && (
                                <div className={styles.siteWebParent}>
                                    <img className={styles.siteWebIcon} src="/insta.svg" alt="Instagram" style={{ width: '32px', height: '32px' }} />
                                    <a href={getSocialLink(foodtruck.reseaux_sociaux, 'instagram')} target="_blank" rel="noopener noreferrer" className={styles.beniBurritos} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Instagram
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'services' && <FoodTruckServices foodtruck={foodtruck} />}
                {activeTab === 'menu' && <FoodTruckMenu foodtruck={foodtruck} />}
                {activeTab === 'paiement' && <FoodTruckPayment foodtruck={foodtruck} />}
                {activeTab === 'avis' && <FoodTruckReviews foodtruckId={id} />}
                {activeTab === 'location' && <FoodTruckLocation foodtruck={foodtruck} />}

            </div>

            <Footer />
        </div>
    )
}

export default FoodTruckPage
