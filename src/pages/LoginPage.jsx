import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/LoginPage.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user, logout } = useAuth()
  const navigate = useNavigate()

  // Si déjà connecté, rediriger vers home
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  // Fonction pour forcer la déconnexion et vider les cookies
  const handleForceLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Erreur logout:', err)
    }
    // Vider aussi localStorage
    localStorage.removeItem('token')
    // Vider les cookies manuellement
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
    <div className="login-page">
      <div className="login-container">
        <h1>Connexion</h1>
        {error && <div className="error-message">{error}</div>}
        {user && (
          <div className="info-message">
            Vous êtes déjà connecté en tant que {user.email}. 
            <button type="button" onClick={handleForceLogout} className="logout-btn">
              Se déconnecter
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="signup-link">
          Pas de compte ? <Link to="/signup">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
