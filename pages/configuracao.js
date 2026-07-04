import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import UserBadge from '../components/UserBadge'
import { supabase } from '../lib/supabaseClient'
import { generateUniqueCode } from '../lib/codeGenerator'

export default function Config() {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [googleStatus, setGoogleStatus] = useState({ sheets: 'verificando', drive: 'verificando' })

  useEffect(() => {
    supabase.auth.getSession().then(async ({data}) => {
      if (!data.session) {
        window.location.href = '/login'
        return
      }
      
      setUser(data.session.user)
      
      // Verifica scopes reais
      const token = data.session.provider_token
      const session = data.session
      
      if (token) {
        // Testa se tem permissão
        try {
          const testSheets = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token)
          const info = await testSheets.json()
          const scopes = info.scope || ''
          
          setGoogleStatus({
            sheets: scopes.includes('spreadsheets') ? 'conectado' : 'pendente',
            drive: scopes.includes('drive') ? 'conectado' : 'pendente'
          })
        } catch {
          setGoogleStatus({ sheets: 'conectado', drive: 'conectado' })
        }
      }

      const {data: p} = await supabase.from('usuarios').select('*').eq('email', data.session.user.email).single()
      setPerfil(p)
    })
  }, [])

  const regenerar = async () => {
    const novo = generateUniqueCode(perfil.nome)
    await supabase.from('usuarios').update({codigo_unico: novo}).eq('email', perfil.email)
    setPerfil({...perfil, codigo_unico: novo})
    alert('Código regenerado!')
  }

  const copiar = (t) => { navigator.clipboard.writeText(t); alert('Copiado!') }
  
  const sair = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!perfil) return null

  const StatusBadge = ({ status }) => (
    <span className={`text-xs px-2.5 py-1 rounded-full ${
      status === 'conectado' 
        ? 'bg-green-500/20 text-green-400' 
        : status === 'verificando'
        ? 'bg-gray-500/20 text-gray-400'
        : 'bg-yellow-500/20 text-yellow-400'
    }`}>
      {status === 'conectado' ? 'Conectado' : status === 'verificando' ? '...' : 'Pendente'}
    </span>
  )

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={perfil.codigo_unico} />
      <main className="p-4 md:p-10 pt-20 md:pt-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Configuração</h1>

          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">Conta</h3>
              <div className="flex items-center gap-4">
                <img src={perfil.avatar_url || `https://ui-avatars.com/api/?name=${perfil.nome}`} className="w-14 h-14 rounded-full" />
                <div>
                  <div className="font-medium">{perfil.nome}</div>
                  <div className="text-sm opacity-70">{perfil.email}</div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">Código Único</h3>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-black/40 p-3 rounded-xl font-mono">{perfil.codigo_unico}</code>
                <button onClick={()=>copiar(perfil.codigo_unico)} className="px-4 py-2.5 glass rounded-xl text-sm hover:bg-white/10">Copiar</button>
                <button onClick={regenerar} className="px-4 py-2.5 bg-amber-500/20 text-amber-400 rounded-xl text-sm hover:bg-amber-500/30">Regenerar</button>
              </div>
              <p className="text-xs opacity-60 mt-3">Regenerar invalida links antigos</p>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">Integrações</h3>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <div className="font-medium">Google Sheets</div>
                  <div className="text-xs opacity-60">Permite editar planilhas</div>
                </div>
                <StatusBadge status={googleStatus.sheets} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">Google Drive</div>
                  <div className="text-xs opacity-60">Lista suas planilhas</div>
                </div>
                <StatusBadge status={googleStatus.drive} />
              </div>
              {googleStatus.sheets !== 'conectado' && (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="mt-4 w-full py-2.5 glass rounded-xl text-sm hover:bg-white/10"
                >
                  Reconectar Google
                </button>
              )}
            </div>

            <div className="glass p-6 rounded-2xl border border-red-500/20">
              <h3 className="font-semibold mb-2 text-red-400">Zona de perigo</h3>
              <p className="text-sm opacity-70 mb-3">Sair da conta atual</p>
              <button onClick={sair} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/30">Sair da conta</button>
            </div>
          </div>
        </div>
      </main>
      {user && <UserBadge user={user} />}
    </div>
  )
}
