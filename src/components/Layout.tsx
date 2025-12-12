import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Switch, Tag } from '@kzqkzq/tactile-ui'
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

  useEffect(() => {
    document.body.classList.toggle('without-noise', !showNoise)
  }, [showNoise])

  return (
    <div className="page-shell">
      <div className="blur-blob blur-blob--brand" />

      <header className={`site-header ${glassHeader ? 'site-header--glass' : ''}`}>
        <div className="container site-header__row">
          <NavLink to="/" className="brand">
            <div className="brand-mark">KZQ</div>
            <div className="brand-text">
              <span className="brand-title">数字工坊</span>
              <span className="brand-sub">新拟物 · 类型安全</span>
            </div>
          </NavLink>

          <nav className="site-nav">
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
                        layoutId="nav-active"
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
          </nav>

            <div className="header-actions">
              <div className="header-toggle">
                <span className="toggle-label">噪点</span>
                <Switch checked={showNoise} onCheckedChange={setShowNoise} size="sm" />
              </div>
              <div className="header-toggle">
                <span className="toggle-label">玻璃</span>
                <Switch checked={glassHeader} onCheckedChange={setGlassHeader} size="sm" />
            </div>
            <Button type="button" size="sm" variant="primary" onClick={() => navigate('/about')}>
              联系我
            </Button>
          </div>
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
    </div>
  )
}
