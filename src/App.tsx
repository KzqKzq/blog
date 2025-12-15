import { Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
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
import AdminLayout from './components/AdminLayout'
import PostsList from './pages/admin/PostsList'
import CommentsList from './pages/admin/CommentsList'
import Settings from './pages/admin/Settings'
import HomepageConfig from './pages/admin/HomepageConfig'

import { Toaster } from '@/components/ui/sonner'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
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
      <Route path="/admin/login" element={<AdminLogin />} />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="posts" element={<PostsList />} />
        <Route path="posts/new" element={<ArticleEditor />} />
        <Route path="posts/edit/:id" element={<ArticleEditor />} />
        <Route path="comments" element={<CommentsList />} />
        <Route path="homepage" element={<HomepageConfig />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </>
  )
)

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
