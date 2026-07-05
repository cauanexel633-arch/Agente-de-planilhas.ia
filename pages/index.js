import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Home() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      if (session?.user) {
        setUser(session.user)
        const token = session.provider_token
        const email = session.user.email

        const { data: userDb } = await supabase.from('usuarios').select('*').eq('email', email).single()

        if (!userDb) {
          const novoCodigo = email.split('@')[0].replace(/[^a-z0-9]/gi,'') + Math.floor(1000+Math.random()*9000)
          await supabase.from('usuarios').insert({
            email, nome: session.user.user_metadata.full_name,
            codigo_unico: novoCodigo, google_token: token, plano: 'gratuito'
          })
          setCodigo(novoCodigo)
        } else {
          await supabase.from('usuarios').update({ google_token: token }).eq('email', email)
          setCodigo(userDb.codigo_unico)
        }
      }
      setLoading(false)
    })
  }, [])

  const login = () => supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly',
      queryParams: { access_type: 'offline', prompt: 'consent' }
    }
  })

  const logout = async () => { await supabase.auth.signOut(); location.reload() }

  if (loading) return <div style={s.center}>Carregando...</div>

  return (
    <div style={s.bg}>
      <div style={s.card}>
        <h1 style={s.h1}>📊 Agente de Planilhas IA</h1>
        {!user? (
          <>
            <p style={s.p}>Conecte suas Planilhas Google e controle tudo por URL ou pelo ChatGPT.</p>
            <button onClick={login} style={s.btn}>Entrar com Google</button>
          </>
        ) : (
          <>
            <div style={s.userBox}>
              <img src={user.user_metadata.avatar_url} style={s.avatar} />
              <div><b>{user.user_metadata.full_name}</b><br/><small>{user.email}</small></div>
              <button onClick={logout} style={s.logout}>Sair</button>
            </div>

            <div style={s.codeBox}>
              <label>Seu código secreto:</label>
              <div style={s.codigo}>{codigo}</div>
            </div>

            <div style={s.apiBox}>
              <h3>Sua API Base</h3>
              <code style={s.code}>https://agente-de-planilhas-ia.vercel.app/api/{codigo}/e-resai/</code>
            </div>

            <div style={s.grid}>
              <div style={s.item}><b>1. Listar planilhas</b><br/><code>.../list</code></div>
              <div style={s.item}><b>2. Editar célula</b><br/><code>.../ID@/A1/Valor</code></div>
              <div style={s.item}><b>3. Ler célula</b><br/><code>.../ID@/A1</code></div>
              <div style={s.item}><b>4. Tutorial</b><br/><code>.../tutorial</code></div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  bg:{minHeight:'100vh',background:'linear-gradient(135deg,#667eea,#764ba2)',display:'flex',alignItems:'center',justifyContent:'center',padding:20},
  card:{background:'#fff',borderRadius:16,padding:40,maxWidth:700,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,.3)'},
  h1:{margin:'0 0 10px',color:'#333'}, p:{color:'#666'}, btn:{background:'#4285F4',color:'#fff',border:0,padding:'14px 28px',borderRadius:8,fontSize:16,cursor:'pointer',width:'100%'},
  center:{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center'},
  userBox:{display:'flex',alignItems:'center',gap:12,background:'#f8f9fa',padding:12,borderRadius:8,margin:'20px 0'},
  avatar:{width:40,height:40,borderRadius:'50%'}, logout:{marginLeft:'auto',background:'transparent',border:'1px solid #ddd',padding:'6px 12px',borderRadius:6,cursor:'pointer'},
  codeBox:{margin:'20px 0'}, codigo:{background:'#000',color:'#0f0',padding:15,fontSize:22,fontFamily:'monospace',borderRadius:8,textAlign:'center',marginTop:8},
  apiBox:{background:'#f0f4ff',padding:15,borderRadius:8,margin:'20px 0'}, code:{fontSize:13,wordBreak:'break-all'},
  grid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:20}, item:{background:'#fafafa',padding:12,borderRadius:8,fontSize:14}
}
