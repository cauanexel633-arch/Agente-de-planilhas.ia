import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { generateUniqueCode } from '../lib/codeGenerator'
import Sidebar from '../components/Sidebar'
import UserBadge from '../components/UserBadge'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [status, setStatus] = useState('verificando...')
  const [promptAtivo, setPromptAtivo] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { window.location.href = '/login'; return }
      setUser(data.session.user)
      const email = data.session.user.email
      const name = data.session.user.user_metadata?.full_name || email.split('@')[0]

      let { data: perfil } = await supabase.from('usuarios').select('*').eq('email', email).single()
      if (!perfil) {
        const novoCodigo = generateUniqueCode(name)
        const { data: inserted } = await supabase.from('usuarios').insert({
          email, nome: name, codigo_unico: novoCodigo, avatar_url: data.session.user.user_metadata?.avatar_url
        }).select().single()
        perfil = inserted
      }
      setCodigo(perfil.codigo_unico)

      const codigoSafe = encodeURIComponent(perfil.codigo_unico)
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${codigoSafe}/e-res/teste`)
      .then(r => setStatus(r.ok? 'online' : 'erro')).catch(() => setStatus('offline'))
    })
  }, [])

  if (!user) return null

  const base = process.env.NEXT_PUBLIC_BASE_URL
  const codigoSafe = encodeURIComponent(codigo)
  const linkTeste = `${base}/api/${codigoSafe}/e-res/teste`
  const linkTutorial = `${base}/api/${codigoSafe}/e-resai/#@`

  const prompts = {
    teste: `você executará esse link de teste, e me retornará o que tiver no site, ${linkTeste}`,
    tutorial: `você vai usar este servidor para controlar planilhas. Primeiro execute: ${linkTutorial} e me diga o que retornar`
  }

  const copy = (t) => navigator.clipboard.writeText(t)

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={codigo} />
      <main className="p-4 md:p-10 lg:p-14 pt-20 md:pt-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Agente de Planilhas IA</h1>
          <p className="opacity-70 mb-10">Escolha um link e o prompt aparece automaticamente</p>

          <div className="grid lg:grid-cols-2 gap-6 xl:gap-8">
            {/* ESQUERDA - dividido em 2 */}
            <div className="glass rounded-3xl overflow-hidden">
              {/* Parte de cima */}
              <div className="p-7 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Link de teste</h2>
                  <span className={`text-xs px-3 py-1 rounded-full ${status==='online'?'bg-green-500/20 text-green-400':'bg-amber-500/20 text-amber-400'}`}>{status}</span>
                </div>
                <code className="bg-black/50 p-3 rounded-xl block break-all text-xs">{linkTeste}</code>
                <div className="flex gap-2 mt-4">
                  <button onClick={()=>setPromptAtivo('teste')} className="flex-1 px-4 py-2.5 bg-primary rounded-xl text-sm font-medium">Usar este link</button>
                  <Link href={linkTeste} target="_blank" className="px-4 py-2.5 glass rounded-xl text-sm">Abrir</Link>
                </div>
              </div>
              {/* Parte de baixo */}
              <div className="p-7">
                <h2 className="text-xl font-semibold mb-3">Link do tutorial</h2>
                <code className="bg-black/50 p-3 rounded-xl block break-all text-xs">{linkTutorial}</code>
                <button onClick={()=>setPromptAtivo('tutorial')} className="w-full mt-4 px-4 py-2.5 glass rounded-xl text-sm font-medium hover:bg-white/10">Usar tutorial</button>
              </div>
            </div>

            {/* DIREITA - prompt em branco */}
            <div className="glass p-7 md:p-8 rounded-3xl flex flex-col">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Prompt para IA</h2>
              {!promptAtivo? (
                <div className="flex-1 grid place-items-center opacity-40 text-center">
                  <div>
                    <div className="text-5xl mb-3">👈</div>
                    <p className="text-sm">Clique em "Usar este link" ao lado</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-black/50 p-4 rounded-xl text-[13px] leading-relaxed border border-white/5 flex-1">{prompts[promptAtivo]}</div>
                  <button onClick={()=>copy(prompts[promptAtivo])} className="mt-5 w-full px-5 py-3 bg-primary rounded-xl font-medium">Copiar prompt</button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <UserBadge user={user} />
    </div>
  )
}
