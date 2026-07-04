import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import UserBadge from '../components/UserBadge'
import { supabase } from '../lib/supabaseClient'

export default function Planilhas() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [sheets, setSheets] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      if (!data.session) window.location.href = '/login'
      else {
        setUser(data.session.user)
        supabase.from('usuarios').select('codigo_unico').eq('email', data.session.user.email).single().then(({data}) => setCodigo(data?.codigo_unico))
      }
    })
    // mock - depois conectamos Google Drive
    setSheets([
      { id:1, nome:'Vendas 2024', ultima:'hoje 14:32' },
      { id:2, nome:'Controle Estoque', ultima:'ontem' },
    ])
  }, [])

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={codigo} />
      <main className="p-4 md:p-10 pt-20 md:pt-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Planilhas</h1>
              <p className="opacity-70 mt-1">Conecte seu Google Drive</p>
            </div>
            <button className="px-5 py-2.5 bg-primary rounded-xl font-medium text-sm hover:opacity-90">+ Conectar Drive</button>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 text-sm opacity-60 grid-cols-12">
              <div className="col-span-6">Nome</div>
              <div className="col-span-3">Última edição</div>
              <div className="col-span-3">Ação</div>
            </div>
            {sheets.map(s => (
              <div key={s.id} className="p-4 grid grid-cols-12 hover:bg-white/5 border-b border-white/5 last:border-0">
                <div className="col-span-6 font-medium flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded grid place-items-center">📊</div>
                  {s.nome}
                </div>
                <div className="col-span-3 text-sm opacity-70 self-center">{s.ultima}</div>
                <div className="col-span-3 self-center">
                  <button className="text-xs px-3 py-1.5 glass rounded-lg hover:bg-white/10">Usar com IA</button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass p-6 rounded-2xl mt-8 border-amber-500/20">
            <p className="text-sm">⚠️ Para funcionar 100%, precisamos pedir permissão do Google Sheets no login. Quer que eu ative agora?</p>
          </div>
        </div>
      </main>
      {user && <UserBadge user={user} />}
    </div>
  )
}
