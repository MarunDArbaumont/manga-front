import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import SeriesPage from './pages/SeriesPage'
import AuthorsPage from './pages/AuthorsPage'
import ChaptersPage from './pages/ChaptersPage'

function App() {
  return (
  <BrowserRouter>
    <nav>
      <Link to="/series">Series</Link>
      <Link to="/authors">Authors</Link>
      <Link to="/chapters">Chapters</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/series" element={<SeriesPage />} />
      <Route path="/authors" element={<AuthorsPage />} />
      <Route path="/chapters" element={<ChaptersPage />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
