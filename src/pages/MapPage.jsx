import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Sidebar from '../components/Sidebar'
import { foodtruckService } from '../services/foodtruckService'
import { favoriService } from '../services/favoriService'
import { getImageUrl } from '../services/api'
import styles from '../styles/MapPage.module.css'
import DistanceFilter from '../components/Filters/DistanceFilter'
import CuisineFilter from '../components/Filters/CuisineFilter'
import PlatsFilter from '../components/Filters/PlatsFilter'

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Icône personnalisée pour les food trucks
const foodtruckIcon = new L.Icon({
  iconUrl: '/pin-foodtruck.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

// Composant pour recentrer la carte
const RecenterMap = ({ center }) => {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, 11)
    }
  }, [center, map])
  return null
}

const MapPage = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [foodtrucks, setFoodtrucks] = useState([])

  const [filteredFoodtrucks, setFilteredFoodtrucks] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState([47.4784, -0.5632]) // Angers par défaut

  // Filtres
  // Filtres
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [selectedPlats, setSelectedPlats] = useState([])
  const [selectedDistance, setSelectedDistance] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    loadData()
    getUserLocation()
  }, [])



  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      let ftData
      if (selectedDistance && userLocation) {
        // Recherche géolocalisée
        const extraFilters = {}
        if (searchQuery) extraFilters.q = searchQuery
        if (selectedCuisine) extraFilters.type_cuisine = selectedCuisine

        ftData = await foodtruckService.getNearby(
          userLocation[0],
          userLocation[1],
          selectedDistance,
          null, null, null, 100, 0,
          extraFilters
        )
      } else {
        // Recherche globale
        const filters = {}
        if (searchQuery) filters.q = searchQuery
        if (selectedCuisine) filters.type_cuisine = selectedCuisine
        ftData = await foodtruckService.getAll(filters)
      }

      // Gestion favoris
      const favIds = await favoriService.getIds().catch(() => [])

      setFoodtrucks(Array.isArray(ftData) ? ftData : [])
      setFavoriteIds(favIds.map(Number))
      setError(null)
    } catch (err) {
      console.error('Erreur chargement:', err)
      setError("Impossible de charger les food trucks. Veuillez réessayer.")
      setFoodtrucks([])
    } finally {
      setLoading(false)
    }
  }

  // Reload data when primary filters change that affect API calls
  useEffect(() => {
    loadData()
    setCurrentPage(1)
  }, [userLocation, selectedDistance, selectedCuisine, searchQuery])

  // Apply client-side filters (Plats)
  useEffect(() => {
    let result = [...foodtrucks]

    // Filtre Plats (Client-side pour l'instant car API complexe)
    if (selectedPlats.length > 0) {
      result = result.filter(ft => {
        const description = (ft.description || '').toLowerCase()
        const type = (ft.type || '').toLowerCase()
        const nom = (ft.nom || '').toLowerCase()

        return selectedPlats.some(plat => {
          const p = plat.toLowerCase()
          // Découpage simple pour correspondre aux mots clés
          const keywords = p.split(/[\/\s]+/).filter(k => k.length > 2)
          return keywords.some(k =>
            description.includes(k) || type.includes(k) || nom.includes(k)
          )
        })
      })
    }

    setFilteredFoodtrucks(result)
  }, [foodtrucks, selectedPlats])



  const handleToggleFavorite = async (foodtruckId) => {
    try {
      const id = Number(foodtruckId)
      await favoriService.toggle(id)
      setFavoriteIds(prev =>
        prev.includes(id)
          ? prev.filter(fid => fid !== id)
          : [...prev, id]
      )
    } catch (err) {
      console.error('Erreur favori:', err)
    }
  }

  const isFavorite = (id) => favoriteIds.includes(Number(id))



  // Pagination
  const totalPages = Math.ceil(filteredFoodtrucks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFoodtrucks = filteredFoodtrucks.slice(startIndex, startIndex + itemsPerPage)

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }



  return (
    <div className={styles.mapPage}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header avec gradient */}
      <div className={styles.headerWrapper}>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
              <div className={styles.headerLeft}>
                <div className={styles.menuBurger} onClick={() => setSidebarOpen(true)}>
                  <img src="/menu-burger.svg" alt="Menu" />
                </div>
                <img src="/logo-header.png" alt="GoTruck" className={styles.logo} />
              </div>
              <div className={styles.headerRight}>
                <div className={styles.langCurrency}>
                  <button className={styles.langBtn}>
                    <b>FR</b>
                  </button>
                  <button className={styles.currencyBtn}>
                    <b>EUR</b>
                  </button>
                </div>
                <div className={styles.profileIcon}>U</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Carte */}
        <div className={styles.mapContainer}>
          <MapContainer
            center={userLocation}
            zoom={11}
            style={{ height: '100%', width: '100%', borderRadius: '15px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterMap center={userLocation} />

            {/* Markers pour chaque food truck */}
            {filteredFoodtrucks.map((ft) => (
              ft.latitude && ft.longitude && (
                <Marker
                  key={ft.id}
                  position={[parseFloat(ft.latitude), parseFloat(ft.longitude)]}
                  icon={foodtruckIcon}
                >
                  <Popup>
                    <div className={styles.popupContent}>
                      <strong>{ft.nom}</strong>
                      <p>{ft.type_cuisine}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>

          {/* Contrôles de zoom */}
          <div className={styles.mapControls}>
            <button className={styles.zoomBtn}>+</button>
            <button className={styles.zoomBtn}>−</button>
          </div>
        </div>

        {/* Panel de recherche et résultats */}
        <div className={styles.searchPanel}>
          {/* Titre et compteur */}
          <div className={styles.panelHeader}>
            <h1 className={styles.mainTitle}>
              Géoloc ta faim,<br />trouve ton truck !
            </h1>
            <p className={styles.resultCount}>
              Les Food Trucks en France - Plus de {filteredFoodtrucks.length} résultats.
            </p>
          </div>

          {/* Barre de recherche */}
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                placeholder="Rechercher un Food Truck..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.searchBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              Rechercher
            </button>
          </div>

          {/* Filtres style HomePage */}
          <div className={styles.filtersRow}>
            <CuisineFilter onCuisineChange={setSelectedCuisine} />
            <PlatsFilter onPlatsChange={setSelectedPlats} />
            <DistanceFilter onDistanceChange={setSelectedDistance} />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {/* Liste des food trucks */}
          {loading ? (
            <div className={styles.loading}>Chargement...</div>
          ) : (
            <>
              <div className={styles.foodtruckGrid}>
                {paginatedFoodtrucks.map((ft) => (
                  <div key={ft.id} className={styles.foodtruckCard}>
                    <div className={styles.cardImage}>
                      <img src={getImageUrl(ft.photo_url) || '/Container.png'} alt={ft.nom} />
                      <div className={styles.cardOverlay}>
                        <span className={styles.distanceBadge}>À moins de 1 km</span>
                        <button
                          className={styles.heartBtn}
                          onClick={() => handleToggleFavorite(ft.id)}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill={isFavorite(ft.id) ? '#ec6827' : 'none'}
                            stroke={isFavorite(ft.id) ? '#ec6827' : '#fff'}
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{ft.nom}</h3>
                      <div className={styles.cardInfo}>
                        <div className={styles.infoRow}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          </svg>
                          <span>{ft.type_cuisine || 'Cuisine variée'}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{ft.ville || 'Maine-et-Loire (49)'}</span>
                        </div>
                      </div>
                      <p className={styles.cardPrice}>Menu à partir de 12€</p>
                      <div className={styles.cardTags}>
                        {ft.type_cuisine && (
                          <span className={styles.tag}>{ft.type_cuisine}</span>
                        )}
                        <span className={styles.tag}>Click & Collect</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationArrow}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  {renderPagination().map((page, index) => (
                    page === '...' ? (
                      <span key={`dots-${index}`} className={styles.paginationDots}>…</span>
                    ) : (
                      <button
                        key={page}
                        className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  ))}

                  <button
                    className={styles.paginationArrow}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>

        <div className={styles.footerContent}>
          <div className={styles.footerMain}>
            <img src="/logo-footer.png" alt="GoTruck" className={styles.footerLogo} />
            <div className={styles.footerColumns}>
              <div className={styles.footerTitle}>
                Plus de 3500 food trucks dans toute la France
              </div>
              <div className={styles.footerLinksContainer}>
                <div className={styles.footerColumn}>
                  <h4>PARTICULIERS</h4>
                  <a href="#">Géolocaliser un Food Truck</a>
                  <a href="#">Prestations & Évènements</a>
                  <a href="#">Qui sommes-nous ?</a>
                  <a href="#">Nous contacter</a>
                  <a href="#">Mentions légales</a>
                  <a href="#">Gestion des cookies</a>
                </div>
                <div className={styles.footerColumn}>
                  <h4>TRUCKERS</h4>
                  <a href="#">Espace Truckers</a>
                  <a href="#">Service client</a>
                  <a href="#">Foire aux questions</a>
                  <a href="#">Mentions légales</a>
                  <a href="#">C.G.U</a>
                  <a href="#">C.G.V</a>
                </div>
                <div className={styles.footerColumn}>
                  <h4>GO TRUCK, BE TRUCK</h4>
                  <a href="#">La solution clé en main</a>
                  <a href="#">Rejoindre le réseau</a>
                  <a href="#">Un conseiller vous répond</a>
                  <a href="#">Foire aux questions</a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <div className={styles.socialBar}>
              <span>Nos réseaux sociaux</span>
              <div className={styles.socialIcons}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src="/facebook.svg" alt="Facebook" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src="/insta.svg" alt="Instagram" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <img src="/linkedin.svg" alt="LinkedIn" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MapPage
