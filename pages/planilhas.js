import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import UserBadge from '../components/UserBadge'
import { supabase } from '../lib/supabaseClient'

export default function Planilhas() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [sheets, setSheets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({data}) => {
      if (!data.session) {
        window.location.href = '/login'
        return
      }
      
      setUser(data.session.user)
      const token = data.session.provider_token
      
      // pega código
      const { data: perfil } = await supabase.from('usuarios')
        .select('codigo_unico')
        .eq('email', data.session.user.email)
        .single()
      setCodigo(perfil?.codigo_unico)

      // BUSCA PLANILHAS REAIS
      if (token) {
        try {
          const res = await fetch(
            "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc&pageSize=20",
            { headers: { Authorization: `Bearer ${token}` } }
          )
          const json = await res.json()
          setSheets(json.files || [])
        } catch(e) {
          console.log('Erro Drive:', e)
        }
      }
      setLoading(false)
    })
  }, [])

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={codigo} />
      <main className="p-4 md:p-10 pt-20 md:pt-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Planilhas</h1>
          <p className="opacity-70 mb-8">
            {loading ? 'Carregando...' : `${sheets.length} planilhas encontradas`}
          </p>

          <div className="glass rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center opacity-60">Conectando ao Google Drive...</div>
            ) : sheets.length === 0 ? (
              <div className="p-8 text-center">
                <p className="opacity-60 mb-3">Nenhuma planilha encontrada</p>
                <a href="https://sheets.google.com" target="_blank" className="text-primary text-sm">Criar no Google Sheets</a>
              </div>
            ) : (
              sheets.map(s => (
                <div key={s.id} className="p-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-500/20 rounded-lg grid place-items-center">📊</div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs opacity-60">
                        {new Date(s.modifiedTime).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(s.id)}
                    className="text-xs px-3 py-1.5 glass rounded-lg hover:bg-white/10"
                  >
                    Copiar ID
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      {user && <UserBadge user={user} />}
    </div>
  )
}
