import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/SplashscreenSeConnecter.module.css'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    tel: '',
    type_user: 'particulier',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!acceptTerms) {
      setError('Vous devez accepter les conditions générales d\'utilisation')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    
    setLoading(true)

    try {
      const { confirmPassword, ...signupData } = formData
      await signup(signupData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.splashscreenSeConnecter}>
      {/* Pattern d'icônes sur le fond rouge - Grille régulière en quinconce */}
      <div className={styles.backgroundPattern}>
        {/* Rangée 1 - truck burger truck burger truck burger */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '2%', left: '92%' }} />
        
        {/* Rangée 2 - décalée - burger truck burger truck burger */}
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '11%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '29%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '47%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '65%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '14%', left: '83%' }} />
        
        {/* Rangée 3 */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '26%', left: '92%' }} />
        
        {/* Rangée 4 - décalée */}
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '11%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '29%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '47%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '65%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '38%', left: '83%' }} />
        
        {/* Rangée 5 */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '50%', left: '92%' }} />
        
        {/* Rangée 6 - décalée */}
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '11%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '29%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '47%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '65%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '62%', left: '83%' }} />
        
        {/* Rangée 7 */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '74%', left: '92%' }} />
        
        {/* Rangée 8 - décalée */}
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '11%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '29%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '47%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '65%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '86%', left: '83%' }} />
        
        {/* Rangée 9 */}
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '98%', left: '2%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '98%', left: '20%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '98%', left: '38%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '98%', left: '56%' }} />
        <img src="/truckconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '98%', left: '74%' }} />
        <img src="/burgerconnexion.svg" alt="" className={styles.patternIcon} style={{ top: '98%', left: '92%' }} />
      </div>
      
      <div className={styles.frameParent} style={{ gap: '32px', overflowY: 'auto' }}>
        <div className={styles.frameChild} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <img src="/logo-header.png" alt="GoTruck" style={{ height: '35px', width: 'auto' }} />
        </div>
        
        <form className={styles.frameGroup} onSubmit={handleSubmit}>
          <div className={styles.seConnecterParent}>
            <b className={styles.seConnecter}>S'inscrire</b>
            <div className={styles.tuNasPasContainer}>
              <span className={styles.tuNasPasContainer2}>
                <span>{`Tu as déjà un compte ? `}</span>
                <Link to="/login" className={styles.sinscrire}>
                  Se connecter
                </Link>
              </span>
            </div>
          </div>

          {error && (
            <div style={{ 
              color: '#dc3545', 
              fontSize: '14px', 
              padding: '8px',
              backgroundColor: '#f8d7da',
              borderRadius: '4px',
              width: '100%'
            }}>
              {error}
            </div>
          )}

          <div className={styles.frameContainer}>
            <div className={styles.textParent}>
              <div className={styles.text}>
                <div className={styles.seConnecter}>Email</div>
              </div>
              <div className={styles.input}>
                <input
                  type="email"
                  name="email"
                  placeholder="Exemple@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '16px',
                    color: formData.email ? '#0f0f0f' : '#6d6d6d',
                    backgroundColor: 'transparent',
                    fontFamily: 'Poppins'
                  }}
                />
              </div>
            </div>
            <div className={styles.textParent}>
              <div className={styles.text}>
                <div className={styles.seConnecter}>Mot de passe</div>
              </div>
              <div className={styles.input}>
                <input
                  type="password"
                  name="password"
                  placeholder="@#*%"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '16px',
                    color: formData.password ? '#0f0f0f' : '#6d6d6d',
                    backgroundColor: 'transparent',
                    fontFamily: 'Poppins'
                  }}
                />
              </div>
            </div>
            <div className={styles.textParent}>
              <div className={styles.text}>
                <div className={styles.seConnecter}>Confirmer le mot de passe</div>
              </div>
              <div className={styles.input}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="@#*%"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '16px',
                    color: formData.confirmPassword ? '#0f0f0f' : '#6d6d6d',
                    backgroundColor: 'transparent',
                    fontFamily: 'Poppins'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#000', width: '562px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{ display: 'none' }}
              />
              <div className={styles.square} style={{ 
                border: '1.5px solid #85031f',
                borderRadius: '4px',
                backgroundColor: acceptTerms ? '#85031f' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {acceptTerms && (
                  <svg className={styles.vectorIcon} viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '16px' }}>J'accepte les Conditions Générales d'Utilisation et la Politique de Confidentialité</span>
            </label>
          </div>

          <button type="submit" className={styles.bouton} disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, border: 'none' }}>
            <div className={styles.seConnecter}>
              {loading ? 'Inscription...' : 'Continuer l\'inscription'}
            </div>
          </button>

          <div className={styles.lineOr}>
            <div className={styles.lineOrChild} />
            <div className={styles.lineOrItem} />
            <div className={styles.ou}>ou</div>
          </div>

          <button type="button" className={styles.bouton2} style={{ cursor: 'pointer' }} onClick={() => navigate('/coming-soon')}>
            <img src="/googleconnexion.png" alt="Google" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
            <div className={styles.seConnecter}>S'inscrire avec Google</div>
          </button>

          <button type="button" className={styles.bouton2} style={{ cursor: 'pointer' }} onClick={() => navigate('/coming-soon')}>
            <img src="/facebookconnexion.png" alt="Facebook" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
            <div className={styles.seConnecter}>S'inscrire avec Facebook</div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
