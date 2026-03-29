'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh'}}>
      <div style={{padding:'100px 32px 80px',textAlign:'center'}}>
        <div style={{fontSize:'13px',color:'#00aff0',fontWeight:'600',letterSpacing:'2px',marginBottom:'16px'}}>THE CREATOR PLATFORM THAT PAYS MORE</div>
        <h1 style={{fontSize:'56px',fontWeight:'800',lineHeight:'1.1',letterSpacing:'-2px',margin:'0 0 20px'}}>
          Support creators.<br/><span style={{color:'#00aff0'}}>Get exclusive content.</span>
        </h1>
        <p style={{fontSize:'18px',color:'#666',maxWidth:'540px',margin:'0 auto 36px',lineHeight:'1.7'}}>
          Subscribe to your favorite creators. Get exclusive photos, videos, DMs and live streams. Creators keep 80% of everything.
        </p>
        <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={() => router.push('/auth')}
            style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'12px',padding:'16px 36px',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
            Start creating for free
          </button>
          <button onClick={() => router.push('/browse')}
            style={{background:'transparent',color:'#fff',border:'0.5px solid #333',borderRadius:'12px',padding:'16px 36px',fontSize:'16px',cursor:'pointer'}}>
            Browse creators
          </button>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:'64px',marginTop:'64px',paddingTop:'48px',borderTop:'0.5px solid #1e1e1e',flexWrap:'wrap'}}>
          {[['2M+','Creators'],['50M+','Subscribers'],['$500M+','Paid out'],['80%','Creator cut']].map(([num,label]) => (
            <div key={label} style={{textAlign:'center'}}>
              <div style={{fontSize:'36px',fontWeight:'800',color:'#00aff0'}}>{num}</div>
              <div style={{fontSize:'13px',color:'#555',marginTop:'4px'}}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',borderTop:'0.5px solid #1e1e1e',borderBottom:'0.5px solid #1e1e1e'}}>
        {[
          ['Subscription tiers','Set up to 5 tiers with custom prices and perks. Fans pick the tier that works for them.'],
          ['Pay-per-view','Lock individual posts behind a one-time fee. Any price from $1.'],
          ['Live streaming','Go live directly on your page. Fans tip during the stream in real time.'],
          ['Instant payouts','Withdraw earnings any time. Weekly automatic payouts included.'],
        ].map(([title, desc]) => (
          <div key={title} style={{padding:'36px 28px',borderRight:'0.5px solid #1e1e1e'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'#001a24',border:'0.5px solid rgba(0,175,240,0.2)',marginBottom:'16px'}}></div>
            <h3 style={{fontSize:'16px',fontWeight:'700',marginBottom:'8px'}}>{title}</h3>
            <p style={{fontSize:'14px',color:'#555',lineHeight:'1.7',margin:0}}>{desc}</p>
          </div>
        ))}
      </div>

      <div style={{padding:'64px 32px',maxWidth:'1200px',margin:'0 auto'}}>
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>Featured creators</div>
        <div style={{fontSize:'14px',color:'#555',marginBottom:'32px'}}>Discover top creators across every category</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
          {[
            {name:'Maya R.',handle:'@mayafitness',fans:'42.1K',price:'$9.99',color:'#00aff0',initials:'MR',bg:'#001828'},
            {name:'Jake S.',handle:'@jakeart',fans:'18.4K',price:'$4.99',color:'#f97316',initials:'JS',bg:'#1a0a00'},
            {name:'Ava L.',handle:'@avalooks',fans:'7.2K',price:'$14.99',color:'#a855f7',initials:'AL',bg:'#1a001a'},
            {name:'Dev K.',handle:'@devteaches',fans:'31K',price:'$7.99',color:'#22c55e',initials:'DK',bg:'#0a1a00'},
            {name:'Tara C.',handle:'@taracooks',fans:'91K',price:'$5.99',color:'#ef4444',initials:'TC',bg:'#1a0000'},
            {name:'Nina P.',handle:'@ninaplay',fans:'5.3K',price:'$6.99',color:'#eab308',initials:'NP',bg:'#1a1a00'},
          ].map((c) => (
            <div key={c.handle} onClick={() => router.push('/browse')}
              style={{background:'#111',border:'0.5px solid #1e1e1e',borderRadius:'14px',overflow:'hidden',cursor:'pointer'}}>
              <div style={{height:'88px',background:c.bg}}></div>
              <div style={{padding:'12px 14px 16px'}}>
                <div style={{width:'52px',height:'52px',borderRadius:'50%',border:'3px solid #0a0a0a',marginTop:'-30px',marginBottom:'10px',background:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',fontSize:'16px',color:'#000'}}>{c.initials}</div>
                <div style={{fontSize:'15px',fontWeight:'700',marginBottom:'2px'}}>{c.name}</div>
                <div style={{fontSize:'12px',color:'#555',marginBottom:'10px'}}>{c.handle} · {c.fans} fans</div>
                <div style={{fontSize:'12px',color:'#00aff0',fontWeight:'700'}}>From {c.price}/mo
                  <button style={{float:'right',background:'#00aff0',color:'#000',border:'none',borderRadius:'6px',padding:'5px 12px',fontSize:'11px',fontWeight:'700',cursor:'pointer'}}>Subscribe</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#111',borderTop:'0.5px solid #1e1e1e',borderBottom:'0.5px solid #1e1e1e',padding:'64px 32px',textAlign:'center'}}>
        <h2 style={{fontSize:'36px',fontWeight:'800',marginBottom:'16px',letterSpacing:'-1px'}}>Ready to start earning?</h2>
        <p style={{fontSize:'16px',color:'#555',marginBottom:'32px'}}>Join thousands of creators making a living doing what they love.</p>
        <button onClick={() => router.push('/auth')}
          style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'12px',padding:'16px 36px',fontSize:'16px',fontWeight:'700',cursor:'pointer'}}>
          Create your free account
        </button>
      </div>

      <div style={{background:'#0a0a0a',borderTop:'0.5px solid #1e1e1e',padding:'40px 32px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'20px'}}>
          <div style={{fontSize:'20px',fontWeight:'700',color:'#00aff0'}}>FanVault</div>
          <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
            {['About','Terms','Privacy','DMCA','Support'].map(link => (
              <span key={link} style={{fontSize:'13px',color:'#444',cursor:'pointer'}}>{link}</span>
            ))}
          </div>
        </div>
        <div style={{maxWidth:'1200px',margin:'16px auto 0',paddingTop:'16px',borderTop:'0.5px solid #1e1e1e',fontSize:'12px',color:'#333'}}>
          © 2026 FanVault Inc. All rights reserved. Must be 18+ to create or subscribe.
        </div>
      </div>
    </div>
  )
}