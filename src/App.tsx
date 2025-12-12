import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Projects from './pages/Projects'
import Essays from './pages/Essays'
import About from './pages/About'
import ArticlePage from './pages/ArticlePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<ArticlePage />} />
        <Route path="projects" element={<Projects />} />
        <Route path="essays" element={<Essays />} />
        <Route path="essays/:slug" element={<ArticlePage />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
