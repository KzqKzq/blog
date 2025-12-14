import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Projects from './pages/Projects'
import Essays from './pages/Essays'
import About from './pages/About'
import ArticlePage from './pages/ArticlePage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/admin/Dashboard'
import ArticleEditor from './pages/admin/ArticleEditor'
import AdminLogin from './pages/admin/Login'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<ArticlePage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="essays" element={<Essays />} />
          <Route path="essays/:slug" element={<ArticlePage />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles/new" element={<ArticleEditor />} />
          <Route path="articles/:id" element={<ArticleEditor />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
