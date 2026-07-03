import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { supabaseAdmin } from '../lib/supabaseAdmin'
import { generateUniqueCode } from '../lib/codeGenerator'
import Sidebar from '../components/Sidebar'
import UserBadge from '../components/UserBadge'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { window.location.href = '/login'; return }
      setUser(data.session.user)
      const email = data.session.user.email
      const name = data.session.user.user_metadata?.full_name || email.split('@')[0]

      // busca ou cria código
      let { data: perfil } = await supabaseAdmin.from('usuarios').select('*').eq('email', email).single()
      if (!perfil) {
        const novoCodigo = generateUniqueCode(name)
        const { data: inserted } = await supabaseAdmin.from('usuarios').insert({
          email,
          nome: name,
          codigo_unico: novoCodigo,
          avatar_url: data.session.user.user_metadata?.avatar_url
        }).select().single()
        perfil = inserted
      }
      setCodigo(perfil.codigo_unico)
    })
  }, [])

  if (!user) return null

  const testLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/${codigo}/e-res/teste`

  return (
    <div className="ml-56 min-h-screen">
      <Sidebar codigo={codigo} />
      <main className="p-10">
        <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} className="text-4xl font-bold mb-6">
          Bem-vindo ao Agente de Planilhas IA
        </motion.h1>
        <div className="glass p-6 rounded-xl max-w-2xl">
          <p className="mb-4">Seu link de teste:</p>
          <code className="bg-black/30 p-3 rounded block break-all">{testLink}</code>
          <p className="mt-4 text-sm opacity-80">Cole em qualquer IA com o prompt: "você executará esse link de teste, e me retornará o que tiver no site, {testLink}"</p>
          <Link href={`/api/${codigo}/e-res/teste`} target="_blank" className="inline-block mt-4 text-primary underline">Abrir teste</Link>
        </div>
      </main>
      <UserBadge user={user} />
    </div>
  )
}
