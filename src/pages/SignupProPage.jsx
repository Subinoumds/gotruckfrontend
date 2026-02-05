import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/SignupSteps.module.css'

const SignupProPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { updateUser } = useAuth()
  const initialData = location.state || {}

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // User data (from previous page)
    email: initialData.email || '',
    password: initialData.password || '',
    nom: initialData.nom || '',
    prenom: initialData.prenom || '',
    tel: initialData.tel || '',
    // Foodtruck data
    foodtruck_nom: '',
    foodtruck_type: '',
    foodtruck_type_cuisine: '',
    foodtruck_description: '',
    foodtruck_photo_url: '',
    foodtruck_menu_photos: [],
    foodtruck_horaires: JSON.stringify({
      lundi: { ouvert: false, debut: '09:00', fin: '18:00' },
      mardi: { ouvert: false, debut: '09:00', fin: '18:00' },
      mercredi: { ouvert: false, debut: '09:00', fin: '18:00' },
      jeudi: { ouvert: false, debut: '09:00', fin: '18:00' },
      vendredi: { ouvert: false, debut: '09:00', fin: '18:00' },
      samedi: { ouvert: false, debut: '09:00', fin: '18:00' },
      dimanche: { ouvert: false, debut: '09:00', fin: '18:00' }
    }),
    foodtruck_menu: JSON.stringify([]),
    foodtruck_ville: '',
    foodtruck_adresse: ''
  })

  const [horaires, setHoraires] = useState({
    lundi: { ouvert: false, debut: '09:00', fin: '18:00' },
    mardi: { ouvert: false, debut: '09:00', fin: '18:00' },
    mercredi: { ouvert: false, debut: '09:00', fin: '18:00' },
    jeudi: { ouvert: false, debut: '09:00', fin: '18:00' },
    vendredi: { ouvert: false, debut: '09:00', fin: '18:00' },
    samedi: { ouvert: false, debut: '09:00', fin: '18:00' },
    dimanche: { ouvert: false, debut: '09:00', fin: '18:00' }
  })

  const [menu, setMenu] = useState([])
  const [newPlat, setNewPlat] = useState({ nom: '', prix: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleHoraireChange = (jour, field, value) => {
    setHoraires({
      ...horaires,
      [jour]: {
        ...horaires[jour],
        [field]: value
      }
    })
  }

  const handleAddPlat = () => {
    if (newPlat.nom && newPlat.prix) {
      setMenu([...menu, { ...newPlat }])
      setNewPlat({ nom: '', prix: '' })
    }
  }

  const handleRemovePlat = (index) => {
    setMenu(menu.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (e, isMultiple = false) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      console.log('No files selected')
      return
    }

    setLoading(true)
    setError('')

    try {
      const uploadedUrls = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error('Le fichier doit être une image')
        }

        const formDataUpload = new FormData()
        formDataUpload.append('photo', file)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/photo/public`, {
          method: 'POST',
          body: formDataUpload
        })

        const data = await response.json()

        if (!response.ok) {
          console.error('Upload error:', data)
          throw new Error(data.error || 'Erreur lors de l\'upload')
        }

        console.log('Upload success:', data)
        uploadedUrls.push(data.photo_url)
      }

      if (isMultiple) {
        setFormData({
          ...formData,
          foodtruck_menu_photos: [...formData.foodtruck_menu_photos, ...uploadedUrls]
        })
      } else {
        setFormData({
          ...formData,
          foodtruck_photo_url: uploadedUrls[0]
        })
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Erreur lors de l\'upload')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setError('')

    if (step === 1) {
      if (!formData.nom || !formData.prenom || !formData.tel) {
        setError('Tous les champs sont requis')
        return
      }
    } else if (step === 2) {
      if (!formData.foodtruck_nom || !formData.foodtruck_type || !formData.foodtruck_type_cuisine) {
        setError('Le nom, le type et la cuisine sont requis')
        return
      }
    }

    setStep(step + 1)
  }

  const handleBack = () => {
    if (step === 1) {
      navigate('/signup', { state: initialData })
    } else {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        ...formData,
        foodtruck_horaires: JSON.stringify(horaires),
        foodtruck_menu: JSON.stringify(menu)
      }

      console.log('Signup payload:', payload)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup/trucker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      console.log('Signup response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      // Mettre à jour le contexte utilisateur et rediriger
      updateUser(data.user)
      navigate('/trucker/location')
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h1 className={styles.mainTitle}>Informations personnelles</h1>
            <p className={styles.subTitle}>Étape 1/4</p>

            <div className={styles.formGroup}>
              <label>Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Téléphone *</label>
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )

      case 2:
        return (
          <>
            <h1 className={styles.mainTitle}>Informations du Food Truck</h1>
            <p className={styles.subTitle}>Étape 2/4</p>

            <div className={styles.formGroup}>
              <label>Nom du Food Truck *</label>
              <input
                type="text"
                name="foodtruck_nom"
                value={formData.foodtruck_nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Type *</label>
              <select
                name="foodtruck_type"
                value={formData.foodtruck_type}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner...</option>
                <option value="Burger">Burger</option>
                <option value="Pizza">Pizza</option>
                <option value="Tacos">Tacos</option>
                <option value="Crêpes">Crêpes</option>
                <option value="Glaces">Glaces</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Cuisine *</label>
              <select
                name="foodtruck_type_cuisine"
                value={formData.foodtruck_type_cuisine}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner...</option>
                <option value="Française">Française</option>
                <option value="Italienne">Italienne</option>
                <option value="Mexicaine">Mexicaine</option>
                <option value="Asiatique">Asiatique</option>
                <option value="Américaine">Américaine</option>
                <option value="Végétarienne">Végétarienne</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="foodtruck_description"
                value={formData.foodtruck_description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Ville</label>
              <input
                type="text"
                name="foodtruck_ville"
                value={formData.foodtruck_ville || ''}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Adresse</label>
              <input
                type="text"
                name="foodtruck_adresse"
                value={formData.foodtruck_adresse || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )

      case 3:
        return (
          <>
            <h1 className={styles.mainTitle}>Images</h1>
            <p className={styles.subTitle}>Étape 3/4</p>

            <div className={styles.formGroup}>
              <label>Photo principale</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                disabled={loading}
              />
              {formData.foodtruck_photo_url && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${formData.foodtruck_photo_url}`}
                  alt="Preview"
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                />
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Photos du menu (max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, true)}
                disabled={loading || formData.foodtruck_menu_photos.length >= 5}
              />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {formData.foodtruck_menu_photos.map((url, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_API_URL}${url}`}
                    alt={`Menu ${index + 1}`}
                    style={{ maxWidth: '100px' }}
                  />
                ))}
              </div>
            </div>
          </>
        )

      case 4:
        return (
          <>
            <h1 className={styles.mainTitle}>Horaires & Menu</h1>
            <p className={styles.subTitle}>Étape 4/4</p>

            <div className={styles.formGroup}>
              <label>Horaires d'ouverture</label>
              {Object.keys(horaires).map((jour) => (
                <div key={jour} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ width: '100px', textTransform: 'capitalize' }}>
                    <input
                      type="checkbox"
                      checked={horaires[jour].ouvert}
                      onChange={(e) => handleHoraireChange(jour, 'ouvert', e.target.checked)}
                    />
                    {' '}{jour}
                  </label>
                  {horaires[jour].ouvert && (
                    <>
                      <input
                        type="time"
                        value={horaires[jour].debut}
                        onChange={(e) => handleHoraireChange(jour, 'debut', e.target.value)}
                        style={{ width: '120px' }}
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={horaires[jour].fin}
                        onChange={(e) => handleHoraireChange(jour, 'fin', e.target.value)}
                        style={{ width: '120px' }}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.formGroup}>
              <label>Menu</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Nom du plat"
                  value={newPlat.nom}
                  onChange={(e) => setNewPlat({ ...newPlat, nom: e.target.value })}
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="Prix (€)"
                  value={newPlat.prix}
                  onChange={(e) => setNewPlat({ ...newPlat, prix: e.target.value })}
                  style={{ width: '100px' }}
                />
                <button type="button" onClick={handleAddPlat} className={styles.btnAdd}>
                  Ajouter
                </button>
              </div>

              <div>
                {menu.map((plat, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f5f5f5', marginBottom: '5px', borderRadius: '4px' }}>
                    <span>{plat.nom}</span>
                    <span>{plat.prix}€</span>
                    <button type="button" onClick={() => handleRemovePlat(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.signupStepContainer}>
      <div className={styles.logoContainer}>
        <img src="/logo-header.png" alt="GoTruck" className={styles.logo} style={{ filter: 'brightness(0) invert(1)' }} />
      </div>

      <div className={styles.formPanel}>
        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {error && (
            <div style={{
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {renderStep()}

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button
              type="button"
              className={styles.btnBack}
              onClick={handleBack}
              disabled={loading}
            >
              <img src="/arrow-left.svg" alt="" className={styles.btnIcon} />
              Retour
            </button>

            <button
              type="submit"
              className={styles.btnNext}
              disabled={loading}
            >
              {loading ? 'Chargement...' : (step === 4 ? 'Créer mon compte' : 'Suivant')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupProPage
