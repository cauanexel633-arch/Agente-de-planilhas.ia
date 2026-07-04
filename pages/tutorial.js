import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import UserBadge from '../components/UserBadge'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'

const comandos = [
  { cod: '#@', nome: 'Localizar', desc: 'Encontra valor ou célula', ex: '/e-resai/#@ → depois /<agua>' },
  { cod: '0@', nome: 'Apagar', desc: 'Apaga conteúdo da célula', ex: '/e-resai/0@' },
  { cod: '00@', nome: 'Limpar', desc: 'Limpa formatação', ex: '/e-resai/00@' },
  { cod: '1@', nome: 'Cor fundo', desc: 'Altera cor de fundo', ex: '/e-resai/1@' },
  { cod: '11@', nome: 'Cor texto', desc: 'Altera cor do texto', ex: '/e-resai/11@' },
  { cod: '2@', nome: 'Tamanho', desc: 'Altera tamanho da fonte', ex: '/e-resai/2@' },
  { cod: '3@', nome: 'Fórmulas', desc: 'Insere fórmula', ex: '/e-resai/3@' },
  { cod: '4@', nome: 'Borda', desc: 'Adiciona bordas', ex: '/e-resai/4@' },
  { cod: '5@', nome: 'Mesclar', desc: 'Mescla células', ex: '/e-resai/5@' },
  { cod: '9@', nome: 'Link', desc: 'Insere hyperlink', ex: '/e-resai/9@' },
  { cod: '999@', nome: 'Gráfico', desc: 'Cria gráfico', ex: '/e-resai/999@' },
]

export default function Tutorial() {
  const [user, setUser] = useState(null)
  const [codigo, setCodigo] = useState('')

  useState(() => {
    supabase.auth.getSession().then(({data}) => {
      if (!data.session) window.location.href = '/login'
      else {
        setUser(data.session.user)
        supabase.from('usuarios').select('codigo_unico').eq('email', data.session.user.email).single().then(({data}) => setCodigo(data?.codigo_unico))
      }
    })
  }, [])

  const copy = (t) => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${codigo}${t}`)

  return (
    <div className="md:ml-56 min-h-screen bg-dark">
      <Sidebar codigo={codigo} />
      <main className="p-4 md:p-10 pt-20 md:pt-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Tutorial</h1>
          <p className="opacity-70 mb-8">Todos os comandos que a IA pode executar</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comandos.map((c,i) => (
              <motion.div key={c.cod} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}} className="glass p-5 rounded-2xl hover:bg-white/[0.07] transition cursor-pointer group" onClick={()=>copy(c.ex.split(' ')[0])}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-primary font-bold">{c.cod}</div>
                    <div className="font-semibold mt-1">{c.nome}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 text-xs">copiar</div>
                </div>
                <p className="text-sm opacity-70 mt-2">{c.desc}</p>
                <code className="text-[11px] opacity-50 mt-3 block">{c.ex}</code>
              </motion.div>
            ))}
          </div>

          <div className="glass p-6 rounded-2xl mt-8">
            <h3 className="font-semibold mb-3">Exemplo real</h3>
            <div className="space-y-2 text-sm font-mono">
              <div>IA: <span className="text-primary">/e-resai/#@</span></div>
              <div>Servidor: qual valor procura?</div>
              <div>IA: <span className="text-primary">/&lt;agua&gt;</span></div>
              <div>Servidor: o valor "agua" ta na celula "d1"</div>
            </div>
          </div>
        </div>
      </main>
      {user && <UserBadge user={user} />}
    </div>
  )
}
