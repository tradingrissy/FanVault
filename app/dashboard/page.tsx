'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ subscribers: 0, earnings: 0, posts: 0, messages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
      const { count: subCount } = await supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('creator_id', user.id).eq('status', 'active')
      const { count: postCount } = await supabase.from('content').select('*', { count: 'exact', head: true }).eq('creator_id', user.id)
      const { data: transactions } = await supabase.from('transactions').select('creator_payout').eq('creator_id', user.id)
      const totalEarnings = transactions?.reduce((sum, t) => sum + (t.creator_payout || 0), 0) || 0
      setStats({ subscribers: subCount || 0, earnings: totalEarnings, posts: postCount || 0, messages: 0 })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{background:'#0a0a0a',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#555'}}>Loading...</div>

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',padding:'40px 32px'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{marginBottom:'32px'}}>
          <h1 style={{fontSize:'28px',fontWeight:'800',marginBottom:'4px'}}>Creator dashboard</h1>
          <p style={{fontSize:'14px',color:'#555',margin:0}}>Welcome back, {profile?.display_name || profile?.username}</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'12px',marginBottom:'32px'}}>
          {[
            {label:'Active subscribers',value:stats.subscribers,color:'#00aff0'},
            {label:'Total earnings',value:`$${(stats.earnings/100).toFixed(2)}`,color:'#22c55e'},
            {label:'Total posts',value:stats.posts,color:'#a855f7'},
            {label:'Pending payout',value:`$${(stats.earnings*0.8/100).toFixed(2)}`,color:'#eab308'},
          ].map(s => (
            <div key={s.label} style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'12px',padding:'20px'}}>
              <div style={{fontSize:'12px',color:'#555',marginBottom:'8px',fontWeight:'500'}}>{s.label}</div>
              <div style={{fontSize:'28px',fontWeight:'800',color:s.color}}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
          <div style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'12px',padding:'24px'}}>
            <div style={{fontSize:'15px',fontWeight:'700',marginBottom:'16px'}}>Quick actions</div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <button onClick={() => router.push('/upload')}
                style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'12px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
                Upload new content
              </button>
              <button onClick={() => router.push('/messages')}
                style={{background:'transparent',color:'#fff',border:'0.5px solid #333',borderRadius:'8px',padding:'12px',fontSize:'14px',cursor:'pointer'}}>
                View messages
              </button>
              <button onClick={() => router.push(`/creator/${profile?.username}`)}
                style={{background:'transparent',color:'#fff',border:'0.5px solid #333',borderRadius:'8px',padding:'12px',fontSize:'14px',cursor:'pointer'}}>
                View my profile
              </button>
            </div>
          </div>
          <div style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'12px',padding:'24px'}}>
            <div style={{fontSize:'15px',fontWeight:'700',marginBottom:'16px'}}>Profile setup</div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[
                {label:'Profile photo',done:!!profile?.avatar_url},
                {label:'Bio written',done:!!profile?.bio},
                {label:'Subscription tier set',done:false},
                {label:'First post uploaded',done:stats.posts > 0},
                {label:'Payout account connected',done:!!profile?.stripe_account_id},
              ].map(item => (
                <div key={item.label} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div style={{width:'18px',height:'18px',borderRadius:'50%',background:item.done?'#00aff0':'#1e1e1e',border:`0.5px solid ${item.done?'#00aff0':'#333'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {item.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{fontSize:'13px',color:item.done?'#fff':'#555'}}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'12px',padding:'24px'}}>
          <div style={{fontSize:'15px',fontWeight:'700',marginBottom:'16px'}}>Your profile settings</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <div>
              <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Display name</label>
              <input defaultValue={profile?.display_name || ''} placeholder="Your name"
                style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div>
              <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Username</label>
              <input defaultValue={profile?.username || ''} placeholder="@username"
                style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div style={{gridColumn:'1/-1'}}>
              <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Bio</label>
              <textarea defaultValue={profile?.bio || ''} placeholder="Tell fans about yourself..." rows={3}
                style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
            </div>
          </div>
          <button style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'10px 24px',fontSize:'14px',fontWeight:'700',cursor:'pointer',marginTop:'16px'}}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}