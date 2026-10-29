import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SeriesPage from './pages/SeriesPage'
import AuthorsPage from './pages/AuthorsPage'
import ChaptersPage from './pages/ChaptersPage'
import SingleSeriePage from './pages/SingleSeriePage'
import SingleChapterPage from './pages/SingleChapter'
import SingleAuthorPage from './pages/SingleAuthor'
import Disconnect from './components/Disconnect'
import ErrorBoundary from './components/ErrorBoundary'
import Register from './pages/Resgister'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'
import AccountPage from './pages/AccountPage'
import NotFound from './pages/NotFound'
import { RequireAuth } from './RequireAuth'
import { RequireGuest } from './RequireGuest'
import { useAuth } from './context/useAuth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'active' : undefined

function Navigation() {
  const { user, loading } = useAuth()

  return (
    <nav className="nav-header" aria-label="Main navigation">
      <div>
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/series" className={navLinkClass}>Series</NavLink>
        <NavLink to="/authors" className={navLinkClass}>Authors</NavLink>
        <NavLink to="/chapters" className={navLinkClass}>Chapters</NavLink>
      </div>

      <div>
        {loading ? (
          <span className="nav-status" aria-live="polite">
            Checking session...
          </span>
        ) : user ? (
          <>
            <NavLink to={`/profile/${user.id}`} className={navLinkClass}>
              {user.username}
            </NavLink>
            <Disconnect />
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            <NavLink to="/register" className={navLinkClass}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/series/:id" element={<SingleSeriePage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/authors/:id" element={<SingleAuthorPage />} />
          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/chapters/:id" element={<SingleChapterPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />

          <Route element={<RequireGuest />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="/account" element={<AccountPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
