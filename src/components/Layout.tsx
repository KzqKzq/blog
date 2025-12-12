import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Switch } from '@kzqkzq/tactile-ui'
import { FloatingNav } from './FloatingNav'
import { BackToTop } from './BackToTop'
import './Layout.css'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '博客' },
  { path: '/projects', label: '作品集' },
  { path: '/essays', label: '随笔' },
  { path: '/about', label: '关于' },
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showNoise, setShowNoise] = useState(true)
  const [glassHeader, setGlassHeader] = useState(true)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('without-noise', !showNoise)
  }, [showNoise])

  // Close the mobile nav when the route changes
  useEffect(() => setNavOpen(false), [location.pathname])

  // Reset the nav state on resize to avoid stale open state
  useEffect(() => {
    const handleResize = () => setNavOpen(false)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="page-shell">
      <div className="blur-blob blur-blob--brand" />

      <header className={`site-header ${glassHeader ? 'site-header--glass' : ''}`}>
        <div className="container site-header__row">
          {/* Brand + Toggle (Mobile) */}
          <div className="brand-row">
            <NavLink to="/" className="brand">
              <div className="brand-mark">KZQ</div>
              <div className="brand-text">
                <span className="brand-title">数字工坊</span>
                <span className="brand-sub">新拟物 · 类型安全</span>
              </div>
            </NavLink>
            <button
              type="button"
              className="nav-toggle"
              aria-label="展开导航菜单"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((open) => !open)}
            >
              <span className="nav-toggle__icon" aria-hidden="true" />
              <span className="nav-toggle__label">菜单</span>
            </button>
          </div>

          {/* Desktop Navigation - Always Visible */}
          <nav className="site-nav site-nav--desktop">
            <div className="site-nav__links">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-desktop"
                          className="nav-active"
                          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                        />
                      )}
                      <motion.span
                        className="nav-label"
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.15 }}
                      >
                        {item.label}
                      </motion.span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>

          </nav>

          {/* Mobile Navigation - Collapsible */}
          <AnimatePresence initial={false}>
            {navOpen && (
              <motion.nav
                className="site-nav site-nav--mobile"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="site-nav__links">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="nav-active-mobile"
                              className="nav-active"
                              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                            />
                          )}
                          <span className="nav-label">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>


              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="site-main">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <FloatingNav />
      <BackToTop />
    </div>
  )
}
