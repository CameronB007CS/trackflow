import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f3' }}>
      <div style={{ width: 360, background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
          <div style={{ width: 32, height: 32, background: '#185FA5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13 }}>TK</div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>TrackFlow</span>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: '1.5rem' }}>
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>

        {mode === 'register' && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Your name" />
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#6b6b67', display: 'block', marginBottom: 4 }}>Password</label>
          <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        {error && <div style={{ color: '#E24B4A', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }} onClick={submit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <p style={{ fontSize: 13, color: '#6b6b67', textAlign: 'center' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button style={{ background: 'none', border: 'none', color: '#185FA5', cursor: 'pointer', padding: 0 }}
            onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
