'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
      const seen = new Set()
      const convos: any[] = []
      data?.forEach(msg => {
        const other = msg.sender_id === user.id ? msg.receiver : msg.sender
        if (!seen.has(other?.id)) { seen.add(other?.id); convos.push({ other, lastMsg: msg }) }
      })
      setConversations(convos)
      setLoading(false)
    }
    load()
  }, [])

  async function loadMessages(otherUser: any) {
    setSelected(otherUser)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selected) return
    await supabase.from('messages').insert({ sender_id: user.id, receiver_id: selected.id, body: newMessage })
    setMessages(prev => [...prev, { sender_id: user.id, body: newMessage, created_at: new Date().toISOString() }])
    setNewMessage('')
  }

  if (loading) return <div style={{background:'#0a0a0a',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#555'}}>Loading...</div>

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',display:'grid',gridTemplateColumns:'300px 1fr'}}>
      <div style={{borderRight:'0.5px solid #1e1e1e',overflowY:'auto'}}>
        <div style={{padding:'20px',borderBottom:'0.5px solid #1e1e1e',fontSize:'16px',fontWeight:'700'}}>Messages</div>
        {conversations.length === 0 ? (
          <div style={{padding:'40px 20px',textAlign:'center',color:'#555',fontSize:'14px'}}>No messages yet</div>
        ) : conversations.map(({ other, lastMsg }) => (
          <div key={other?.id} onClick={() => loadMessages(other)}
            style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',borderBottom:'0.5px solid #111',cursor:'pointer',background:selected?.id === other?.id ? '#1a1a1a' : 'transparent'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#00aff0',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',fontSize:'14px',color:'#000',flexShrink:0}}>
              {other?.display_name?.[0]?.toUpperCase() || other?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'2px'}}>{other?.display_name || other?.username}</div>
              <div style={{fontSize:'12px',color:'#444',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{lastMsg?.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',flexDirection:'column'}}>
        {!selected ? (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#555',fontSize:'14px'}}>Select a conversation</div>
        ) : (
          <>
            <div style={{padding:'16px 20px',borderBottom:'0.5px solid #1e1e1e',display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#00aff0',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',fontSize:'13px',color:'#000'}}>
                {selected?.display_name?.[0]?.toUpperCase() || selected?.username?.[0]?.toUpperCase()}
              </div>
              <div style={{fontSize:'15px',fontWeight:'700'}}>{selected?.display_name || selected?.username}</div>
            </div>
            <div style={{flex:1,padding:'20px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'10px',minHeight:'400px'}}>
              {messages.map((msg, i) => (
                <div key={i} style={{display:'flex',justifyContent:msg.sender_id === user?.id ? 'flex-end' : 'flex-start'}}>
                  <div style={{maxWidth:'65%',padding:'10px 14px',borderRadius:'12px',fontSize:'14px',lineHeight:'1.5',background:msg.sender_id === user?.id ? '#00aff0' : '#1a1a1a',color:msg.sender_id === user?.id ? '#000' : '#ccc'}}>
                    {msg.body}
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:'14px 20px',borderTop:'0.5px solid #1e1e1e',display:'flex',gap:'10px'}}>
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Send a message..."
                style={{flex:1,background:'#1a1a1a',border:'none',borderRadius:'20px',padding:'10px 16px',fontSize:'14px',color:'#fff',outline:'none'}}/>
              <button onClick={sendMessage}
                style={{background:'#00aff0',color:'#000',border:'none',borderRadius:'20px',padding:'10px 20px',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}