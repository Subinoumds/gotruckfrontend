import { useAuth } from '../contexts/AuthContext'
import '../styles/HomePage.css'

const HomePage = () => {
  const { user, logout } = useAuth()

  return (
    <div className="home-page">
      <header>
        <h1>GoTruck</h1>
        <div className="user-info">
          <span>Bonjour, {user?.prenom || user?.email}</span>
          <button onClick={logout}>Déconnexion</button>
        </div>
      </header>
      <main>
        <h2>Bienvenue sur GoTruck</h2>
        <p>Type d'utilisateur: {user?.type_user}</p>
        {/* Ici tu ajouteras la liste des foodtrucks avec géolocalisation */}
      </main>
    </div>
  )
}

export default HomePage
