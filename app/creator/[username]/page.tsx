'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function CreatorProfilePage() {
  const router = useRouter()
  const params = useParams()
  const username = params.username as string
  const [creator, setCreator] = useState<any>(null)
  const [tiers, setTiers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      const { data: creatorData } = await supabase.from('profiles').select('*').eq('username', username).single()
      if (!creatorData) { router.push('/browse'); return }
      setCreator(creatorData)
      const { data: tiersData } = await supabase.from('subscription_tiers').select('*').eq('creator_id', creatorData.id).order('price')
      setTiers(tiersData || [])
      const { data: postsData } = await supabase.from('content').select('*').eq('creator_id', creatorData.id).order('created_at', { ascending: false })
      setPosts(postsData || [])
      setLoading(false)
    }
    load()
  }, [username])

  async function subscribe(tierId: string) {
    if (!currentUser) { router.push('/auth'); return }
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier_id: tierId, creator_id: creator.id, fan_id: currentUser.id })
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  if (loading) return <div style={{background:'#0a0a0a',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#555'}}>Loading...</div>
  if (!creator) return null

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh'}}>
      <div style={{height:'220px',background:'#001828',position:'relative'}}></div>
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'0 24px 48px'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginTop:'-48px',marginBottom:'16px',flexWrap:'wrap',gap:'12px'}}>
          <div style={{width:'96px',height:'96px',borderRadius:'50%',border:'4px solid #0a0a0a',background:'#00aff0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:'700',color:'#000'}}>
            {creator.avatar_url
              ? <img src={creator.avatar_url} style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}} />
              : creator.display_name?.[0]?.toUpperCase() || creator.username?.[0]?.toUpperCase()}
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={() => router.push('/messages')}
              style={{background:'transparent',color:'#fff',border:'0.5px solid #333',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',cursor:'pointer'}}>
              Message
            </button>
          </div>
        </div>

        <div style={{marginBottom:'24px'}}>
          <div style={{fontSize:'22px',fontWeight:'800',marginBottom:'4px'}}>{creator.display_name || creator.username}</div>
          <div style={{fontSize:'14px',color:'#555',marginBottom:'12px'}}>@{creator.username}</div>
          {creator.bio && <div style={{fontSize:'14px',color:'#888',lineHeight:'1.7',maxWidth:'480px'}}>{creator.bio}</div>}
        </div>

        {tiers.length > 0 && (
          <div style={{marginBottom:'32px'}}>
            <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'16px'}}>Subscribe</div>
            <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
              {tiers.map((tier, i) => (
                <div key={tier.id} style={{border:`0.5px solid ${i===1?'#00aff0':'#1e1e1e'}`,borderRadius:'12px',padding:'20px',minWidth:'160px',flex:1,maxWidth:'220px',background:'#111'}}>
                  {i === 1 && <div style={{fontSize:'10px',fontWeight:'700',color:'#00aff0',letterSpacing:'0.5px',marginBottom:'6px'}}>MOST POPULAR</div>}
                  <div style={{fontSize:'12px',color:'#555',fontWeight:'600',marginBottom:'8px'}}>{tier.name}</div>
                  <div style={{fontSize:'26px',fontWeight:'800',marginBottom:'4px'}}>${(tier.price/100).toFixed(2)}</div>
                  <div style={{fontSize:'12px',color:'#555',marginBottom:'12px'}}>per month</div>
                  {tier.perks?.map((perk: string) => (
                    <div key={perk} style={{fontSize:'12px',color:'#888',padding:'3px 0',display:'flex',alignItems:'center',gap:'6px'}}>
                      <div style={{width:'4px',height:'4px',borderRadius:'50%',background:'#00aff0',flexShrink:0}}></div>
                      {perk}
                    </div>
                  ))}
                  <button onClick={() => subscribe(tier.id)}
                    style={{width:'100%',background:i===1?'#00aff0':'transparent',color:i===1?'#000':'#888',border:`0.5px solid ${i===1?'#00aff0':'#333'}`,borderRadius:'8px',padding:'10px',fontSize:'13px',fontWeight:'700',cursor:'pointer',marginTop:'16px'}}>
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'16px'}}>Posts ({posts.length})</div>
        {posts.length === 0 ? (
          <div style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'12px',padding:'40px',textAlign:'center',color:'#555',fontSize:'14px'}}>
            No posts yet
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'4px'}}>
            {posts.map(post => (
              <div key={post.id} style={{aspectRatio:'1',background:'#111',borderRadius:'4px',position:'relative',overflow:'hidden',cursor:'pointer'}}>
                {post.media_urls && post.media_urls[0] ? (
                  <img src={post.media_urls[0]} alt={post.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                ) : (
                  <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px'}}>
                    <div style={{fontSize:'12px',color:'#333'}}>{post.content_type}</div>
                    {post.title && <div style={{fontSize:'11px',color:'#222',textAlign:'center',padding:'0 8px'}}>{post.title}</div>}
                  </div>
                )}
                {post.is_ppv && (
                  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'4px'}}>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'#00aff0'}}>${(post.ppv_price/100).toFixed(2)}</div>
                    <div style={{fontSize:'10px',color:'#555'}}>PPV</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}