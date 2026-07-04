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

      // CORREÇÃO: codifica o código para URLs
      const codigoSafe = encodeURIComponent(perfil.codigo_unico)
      const base = process.env.NEXT_PUBLIC_BASE_URL
      fetch(`${base}/api/${codigoSafe}/e-res/teste`)
       .then(r => r.ok? setStatus('online') : setStatus('erro'))
       .catch(() => setStatus('offline'))
    })
  }, [])

  if (!user) return null

  const base = process.env.NEXT_PUBLIC_BASE_URL
  const codigoSafe = encodeURIComponent(codigo)
  const testLink = `${base}/api/${codigoSafe}/e-res/teste`
  const prompt = `você executará esse link de teste, e me retornará o que tiver no site, ${testLink}`

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={codigo} />
      <main className="p-4 md:p-10 lg:p-14 pt-20 md:pt-10">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Agente de Planilhas IA
          </h1>
          <p className="opacity-70 mb-10 md:mb-14 text-base md:text-lg">Conecte qualquer IA às suas planilhas Google em 1 clique</p>

          <div className="grid lg:grid-cols-2 gap-6 xl:gap-8">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}} className="glass p-7 md:p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl md:text-2xl font-semibold">Link de teste</h2>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${status==='online'?'bg-green-500/20 text-green-400 border-green-500/30':'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>{status}</span>
              </div>
              <code className="bg-black/50 p-4 rounded-xl block break-all text-[13px] leading-relaxed border border-white/5">{testLink}</code>
              <div className="flex gap-3 mt-5">
                <button onClick={()=>copy(testLink)} className="px-5 py-2.5 bg-primary rounded-xl hover:opacity-90 transition font-medium text-sm">{copied?'Copiado!':'Copiar link'}</button>
                <Link href={testLink} target="_blank" className="px-5 py-2.5 glass rounded-xl hover:bg-white/10 transition text-sm">Abrir</Link>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="glass p-7 md:p-8 rounded-3xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Prompt para IA</h2>
              <p className="text-sm opacity-70 mb-4">Cole isso no ChatGPT, Meta AI, Claude...</p>
              <div className="bg-black/50 p-4 rounded-xl text-[13px] leading-relaxed border border-white/5">{prompt}</div>
              <button onClick={()=>copy(prompt)} className="mt-5 w-full px-5 py-2.5 glass rounded-xl hover:bg-white/10 transition text-sm font-medium">Copiar prompt</button>
            </motion.div>
          </div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} className="glass p-7 md:p-8 rounded-3xl mt-8">
            <h3 className="font-semibold text-lg mb-4">Como funciona</h3>
            <ol className="grid md:grid-cols-2 gap-3 text-sm opacity-80">
              <li className="flex gap-3"><span className="text-primary font-bold">1.</span> Faça login com Google (já feito)</li>
              <li className="flex gap-3"><span className="text-primary font-bold">2.</span> Copie o link de teste acima</li>
              <li className="flex gap-3"><span className="text-primary font-bold">3.</span> Cole na IA com o prompt</li>
              <li className="flex gap-3"><span className="text-primary font-bold">4.</span> Use: #@ buscar, 11@ cor texto, 1@ cor fundo</li>
            </ol>
          </motion.div>
        </motion.div>
      </main>
      <UserBadge user={user} />
    </div>
  )
}
