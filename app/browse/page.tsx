'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function BrowsePage() {
  const router = useRouter()
  const [creators, setCreators] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCreators() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_creator', true)
        .order('created_at', { ascending: false })
      setCreators(data || [])
      setLoading(false)
    }
    loadCreators()
  }, [])

  const filtered = creators.filter(c =>
    c.username?.toLowerCase().includes(search.toLowerCase()) ||
    c.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.bio?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',padding:'40px 32px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{marginBottom:'32px'}}>
          <h1 style={{fontSize:'32px',fontWeight:'800',marginBottom:'8px'}}>Browse creators</h1>
          <p style={{fontSize:'15px',color:'#555',margin:0}}>Discover creators across every category</p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search creators..."
          style={{width:'100%',maxWidth:'400px',background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'10px',padding:'12px 16px',fontSize:'14px',color:'#fff',outline:'none',marginBottom:'32px',boxSizing:'border-box'}}
        />
        {loading ? (
          <div style={{color:'#555',fontSize:'14px'}}>Loading creators...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>🎭</div>
            <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>No creators yet</div>
            <div style={{fontSize:'14px',color:'#555',marginBottom:'24px'}}>Be the first creator on FanVault</div>
            <button onClick={() => router.push('/auth')}
              style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'12px 24px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
              Start creating
            </button>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
            {filtered.map((creator) => (
              <div key={creator.id}
                onClick={() => router.push(`/creator/${creator.username}`)}
                style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'14px',overflow:'hidden',cursor:'pointer'}}>
                <div style={{height:'88px',background:'#001828'}}></div>
                <div style={{padding:'12px 14px 16px'}}>
                  <div style={{width:'52px',height:'52px',borderRadius:'50%',border:'3px solid #0a0a0a',marginTop:'-30px',marginBottom:'10px',background:'#00aff0',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',fontSize:'16px',color:'#000'}}>
                    {creator.display_name?.[0]?.toUpperCase() || creator.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{fontSize:'15px',fontWeight:'700',marginBottom:'2px'}}>{creator.display_name || creator.username}</div>
                  <div style={{fontSize:'12px',color:'#555',marginBottom:'10px'}}>@{creator.username}</div>
                  {creator.bio && <div style={{fontSize:'12px',color:'#444',marginBottom:'10px',lineHeight:'1.5'}}>{creator.bio.slice(0,80)}{creator.bio.length > 80 ? '...' : ''}</div>}
                  <button
                    onClick={e => { e.stopPropagation(); router.push(`/creator/${creator.username}`) }}
                    style={{width:'100%',background:'#00aff0',color:'#000',border:'none',borderRadius:'6px',padding:'8px',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>
                    View profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}