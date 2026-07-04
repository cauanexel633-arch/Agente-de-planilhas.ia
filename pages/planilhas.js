import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Planilhas() {
  const [msg, setMsg] = useState('carregando...')

  useEffect(() => {
    supabase.auth.getSession().then(async ({data}) => {
      const session = data.session
      if (!session) return setMsg('sem sessão')

      const token = session.provider_token
      setMsg(`Token: ${token ? 'OK' : 'AUSENTE'}\n\nScopes: ${session.user?.app_metadata?.provider_scopes || 'nenhum'}`)

      if (!token) return

      const res = await fetch("https://www.googleapis.com/drive/v3/about?fields=user", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const txt = await res.text()
      setMsg(prev => prev + `\n\nTeste Drive:\n${res.status} - ${txt.slice(0,200)}`)
    })
  }, [])

  return <pre className="p-10 text-xs whitespace-pre-wrap">{msg}</pre>
}
