import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  User,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/admin/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/admin/posts', label: '文章管理', icon: FileText },
  { path: '/admin/comments', label: '评论管理', icon: MessageSquare },
  { path: '/admin/homepage', label: '首页配置', icon: Home },
  { path: '/admin/settings', label: '设置', icon: SettingsIcon },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-6">
          <NavLink to="/admin" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">Admin</span>
          </NavLink>
        </div>
        <div className="flex flex-col flex-1 gap-4 p-4 justify-between">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                    isActive
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="border-t pt-4">
             <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">{user?.email}</span>
                    <span className="text-xs text-muted-foreground">管理员</span>
                </div>
             </div>
             <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 mt-2 text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
             >
                <LogOut className="h-4 w-4" />
                退出登录
             </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col sm:ml-64 transition-all">
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Outlet />
        </div>
      </main>
    </div>
  )
}
