'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{background:'#111',borderBottom:'0.5px solid #1e1e1e',padding:'0 32px',height:'56px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:999}}>
      <div onClick={() => router.push('/')} style={{fontSize:'20px',fontWeight:'700',color:'#00aff0',cursor:'pointer'}}>FanVault</div>
      <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
        <span onClick={() => router.push('/browse')} style={{fontSize:'14px',color:'#666',cursor:'pointer'}}>Browse</span>
        {user ? (
          <>
            <span onClick={() => router.push('/dashboard')} style={{fontSize:'14px',color:'#666',cursor:'pointer'}}>Dashboard</span>
            <span onClick={() => router.push('/messages')} style={{fontSize:'14px',color:'#666',cursor:'pointer'}}>Messages</span>
            <button onClick={signOut} style={{background:'transparent',border:'0.5px solid #333',color:'#666',borderRadius:'8px',padding:'7px 16px',fontSize:'13px',cursor:'pointer'}}>Sign out</button>
          </>
        ) : (
          <>
            <button onClick={() => router.push('/auth')} style={{background:'transparent',border:'0.5px solid #333',color:'#666',borderRadius:'8px',padding:'7px 16px',fontSize:'13px',cursor:'pointer'}}>Log in</button>
            <button onClick={() => router.push('/auth')} style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'8px 18px',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>Start creating</button>
          </>
        )}
      </div>
    </nav>
  )
}
