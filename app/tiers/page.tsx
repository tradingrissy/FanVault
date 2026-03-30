'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function TiersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tiers, setTiers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data } = await supabase.from('subscription_tiers').select('*').eq('creator_id', user.id).order('price')
      setTiers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function addTier(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('subscription_tiers').insert({
      creator_id: user.id,
      name,
      price: Math.round(parseFloat(price) * 100),
      interval: 'month',
      description,
    })
    if (!error) {
      const { data } = await supabase.from('subscription_tiers').select('*').eq('creator_id', user.id).order('price')
      setTiers(data || [])
      setName('')
      setPrice('')
      setDescription('')
      setShowForm(false)
      setSuccess('Tier added successfully!')
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  async function deleteTier(id: string) {
    await supabase.from('subscription_tiers').delete().eq('id', id)
    setTiers(tiers.filter(t => t.id !== id))
  }

  if (loading) return <div style={{background:'#0a0a0a',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#555'}}>Loading...</div>

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',padding:'40px 32px'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'32px',flexWrap:'wrap',gap:'12px'}}>
          <div>
            <h1 style={{fontSize:'28px',fontWeight:'800',marginBottom:'4px'}}>Subscription tiers</h1>
            <p style={{fontSize:'14px',color:'#555',margin:0}}>Set your subscription prices and what fans get</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
            {showForm ? 'Cancel' : '+ Add tier'}
          </button>
        </div>

        {success && (
          <div style={{background:'#0f2d1a',border:'0.5px solid #22c55e',borderRadius:'8px',padding:'12px 16px',marginBottom:'20px',fontSize:'13px',color:'#22c55e'}}>
            {success}
          </div>
        )}

        {showForm && (
          <form onSubmit={addTier} style={{background:'#111',border:'0.5px solid #00aff040',borderRadius:'12px',padding:'24px',marginBottom:'24px'}}>
            <div style={{fontSize:'15px',fontWeight:'700',marginBottom:'20px'}}>New tier</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
              <div>
                <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Tier name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Basic, VIP, Premium" required
                  style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Monthly price (USD)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="9.99" min="4.99" step="0.01" required
                  style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
              </div>
            </div>
            <div style={{marginBottom:'16px'}}>
              <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Description — what do fans get?</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Access to all my photos, videos, and DMs" rows={3} required
                style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
            </div>
            <button type="submit" disabled={saving}
              style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'10px 24px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
              {saving ? 'Saving...' : 'Save tier'}
            </button>
          </form>
        )}

        {tiers.length === 0 ? (
          <div style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'12px',padding:'48px',textAlign:'center'}}>
            <div style={{fontSize:'16px',fontWeight:'700',marginBottom:'8px'}}>No tiers yet</div>
            <div style={{fontSize:'14px',color:'#555',marginBottom:'24px'}}>Add your first subscription tier to start earning</div>
            <button onClick={() => setShowForm(true)}
              style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'10px 24px',fontSize:'14px',fontWeight:'700',cursor:'pointer'}}>
              Add your first tier
            </button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {tiers.map((tier, i) => (
              <div key={tier.id} style={{background:'#111',border:`0.5px solid ${i===0?'#00aff040':'#1e1e1e'}`,borderRadius:'12px',padding:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                    <div style={{fontSize:'16px',fontWeight:'700'}}>{tier.name}</div>
                    {i === 0 && <div style={{background:'#001a24',color:'#00aff0',fontSize:'10px',fontWeight:'700',padding:'2px 8px',borderRadius:'4px'}}>ACTIVE</div>}
                  </div>
                  <div style={{fontSize:'22px',fontWeight:'800',color:'#00aff0',marginBottom:'4px'}}>${(tier.price/100).toFixed(2)}<span style={{fontSize:'13px',color:'#555',fontWeight:'400'}}>/month</span></div>
                  <div style={{fontSize:'13px',color:'#666'}}>{tier.description}</div>
                </div>
                <button onClick={() => deleteTier(tier.id)}
                  style={{background:'transparent',color:'#ef4444',border:'0.5px solid #ef444440',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',cursor:'pointer'}}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{marginTop:'24px',display:'flex',gap:'10px'}}>
          <button onClick={() => router.push('/dashboard')}
            style={{background:'transparent',color:'#555',border:'0.5px solid #333',borderRadius:'8px',padding:'10px 20px',fontSize:'14px',cursor:'pointer'}}>
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}