import { lazy, Suspense } from 'react'
import { Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import { ErrorBoundary } from './components/ErrorBoundary'

import { Toaster } from '@/components/ui/sonner'
import { PageLoadingSkeleton } from '@/components/ui/loading-spinner'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Blog = lazy(() => import('./pages/Blog'))
const Projects = lazy(() => import('./pages/Projects'))
const Essays = lazy(() => import('./pages/Essays'))
const About = lazy(() => import('./pages/About'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const ArticleEditor = lazy(() => import('./pages/admin/ArticleEditor'))
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const PostsList = lazy(() => import('./pages/admin/PostsList'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const HomepageConfig = lazy(() => import('./pages/admin/HomepageConfig'))

// Loading fallback component
const PageLoader = () => (
  <div className="container py-10">
    <PageLoadingSkeleton count={3} />
  </div>
)

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
        <Route path="blog" element={<Suspense fallback={<PageLoader />}><Blog /></Suspense>} />
        <Route path="blog/:slug" element={<Suspense fallback={<PageLoader />}><ArticlePage /></Suspense>} />
        <Route path="projects" element={<Suspense fallback={<PageLoader />}><Projects /></Suspense>} />
        <Route path="essays" element={<Suspense fallback={<PageLoader />}><Essays /></Suspense>} />
        <Route path="essays/:slug" element={<Suspense fallback={<PageLoader />}><ArticlePage /></Suspense>} />
        <Route path="about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />

      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
        <Route path="posts" element={<Suspense fallback={<PageLoader />}><PostsList /></Suspense>} />
        <Route path="posts/new" element={<Suspense fallback={<PageLoader />}><ArticleEditor /></Suspense>} />
        <Route path="posts/edit/:id" element={<Suspense fallback={<PageLoader />}><ArticleEditor /></Suspense>} />
        <Route path="homepage" element={<Suspense fallback={<PageLoader />}><HomepageConfig /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
      </Route>
    </>
  )
)

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster />
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
