'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [accountType, setAccountType] = useState<'fan'|'creator'>('fan')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { username, is_creator: accountType === 'creator' } }
      })
      if (error) { setError(error.message); setLoading(false); return }
      if (data.user) {
        await supabase.from('profiles').update({
          username, is_creator: accountType === 'creator'
        }).eq('id', data.user.id)
      }
      setMessage('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px'}}>
      <div style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'16px',padding:'40px',width:'100%',maxWidth:'420px'}}>
        <div style={{fontSize:'20px',fontWeight:'700',color:'#00aff0',marginBottom:'4px'}}>FanVault</div>
        <div style={{fontSize:'22px',fontWeight:'700',marginBottom:'6px'}}>{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
        <div style={{fontSize:'13px',color:'#555',marginBottom:'24px'}}>{mode === 'login' ? 'Sign in to your account' : 'Join FanVault today'}</div>
        {mode === 'signup' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'3px',marginBottom:'20px'}}>
            {(['fan','creator'] as const).map(type => (
              <button key={type} onClick={() => setAccountType(type)}
                style={{background:accountType===type?'#00aff0':'transparent',color:accountType===type?'#000':'#555',border:'none',borderRadius:'6px',padding:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>
                {type === 'fan' ? 'Fan' : 'Creator'}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{marginBottom:'14px'}}>
              <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="@yourhandle" required
                style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'11px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
            </div>
          )}
          <div style={{marginBottom:'14px'}}>
            <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required
              style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'11px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required
              style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'11px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          {error && <div style={{color:'#ef4444',fontSize:'13px',marginBottom:'12px'}}>{error}</div>}
          {message && <div style={{color:'#00aff0',fontSize:'13px',marginBottom:'12px'}}>{message}</div>}
          <button type="submit" disabled={loading}
            style={{width:'100%',background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'13px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>
            {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <div style={{textAlign:'center',fontSize:'13px',color:'#555',marginTop:'20px'}}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{color:'#00aff0',cursor:'pointer'}}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </div>
        <div style={{fontSize:'11px',color:'#333',textAlign:'center',marginTop:'16px'}}>
          By signing up you agree to our Terms and Privacy Policy. Must be 18+.
        </div>
      </div>
    </div>
  )
}