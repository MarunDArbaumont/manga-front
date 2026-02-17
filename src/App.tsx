import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import SeriesPage from './pages/SeriesPage'
import AuthorsPage from './pages/AuthorsPage'
import ChaptersPage from './pages/ChaptersPage'
import SingleSeriePage from './pages/SingleSeriePage'
import SingleChapterPage from './pages/SingleChapter'
import SingleAuthorPage from './pages/SingleAuthor'

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
      <Route path="/series/:id" element={<SingleSeriePage />} />
      <Route path="/authors" element={<AuthorsPage />} />
      <Route path="/authors/:id" element={<SingleAuthorPage />} />
      <Route path="/chapters" element={<ChaptersPage />} />
      <Route path="/chapters/:id" element={<SingleChapterPage />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
