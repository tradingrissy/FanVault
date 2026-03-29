'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPPV, setIsPPV] = useState(false)
  const [ppvPrice, setPpvPrice] = useState('')
  const [file, setFile] = useState<File|null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth'); return }
      setUser(user)
    })
  }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    let mediaUrls: string[] = []
    if (file) {
      const { data, error } = await supabase.storage.from('content').upload(`${user.id}/${Date.now()}-${file.name}`, file)
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('content').getPublicUrl(data.path)
        mediaUrls = [urlData.publicUrl]
      }
    }
    await supabase.from('content').insert({
      creator_id: user.id,
      title,
      body,
      media_urls: mediaUrls,
      content_type: file?.type.startsWith('video') ? 'video' : 'image',
      is_ppv: isPPV,
      ppv_price: isPPV ? Math.round(parseFloat(ppvPrice) * 100) : 0,
    })
    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',padding:'40px 32px'}}>
      <div style={{maxWidth:'600px',margin:'0 auto'}}>
        <h1 style={{fontSize:'28px',fontWeight:'800',marginBottom:'8px'}}>Upload content</h1>
        <p style={{fontSize:'14px',color:'#555',marginBottom:'32px'}}>Share photos, videos or written posts with your subscribers</p>
        {success ? (
          <div style={{background:'#0f2d1a',border:'0.5px solid #22c55e',borderRadius:'12px',padding:'24px',textAlign:'center'}}>
            <div style={{fontSize:'16px',fontWeight:'700',color:'#22c55e',marginBottom:'4px'}}>Post uploaded successfully!</div>
            <div style={{fontSize:'13px',color:'#555'}}>Redirecting to dashboard...</div>
          </div>
        ) : (
          <form onSubmit={handleUpload} style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            <div style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'12px',padding:'24px',display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" required
                  style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Caption</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write something..." rows={4}
                  style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>File (photo or video)</label>
                <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files?.[0] || null)}
                  style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',boxSizing:'border-box'}}/>
              </div>
            </div>
            <div style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'12px',padding:'24px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom: isPPV ? '16px' : '0'}}>
                <div>
                  <div style={{fontSize:'14px',fontWeight:'600',marginBottom:'2px'}}>Pay-per-view</div>
                  <div style={{fontSize:'12px',color:'#555'}}>Charge fans a one-time fee to unlock this post</div>
                </div>
                <div onClick={() => setIsPPV(!isPPV)}
                  style={{width:'40px',height:'22px',background:isPPV?'#00aff0':'#1a1a1a',borderRadius:'11px',border:'0.5px solid #333',position:'relative',cursor:'pointer',flexShrink:0}}>
                  <div style={{width:'16px',height:'16px',borderRadius:'50%',background:'#fff',position:'absolute',top:'2px',left:isPPV?'20px':'2px',transition:'left 0.15s'}}></div>
                </div>
              </div>
              {isPPV && (
                <div>
                  <label style={{fontSize:'12px',color:'#555',display:'block',marginBottom:'6px'}}>Price (USD)</label>
                  <input type="number" value={ppvPrice} onChange={e => setPpvPrice(e.target.value)} placeholder="9.99" min="1" step="0.01" required={isPPV}
                    style={{width:'100%',background:'#0d0d0d',border:'0.5px solid #222',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',color:'#fff',outline:'none',boxSizing:'border-box'}}/>
                </div>
              )}
            </div>
            <button type="submit" disabled={loading}
              style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'8px',padding:'14px',fontSize:'15px',fontWeight:'700',cursor:'pointer'}}>
              {loading ? 'Uploading...' : 'Upload post'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}