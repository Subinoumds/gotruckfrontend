import { useState, useEffect } from 'react'
import truckerService from '../../services/truckerService'
import TruckerHeader from '../../components/TruckerHeader'
import styles from '../../styles/TruckerPages.module.css'

const FoodtruckPage = () => {
    const [foodtrucks, setFoodtrucks] = useState([])
    const [selectedFoodtruck, setSelectedFoodtruck] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        nom: '',
        type: '',
        type_cuisine: '',
        description: '',
        photo_url: '',
        menu_photos: [],
        horaires: '{}',
        menu: '[]',
        ville: '',
        adresse: ''
    })

    const [horaires, setHoraires] = useState({})
    const [menu, setMenu] = useState([])
    const [newPlat, setNewPlat] = useState({ nom: '', prix: '' })

    useEffect(() => {
        loadFoodtrucks()
    }, [])

    useEffect(() => {
        if (selectedFoodtruck) {
            loadFoodtruckDetails()
        }
    }, [selectedFoodtruck])

    const loadFoodtrucks = async () => {
        try {
            const data = await truckerService.getFoodtrucks()
            setFoodtrucks(data)
            if (data.length > 0) {
                setSelectedFoodtruck(data[0].id)
            }
        } catch (err) {
            setError(err.message)
        }
    }

    const loadFoodtruckDetails = async () => {
        try {
            const ft = await truckerService.getFoodtruck(selectedFoodtruck)
            setFormData({
                nom: ft.nom || '',
                type: ft.type || '',
                type_cuisine: ft.type_cuisine || '',
                description: ft.description || '',
                photo_url: ft.photo_url || '',
                menu_photos: ft.menu_photos || [],
                horaires: ft.horaires || '{}',
                menu: ft.menu || '[]',
                ville: ft.ville || '',
                adresse: ft.adresse || ''
            })

            // Parse horaires and menu
            try {
                setHoraires(JSON.parse(ft.horaires || '{}'))
            } catch {
                setHoraires({})
            }

            try {
                setMenu(JSON.parse(ft.menu || '[]'))
            } catch {
                setMenu([])
            }
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
        if (!files || files.length === 0) return

        setLoading(true)
        setError('')

        try {
            const uploadedUrls = []

            for (let i = 0; i < files.length; i++) {
                const url = await truckerService.uploadImage(files[i])
                uploadedUrls.push(url)
            }

            if (isMultiple) {
                setFormData({
                    ...formData,
                    menu_photos: [...formData.menu_photos, ...uploadedUrls]
                })
            } else {
                setFormData({
                    ...formData,
                    photo_url: uploadedUrls[0]
                })
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const updateData = {
                ...formData,
                horaires: JSON.stringify(horaires),
                menu: JSON.stringify(menu)
            }

            await truckerService.updateFoodtruck(selectedFoodtruck, updateData)
            setSuccess('Food Truck mis à jour avec succès')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

    return (
        <div className={styles.container}>
            <TruckerHeader currentPage="foodtruck" />

            <div className={styles.content}>
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                {foodtrucks.length === 0 ? (
                    <div className={styles.card}>
                        <p>Tu n'as pas encore de Food Truck.</p>
                        <a href="/trucker/create" className={styles.btnPrimary}>
                            Créer mon premier Food Truck
                        </a>
                    </div>
                ) : (
                    <>
                        <div className={styles.card}>
                            <h2>Sélectionner un Food Truck</h2>
                            <select
                                value={selectedFoodtruck || ''}
                                onChange={(e) => setSelectedFoodtruck(Number(e.target.value))}
                                className={styles.select}
                            >
                                {foodtrucks.map((ft) => (
                                    <option key={ft.id} value={ft.id}>
                                        {ft.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedFoodtruck && (
                            <div className={styles.card}>
                                <h2>Modifier les informations</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.formGroup}>
                                        <label>Nom du Food Truck *</label>
                                        <input
                                            type="text"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Type *</label>
                                        <select
                                            name="type"
                                            value={formData.type}
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
                                            name="type_cuisine"
                                            value={formData.type_cuisine}
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
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Ville</label>
                                        <input
                                            type="text"
                                            name="ville"
                                            value={formData.ville}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Adresse</label>
                                        <input
                                            type="text"
                                            name="adresse"
                                            value={formData.adresse}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                                    <h3>Images</h3>

                                    <div className={styles.formGroup}>
                                        <label>Photo principale</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, false)}
                                            disabled={loading}
                                        />
                                        {formData.photo_url && (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${formData.photo_url}`}
                                                alt="Preview"
                                                style={{ maxWidth: '200px', marginTop: '10px' }}
                                            />
                                        )}
                                    </div>

                                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                                    <h3>Horaires d'ouverture</h3>
                                    {jours.map((jour) => (
                                        <div key={jour} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                            <label style={{ width: '100px', textTransform: 'capitalize' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={horaires[jour]?.ouvert || false}
                                                    onChange={(e) => handleHoraireChange(jour, 'ouvert', e.target.checked)}
                                                />
                                                {' '}{jour}
                                            </label>
                                            {horaires[jour]?.ouvert && (
                                                <>
                                                    <input
                                                        type="time"
                                                        value={horaires[jour]?.debut || '09:00'}
                                                        onChange={(e) => handleHoraireChange(jour, 'debut', e.target.value)}
                                                        style={{ width: '120px' }}
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="time"
                                                        value={horaires[jour]?.fin || '18:00'}
                                                        onChange={(e) => handleHoraireChange(jour, 'fin', e.target.value)}
                                                        style={{ width: '120px' }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    ))}

                                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

                                    <h3>Menu</h3>
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
                                        <button type="button" onClick={handleAddPlat} className={styles.btnPrimary}>
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

                                    <button type="submit" className={styles.btnSubmit} disabled={loading} style={{ marginTop: '30px' }}>
                                        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default FoodtruckPage
