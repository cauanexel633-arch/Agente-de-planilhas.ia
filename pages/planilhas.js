import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import UserBadge from '../components/UserBadge'
import { supabase } from '../lib/supabaseClient'

export default function Planilhas() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      if (!data.session) {
        window.location.href = '/login'
        return
      }
      setUser(data.session.user)
      supabase.from('usuarios')
        .select('codigo_unico')
        .eq('email', data.session.user.email)
        .single()
        .then(({data}) => setCodigo(data?.codigo_unico))
    })
  }, [])

  const sheets = [
    { id:1, nome:'Vendas 2024', ultima:'hoje 14:32' },
    { id:2, nome:'Controle Estoque', ultima:'ontem' },
  ]

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={codigo} />
      <main className="p-4 md:p-10 pt-20 md:pt-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Planilhas</h1>
          <p className="opacity-70 mb-8">Suas planilhas do Google Drive</p>

          <div className="glass rounded-2xl overflow-hidden">
            {sheets.map(s => (
              <div 
                key={s.id} 
                className="p-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-500/20 rounded-lg grid place-items-center">
                    📊
                  </div>
                  <div>
                    <div className="font-medium">{s.nome}</div>
                    <div className="text-xs opacity-60">{s.ultima}</div>
                  </div>
                </div>
                <button className="text-xs px-3 py-1.5 glass rounded-lg hover:bg-white/10">
                  Usar com IA
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      {user && <UserBadge user={user} />}
    </div>
  )
}
