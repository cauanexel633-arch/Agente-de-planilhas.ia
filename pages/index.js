import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      if (session) {
        setUser(session.user)
        // salva/atualiza usuário e token
        const token = session.provider_token
        const { data: existe } = await supabase
         .from('usuarios')
         .select('codigo_unico')
         .eq('email', session.user.email)
         .single()

        if (!existe) {
          const novoCodigo = session.user.email.split('@')[0] + Math.floor(Math.random()*9999)
          await supabase.from('usuarios').insert({
            email: session.user.email,
            nome: session.user.user_metadata.full_name,
            codigo_unico: novoCodigo,
            google_token: token,
            plano: 'gratuito'
          })
          setCodigo(novoCodigo)
        } else {
          await supabase.from('usuarios')
           .update({ google_token: token })
           .eq('email', session.user.email)
          setCodigo(existe.codigo_unico)
        }
      }
    })
  }, [])

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      },
      redirectTo: typeof window!== 'undefined'? window.location.origin : undefined
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCodigo('')
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 40, maxWidth: 600, margin: '0 auto' }}>
      <h1>Agente de Planilhas IA</h1>

      {!user? (
        <>
          <p>Faça login com Google para conectar suas planilhas.</p>
          <button onClick={login} style={{ padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}>
            Entrar com Google
          </button>
        </>
      ) : (
        <>
          <p>Olá, <b>{user.user_metadata.full_name}</b></p>
          <p>Seu código único:</p>
          <div style={{ background: '#f0f0f0', padding: 15, fontSize: 20, fontWeight: 'bold' }}>
            {codigo}
          </div>

          <h3 style={{ marginTop: 30 }}>Sua API:</h3>
          <code style={{ display: 'block', background: '#000', color: '#0f0', padding: 10 }}>
            https://agente-de-planilhas-ia.vercel.app/api/{codigo}/e-resai/
          </code>

          <h4>Testar:</h4>
          <p>Listar planilhas:</p>
          <code>.../e-resai/list</code>

          <p style={{ marginTop: 20 }}>Editar célula A1:</p>
          <code>.../e-resai/SEU_ID@/A1/TEXTO</code>

          <button onClick={logout} style={{ marginTop: 30 }}>Sair</button>
        </>
      )}
    </div>
  )
}
