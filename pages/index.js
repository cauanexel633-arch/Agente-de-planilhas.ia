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
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('verificando...')

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
          email,
          nome: name,
          codigo_unico: novoCodigo,
          avatar_url: data.session.user.user_metadata?.avatar_url
        }).select().single()
        perfil = inserted
      }
      setCodigo(perfil.codigo_unico)

      fetch(`/api/${perfil.codigo_unico}/e-res/teste`)
       .then(r => r.ok? setStatus('online') : setStatus('erro'))
       .catch(() => setStatus('offline'))
    })
  }, [])

  if (!user) return null

  const base = process.env.NEXT_PUBLIC_BASE_URL
  const testLink = `${base}/api/${codigo}/e-res/teste`
  const prompt = `você executará esse link de teste, e me retornará o que tiver no site, ${testLink}`

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={codigo} />
      <main className="p-10">
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-4xl font-bold mb-2">
          Agente de Planilhas IA
        </motion.h1>
        <p className="opacity-70 mb-8">Conecte qualquer IA às suas planilhas Google em 1 clique</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}} className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Link de teste</h2>
              <span className={`text-xs px-2 py-1 rounded ${status==='online'?'bg-green-500/20 text-green-400':'bg-yellow-500/20'}`}>{status}</span>
            </div>
            <code className="bg-black/40 p-3 rounded block break-all text-sm">{testLink}</code>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>copy(testLink)} className="px-4 py-2 bg-primary rounded-lg hover:opacity-90 transition">{copied?'Copiado!':'Copiar link'}</button>
              <Link href={testLink} target="_blank" className="px-4 py-2 glass rounded-lg">Abrir</Link>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Prompt para IA</h2>
            <p className="text-sm opacity-80 mb-3">Cole isso no ChatGPT, Meta AI, Claude...</p>
            <div className="bg-black/40 p-3 rounded text-sm">{prompt}</div>
            <button onClick={()=>copy(prompt)} className="mt-4 px-4 py-2 glass rounded-lg w-full">Copiar prompt</button>
          </motion.div>
        </div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} className="glass p-6 rounded-2xl mt-6 max-w-5xl">
          <h3 className="font-semibold mb-3">Como funciona</h3>
          <ol className="list-decimal ml-5 space-y-1 text-sm opacity-80">
            <li>Faça login com Google (já feito)</li>
            <li>Copie o link de teste acima</li>
            <li>Cole na IA com o prompt</li>
            <li>Use os códigos: #@ buscar, 11@ cor texto, 1@ cor fundo...</li>
          </ol>
        </motion.div>
      </main>
      <UserBadge user={user} />
    </div>
  )
}
