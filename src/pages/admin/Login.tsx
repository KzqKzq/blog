import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button, Card, Input } from '@kzqkzq/tactile-ui'
import './Admin.css'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            navigate('/admin')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-shell">
            <Card className="admin-card login-card">
                <h1 className="admin-hero__title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    管理员登录
                </h1>
                <p className="admin-hero__desc" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    与博客保持同样柔和的质感，同时保护后台入口。
                </p>

                {error && (
                    <div
                        style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label htmlFor="email">邮箱</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">密码</label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? '登录中...' : '登录'}
                    </Button>
                </form>
            </Card>
        </div>
    )
}
