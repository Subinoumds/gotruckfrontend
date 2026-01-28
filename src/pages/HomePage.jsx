import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import DistanceFilter from '../components/Filters/DistanceFilter'
import CuisineFilter from '../components/Filters/CuisineFilter'
import PlatsFilter from '../components/Filters/PlatsFilter'
import HorizontalScroll from '../components/HorizontalScroll'
import { foodtruckService } from '../services/foodtruckService'
import { favoriService } from '../services/favoriService'
import { getImageUrl } from '../services/api'
import styles from '../styles/Connexion.module.css'

const HomePage = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [foodtrucks, setFoodtrucks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    distance: null,
    cuisine: null,
    plats: []
  })
  const [selectedPlatType, setSelectedPlatType] = useState('Tous')
  const [favoriteIds, setFavoriteIds] = useState([])

  // Charger les favoris de l'utilisateur
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const ids = await favoriService.getIds()
          // S'assurer que les IDs sont des numbers
          setFavoriteIds(ids.map(id => Number(id)))
        } catch (err) {
          console.error('Erreur chargement favoris:', err)
        }
      } else {
        setFavoriteIds([])
      }
    }
    loadFavorites()
  }, [user])

  // Fonction pour toggle un favori
  const handleToggleFavorite = async (e, foodtruckId) => {
    e.stopPropagation() // Empêcher la propagation du clic
    if (!user) {
      // Rediriger vers login si non connecté
      alert('Connectez-vous pour ajouter des favoris')
      return
    }
    const id = Number(foodtruckId)
    try {
      const result = await favoriService.toggle(id)
      if (result.isFavorite) {
        setFavoriteIds(prev => [...prev, id])
      } else {
        setFavoriteIds(prev => prev.filter(fid => fid !== id))
      }
    } catch (err) {
      console.error('Erreur toggle favori:', err)
    }
  }

  // Vérifier si un foodtruck est en favori
  const isFavorite = (foodtruckId) => favoriteIds.includes(Number(foodtruckId))

  // Demander la géolocalisation au chargement
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => {
          console.error('Erreur géolocalisation:', err)
        }
      )
    }
  }, [])

  // Charger les foodtrucks
  useEffect(() => {
    const loadFoodtrucks = async () => {
      setLoading(true)
      try {
        let data
        if (location && filters.distance) {
          // Préparation des filtres supplémentaires
          const extraFilters = {}
          if (filters.cuisine) extraFilters.type_cuisine = filters.cuisine
          if (searchQuery) extraFilters.q = searchQuery
          // Note: filters.plats peut être mappé sur 'type' si nécessaire, ici on l'ignore pour l'instant ou on le passe si le backend le supporte.
          // Le backend supporte 'type' et 'type_cuisine'. On peut mapper filters.plats[0] sur type si un seul est sélectionné ?
          // Pour l'instant on se concentre sur cuisine et search.

          data = await foodtruckService.getNearby(
            location.lat,
            location.lng,
            filters.distance,
            null, null, null, 50, 0,
            extraFilters
          )
        } else {
          const apiFilters = {}
          if (filters.cuisine) apiFilters.type_cuisine = filters.cuisine
          if (searchQuery) apiFilters.q = searchQuery
          data = await foodtruckService.getAll(apiFilters)
        }

        setFoodtrucks(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Erreur chargement foodtrucks:', err)
        setError('Erreur lors du chargement des foodtrucks')
        setFoodtrucks([])
      } finally {
        setLoading(false)
      }
    }

    loadFoodtrucks()
  }, [location, filters, searchQuery])

  const formatDistance = (km) => {
    if (!km) return 'À moins de 1 km'
    if (km < 0.5) return 'Moins de 500m'
    if (km < 1) return 'À moins de 1 km'
    if (km < 2) return 'À moins de 2 km'
    if (km < 5) return 'À moins de 5 km'
    return `${km.toFixed(1)} km`
  }

  // Trier par note moyenne (les mieux notés en premier) et prendre les 8 premiers
  const sortedFoodtrucks = [...foodtrucks].sort((a, b) => {
    const noteA = parseFloat(a.note_moyenne) || 0
    const noteB = parseFloat(b.note_moyenne) || 0
    return noteB - noteA
  })

  // Filtrer selon le type de plat sélectionné pour la deuxième section
  let filteredSecondSection = sortedFoodtrucks.slice(8)
  if (selectedPlatType && selectedPlatType !== 'Tous') {
    filteredSecondSection = filteredSecondSection.filter(ft => {
      const description = (ft.description || '').toLowerCase()
      const typeCuisine = (ft.type_cuisine || '').toLowerCase()
      const nom = (ft.nom || '').toLowerCase()
      const platType = selectedPlatType.toLowerCase()
      return description.includes(platType) ||
        typeCuisine.includes(platType) ||
        nom.includes(platType)
    })
  }

  // Prendre les 8 mieux notés pour la première section
  const firstSectionFoodtrucks = sortedFoodtrucks.slice(0, 8)
  // Le reste filtré pour la section scrollable
  const secondSectionFoodtrucks = filteredSecondSection

  return (
    <div className={styles.homepageInscriptionconnexi}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.groupeHeader}>
        <div className={styles.headerBackgroundWrapper}>
          <div className={styles.calque1Icon} style={{ background: 'linear-gradient(180deg, #85031f, #ec6827)' }} />
        </div>
        <div className={styles.header}>
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <div className={styles.container4}>
          <div className={styles.heading1}>
            <b className={styles.inscription}>Géoloc ta faim, trouve ton truck !</b>
          </div>
        </div>

        <div className={styles.searchbar}>
          <div className={styles.groupeInputButton}>
            <div className={styles.container5}>
              <div className={styles.input}>
                <div className={styles.rechercherUnFoodTruckWrapper}>
                  <input
                    type="text"
                    className={styles.rechercherUnFood}
                    placeholder="Rechercher un Food Truck..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        // La recherche se déclenche automatiquement via le useEffect
                      }
                    }}
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      color: 'inherit'
                    }} />
                </div>
              </div>
            </div>
            <button
              type="button"
              className={styles.bouton3}
              onClick={() => {
                // La recherche se déclenche automatiquement via le useEffect qui écoute searchQuery
                // On peut forcer un re-render si nécessaire
              }}
              style={{ cursor: 'pointer', border: 'none', position: 'relative', top: '-8px' }}
            >
              <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none">
                <path d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zm0 0l5 5" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className={styles.inscription}>Rechercher</div>
            </button>
          </div>

          <div className={styles.container6}>
            <DistanceFilter onDistanceChange={(distance) => setFilters({ ...filters, distance })} />
            <CuisineFilter onCuisineChange={(cuisine) => setFilters({ ...filters, cuisine })} />
            <PlatsFilter onPlatsChange={(plats) => setFilters({ ...filters, plats })} />
          </div>
        </div>
      </div>

      <div className={styles.backgroundParent}>
        <div className={styles.background}>
          <div className={styles.container7}>
            <div className={styles.lesFoodTrucksOnFiiiiireWrapper}>
              <div className={styles.lesFoodTrucks}>Les Food Trucks on fiiiiire 🔥</div>
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
                <div style={{ fontSize: '16px', fontWeight: '500' }}>Chargement des food trucks...</div>
              </div>
            ) : (
              <div style={{ width: '100%', padding: '0 20px' }}>
                <HorizontalScroll className={styles.scrollWrapper} style={{ padding: 0 }}>
                  {firstSectionFoodtrucks.length === 0 ? (
                    <div style={{
                      padding: '60px 0',
                      textAlign: 'left',
                      color: '#85031f',
                      minWidth: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div style={{ fontSize: '18px', fontWeight: '600' }}>Aucun foodtruck trouvé</div>
                      <div style={{ fontSize: '14px', opacity: 0.7 }}>Essayez de modifier vos filtres</div>
                    </div>
                  ) : (
                    firstSectionFoodtrucks.map((ft) => (
                      <div key={ft.id} className={styles.cardFoodTruck}>
                        <div className={styles.link}>
                          <div className={styles.background2}>
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
                            <div className={styles.container8}>
                              {ft.distance_km && (
                                <div className={styles.overlay}>
                                  <div className={styles.moinsDe1}>{formatDistance(ft.distance_km)}</div>
                                </div>
                              )}
                              <div
                                className={styles.coeur}
                                onClick={(e) => handleToggleFavorite(e, ft.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none">
                                  <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                    stroke="#85031f"
                                    strokeWidth="2"
                                    fill={isFavorite(ft.id) ? '#85031f' : 'none'}
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className={styles.container9}>
                            <div className={styles.container10}>
                              <b className={styles.bniBurritos}>{ft.nom?.toUpperCase() || 'FOOD TRUCK'}</b>
                            </div>
                            <div className={styles.container11}>
                              <div className={styles.container12}>
                                <svg className={styles.svgIcon2} viewBox="0 0 16 16" fill="none">
                                  <path d="M8 0L10.5 5.5L16 6.5L12 10.5L13 16L8 13L3 16L4 10.5L0 6.5L5.5 5.5L8 0Z" fill="#85031f" />
                                </svg>
                                <div className={styles.container13}>
                                  <div className={styles.loremIpsum}>
                                    {ft.note_moyenne ? `${parseFloat(ft.note_moyenne).toFixed(1)} ⭐` : 'Nouveau'}
                                  </div>
                                </div>
                              </div>
                              {ft.emplacement_nom && (
                                <div className={styles.container14}>
                                  <svg className={styles.svgIcon2} viewBox="0 0 16 16" fill="none">
                                    <path d="M8 0C5.2 0 3 2.2 3 5c0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z" fill="#85031f" />
                                  </svg>
                                  <div className={styles.container13}>
                                    <div className={styles.loremIpsum}>{ft.emplacement_nom}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className={styles.container16}>
                              <div className={styles.container17}>
                                <div className={styles.menuPartir}>Menu disponible</div>
                              </div>
                            </div>
                            <div className={styles.container18}>
                              {ft.type_cuisine && (
                                <div className={styles.tag}>
                                  <div className={styles.mexicain}>{ft.type_cuisine}</div>
                                </div>
                              )}
                              {ft.type && (
                                <div className={styles.tag}>
                                  <div className={styles.mexicain}>{ft.type}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </HorizontalScroll>
              </div>
            )}
          </div>
        </div>

        <div className={styles.background10}>
          <div className={styles.container7}>
            <div className={styles.desFoodTrucksPourTousLesWrapper}>
              <div className={styles.lesFoodTrucks}>Des Food Trucks pour tous les goûts 😋</div>
            </div>
            <div className={styles.containerParent}>
              <div className={styles.container97} style={{ backgroundImage: 'url(/Container.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.link9}>
                  <div className={styles.container98}>
                    <div className={styles.button}>
                      <div className={styles.container99}>
                        <b className={styles.amricain}>Belge</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container97} style={{ backgroundImage: 'url(/Container.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.link9}>
                  <div className={styles.container98}>
                    <div className={styles.button}>
                      <div className={styles.container99}>
                        <b className={styles.amricain}>Américain</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container97} style={{ backgroundImage: 'url(/Container.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.link9}>
                  <div className={styles.container98}>
                    <div className={styles.button}>
                      <div className={styles.container99}>
                        <b className={styles.amricain}>Mexicain</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container97} style={{ backgroundImage: 'url(/Container.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.link9}>
                  <div className={styles.container98}>
                    <div className={styles.button}>
                      <div className={styles.container99}>
                        <b className={styles.amricain}>Asiatique</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.containerGroup}>
              <div className={styles.container97} style={{ backgroundImage: 'url(/Container.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.link9}>
                  <div className={styles.container98}>
                    <div className={styles.button}>
                      <div className={styles.container99}>
                        <b className={styles.amricain}>Italien</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container97} style={{ backgroundImage: 'url(/Container.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.link9}>
                  <div className={styles.container98}>
                    <div className={styles.button}>
                      <div className={styles.container99}>
                        <b className={styles.amricain}>Français</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container97} style={{ backgroundImage: 'url(/Container.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.link9}>
                  <div className={styles.container98}>
                    <div className={styles.button}>
                      <div className={styles.container99}>
                        <b className={styles.amricain}>Antillais</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container97} style={{ backgroundImage: 'url(/Container.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.link9}>
                  <div className={styles.container98}>
                    <div className={styles.button}>
                      <div className={styles.container99}>
                        <b className={styles.amricain}>Évènementiels</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.background11}>
          <div className={styles.container121}>
            <div className={styles.pourLesPlusGourmandsParent}>
              <div className={styles.lesFoodTrucks}>Pour les plus gourmands 🤤</div>
              <button
                type="button"
                className={styles.bouton4}
                onClick={() => setSelectedPlatType('Tous')}
              >
                <div className={styles.inscription}>Voir tout</div>
              </button>
            </div>
            <div className={styles.tabFoodIcon}>
              {/* Tous */}
              <button
                type="button"
                className={selectedPlatType === 'Tous' ? styles.button9 : styles.button10}
                onClick={() => setSelectedPlatType('Tous')}
              >
                <div className={styles.foodIcons}>
                  <img src="/tous.svg" alt="Tous" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: selectedPlatType === 'Tous' ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
                <div className={styles.container122}>
                  <b className={styles.amricain} style={{ color: selectedPlatType === 'Tous' ? '#fef6ee' : '#0f0f0f' }}>Tous</b>
                </div>
              </button>
              {/* Pizza */}
              <button
                type="button"
                className={selectedPlatType === 'Pizza' ? styles.button9 : styles.button10}
                onClick={() => setSelectedPlatType('Pizza')}
              >
                <div className={styles.foodIcons}>
                  <img src="/pizza.svg" alt="Pizza" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: selectedPlatType === 'Pizza' ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
                <div className={styles.container122}>
                  <b className={styles.amricain} style={{ color: selectedPlatType === 'Pizza' ? '#fef6ee' : '#0f0f0f' }}>Pizza</b>
                </div>
              </button>
              {/* Frites */}
              <button
                type="button"
                className={selectedPlatType === 'Frites' ? styles.button9 : styles.button10}
                onClick={() => setSelectedPlatType('Frites')}
              >
                <div className={styles.foodIcons}>
                  <img src="/frites.svg" alt="Frites" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: selectedPlatType === 'Frites' ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
                <div className={styles.container122}>
                  <b className={styles.amricain} style={{ color: selectedPlatType === 'Frites' ? '#fef6ee' : '#0f0f0f' }}>Frites</b>
                </div>
              </button>
              {/* Tacos */}
              <button
                type="button"
                className={selectedPlatType === 'Tacos' ? styles.button9 : styles.button10}
                onClick={() => setSelectedPlatType('Tacos')}
              >
                <div className={styles.foodIcons}>
                  <img src="/tacos.svg" alt="Tacos" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: selectedPlatType === 'Tacos' ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
                <div className={styles.container122}>
                  <b className={styles.amricain} style={{ color: selectedPlatType === 'Tacos' ? '#fef6ee' : '#0f0f0f' }}>Tacos</b>
                </div>
              </button>
              {/* Burger */}
              <button
                type="button"
                className={selectedPlatType === 'Burger' ? styles.button9 : styles.button10}
                onClick={() => setSelectedPlatType('Burger')}
              >
                <div className={styles.foodIcons}>
                  <img src="/burger.svg" alt="Burger" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: selectedPlatType === 'Burger' ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
                <div className={styles.container122}>
                  <b className={styles.amricain} style={{ color: selectedPlatType === 'Burger' ? '#fef6ee' : '#0f0f0f' }}>Burger</b>
                </div>
              </button>
              {/* Hotdog */}
              <button
                type="button"
                className={selectedPlatType === 'Hotdog' ? styles.button9 : styles.button10}
                onClick={() => setSelectedPlatType('Hotdog')}
              >
                <div className={styles.foodIcons}>
                  <img src="/hotdog.svg" alt="Hotdog" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: selectedPlatType === 'Hotdog' ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
                <div className={styles.container122}>
                  <b className={styles.amricain} style={{ color: selectedPlatType === 'Hotdog' ? '#fef6ee' : '#0f0f0f' }}>Hotdog</b>
                </div>
              </button>
              {/* Sandwich */}
              <button
                type="button"
                className={selectedPlatType === 'Sandwich' ? styles.button9 : styles.button10}
                onClick={() => setSelectedPlatType('Sandwich')}
              >
                <div className={styles.foodIcons}>
                  <img src="/sandwich.svg" alt="Sandwich" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: selectedPlatType === 'Sandwich' ? 'brightness(0) invert(1)' : 'none' }} />
                </div>
                <div className={styles.container122}>
                  <b className={styles.amricain} style={{ color: selectedPlatType === 'Sandwich' ? '#fef6ee' : '#0f0f0f' }}>Sandwich</b>
                </div>
              </button>
            </div>
            <div style={{ width: '100%', padding: '0 20px' }}>
              <HorizontalScroll className={styles.scrollWrapper} style={{ padding: 0 }}>
                {secondSectionFoodtrucks.map((ft) => (
                  <div key={ft.id} className={styles.cardFoodTruck9}>
                    <div className={styles.link}>
                      <div className={styles.background2}>
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
                        <div className={styles.container8}>
                          {ft.distance_km && (
                            <div className={styles.overlay}>
                              <div className={styles.moinsDe1}>{formatDistance(ft.distance_km)}</div>
                            </div>
                          )}
                          <div
                            className={styles.coeur}
                            onClick={(e) => handleToggleFavorite(e, ft.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <svg className={styles.svgIcon} viewBox="0 0 24 24" fill="none">
                              <path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                stroke="#85031f"
                                strokeWidth="2"
                                fill={isFavorite(ft.id) ? '#85031f' : 'none'}
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={styles.container9}>
                        <div className={styles.container10}>
                          <b className={styles.bniBurritos}>{ft.nom?.toUpperCase() || 'FOOD TRUCK'}</b>
                        </div>
                        <div className={styles.container11}>
                          <div className={styles.container12}>
                            <svg className={styles.svgIcon2} viewBox="0 0 16 16" fill="none">
                              <path d="M8 0L10.5 5.5L16 6.5L12 10.5L13 16L8 13L3 16L4 10.5L0 6.5L5.5 5.5L8 0Z" fill="#85031f" />
                            </svg>
                            <div className={styles.container13}>
                              <div className={styles.loremIpsum}>
                                {ft.note_moyenne ? `${parseFloat(ft.note_moyenne).toFixed(1)} ⭐` : 'Nouveau'}
                              </div>
                            </div>
                          </div>
                          {ft.emplacement_nom && (
                            <div className={styles.container14}>
                              <svg className={styles.svgIcon2} viewBox="0 0 16 16" fill="none">
                                <path d="M8 0C5.2 0 3 2.2 3 5c0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z" fill="#85031f" />
                              </svg>
                              <div className={styles.container13}>
                                <div className={styles.loremIpsum}>{ft.emplacement_nom}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={styles.container16}>
                          <div className={styles.container17}>
                            <div className={styles.menuPartir}>Menu disponible</div>
                          </div>
                        </div>
                        <div className={styles.container18}>
                          {ft.type_cuisine && (
                            <div className={styles.tag}>
                              <div className={styles.mexicain}>{ft.type_cuisine}</div>
                            </div>
                          )}
                          {ft.type && (
                            <div className={styles.tag}>
                              <div className={styles.mexicain}>{ft.type}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </HorizontalScroll>
            </div>
          </div>
        </div>
      </div>


      <div className={styles.footer}>

        <div className={styles.containerContainer}>
          <div className={styles.container195}>
            <div className={styles.containerIcon15} style={{
              height: '48px',
              width: '264px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <img src="/logo-footer.png" alt="GoTruck" style={{ height: '100%', width: 'auto' }} />
            </div>
            <div className={styles.container196}>
              <div className={styles.container16}>
                <div className={styles.heading2}>
                  <b className={styles.plusDe3500}>Plus de 3500 food trucks dans toute la france</b>
                </div>
              </div>
              <div className={styles.container198}>
                <div className={styles.container199}>
                  <div className={styles.container200}>
                    <b className={styles.entreprise}>Entreprise</b>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>Nous contacter</div>
                  </div>
                  <div className={styles.container202}>
                    <div className={styles.linkNous}>Qui sommes-nous ?</div>
                  </div>
                  <div className={styles.container203}>
                    <div className={styles.linkNous}>Devenir actionnaire</div>
                  </div>
                  <div className={styles.container203}>
                    <div className={styles.linkNous}>On recrute !</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>Mentions légales</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>Gestion des cookies</div>
                  </div>
                </div>
                <div className={styles.container199}>
                  <div className={styles.container208}>
                    <b className={styles.entreprise}>FOOD TRUCKERS</b>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>GoTruck Academy</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>L'espace pro</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>Inscription Food Truck</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>Guide des emballages</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>Hygiène et sécurité</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>FAQ Restaurateurs</div>
                  </div>
                </div>
                <div className={styles.container199}>
                  <div className={styles.container200}>
                    <b className={styles.entreprise}>EVENEMENTS</b>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>Privatiser un truck</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>GoTruck Festival</div>
                  </div>
                  <div className={styles.container201}>
                    <div className={styles.linkNous}>Agenda</div>
                  </div>
                </div>
                <div className={styles.container221}>
                  <div className={styles.container222}>
                    <b className={styles.entreprise}>AIDE</b>
                  </div>
                  <div className={styles.container223}>
                    <div className={styles.linkNous}>Centre d'aide</div>
                  </div>
                  <div className={styles.container223}>
                    <div className={styles.linkNous}>Contact support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.background18}>
            <div className={styles.nosRseauxSociaux}>Nos réseaux sociaux</div>
            <div className={styles.rs}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="/facebook.svg" alt="Facebook" className={styles.svgIcon43} style={{ width: '32px', height: '32px' }} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/insta.svg" alt="Instagram" className={styles.svgIcon43} style={{ width: '32px', height: '32px' }} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <img src="/linkedin.svg" alt="LinkedIn" className={styles.groupIcon} style={{ width: '32px', height: '32px' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
