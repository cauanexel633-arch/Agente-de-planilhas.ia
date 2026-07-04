import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import UserBadge from '../components/UserBadge'
import { supabase } from '../lib/supabaseClient'

export default function Planilhas() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [sheets, setSheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({data}) => {
      if (!data.session) return window.location.href = '/login'
      
      setUser(data.session.user)
      const token = data.session.provider_token

      const { data: perfil } = await supabase.from('usuarios')
        .select('codigo_unico').eq('email', data.session.user.email).single()
      setCodigo(perfil?.codigo_unico)

      if (!token) {
        setErro('Precisa reconectar ao Google')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(
          "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc",
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!res.ok) throw new Error('Token expirado')
        const json = await res.json()
        setSheets(json.files || [])
      } catch (e) {
        setErro('Token expirado - faça login novamente')
      }
      setLoading(false)
    })
  }, [])

  const reconectar = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={codigo} />
      <main className="p-4 md:p-10 pt-20 md:pt-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Planilhas</h1>
          
          {erro ? (
            <div className="glass p-8 rounded-2xl text-center">
              <p className="mb-4 text-amber-400">{erro}</p>
              <button onClick={reconectar} className="px-6 py-2.5 bg-primary rounded-xl">Reconectar Google</button>
            </div>
          ) : (
            <>
              <p className="opacity-70 mb-8">{loading ? 'Carregando...' : `${sheets.length} planilhas`}</p>
              <div className="glass rounded-2xl overflow-hidden">
                {sheets.map(s => (
                  <a key={s.id} href={s.webViewLink} target="_blank" className="p-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-500/20 rounded-lg grid place-items-center">📊</div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs opacity-60">{new Date(s.modifiedTime).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                    <span className="text-xs opacity-50">abrir →</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      {user && <UserBadge user={user} />}
    </div>
  )
}
