import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/SplashscreenSeConnecter.module.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user, logout, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Si déjà connecté, rediriger vers home (seulement après le chargement initial)
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  // Fonction pour forcer la déconnexion et vider les cookies
  const handleForceLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Erreur logout:', err)
    }
    localStorage.removeItem('token')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.reload()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      console.error('Erreur login:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Erreur de connexion'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.splashscreenSeConnecter}>
      <div className={styles.frameParent}>
        <div className={styles.frameChild} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#85031f' }}>GoTruck</h1>
        </div>
        <form className={styles.frameGroup} onSubmit={handleSubmit}>
          <div className={styles.seConnecterParent}>
            <b className={styles.seConnecter}>Se connecter</b>
            <div className={styles.tuNasPasContainer}>
              <span className={styles.tuNasPasContainer2}>
                <span>{`Tu n'as pas encore de compte ? `}</span>
                <Link to="/signup" className={styles.sinscrire}>
                  S'inscrire
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
                  placeholder="Exemple@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '16px',
                    color: email ? '#0f0f0f' : '#6d6d6d',
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
                  placeholder="@#*%"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '16px',
                    color: password ? '#0f0f0f' : '#6d6d6d',
                    backgroundColor: 'transparent',
                    fontFamily: 'Poppins'
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.frameDiv}>
            <div className={styles.frame}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <div className={styles.square} style={{ 
                  border: '1.5px solid #85031f',
                  borderRadius: '4px',
                  backgroundColor: rememberMe ? '#85031f' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {rememberMe && (
                    <svg className={styles.vectorIcon} viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#fffbf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className={styles.seConnecter}>Rester connecté</div>
              </label>
            </div>
            <div className={styles.frame2}>
              <div className={styles.motDePasse2} style={{ cursor: 'pointer' }}>
                Mot de passe oublié ?
              </div>
            </div>
          </div>

          <button type="submit" className={styles.bouton} disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            <div className={styles.seConnecter}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </div>
          </button>

          <div className={styles.lineOr}>
            <div className={styles.lineOrChild} />
            <div className={styles.lineOrItem} />
            <div className={styles.ou}>OU</div>
          </div>

          <button type="button" className={styles.bouton2} style={{ cursor: 'pointer' }} onClick={() => alert('Connexion Google - À implémenter')}>
            <div className={styles.rectangleIcon} style={{ 
              width: '26px', 
              height: '25px', 
              backgroundColor: '#4285F4', 
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>G</div>
            <div className={styles.seConnecter}>Se connecter avec Google</div>
          </button>

          <button type="button" className={styles.bouton2} style={{ cursor: 'pointer' }} onClick={() => alert('Connexion Facebook - À implémenter')}>
            <div className={styles.rectangleIcon2} style={{ 
              width: '26px', 
              height: '26px', 
              backgroundColor: '#1877F2', 
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>f</div>
            <div className={styles.seConnecter}>Se connecter avec Facebook</div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
