import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Sidebar({ codigo }) {
  const items = [
    { href: '/', label: 'Início' },
    { href: '/tutorial', label: 'Tutorial' },
    { href: '/planilhas', label: 'Planilhas' },
    { href: '/configuracao', label: 'Configuração' },
  ]
  return (
    <aside className="w-56 p-4 glass h-screen fixed left-0 top-0 border-r border-white/10">
      <Link href="/" className="text-xl font-bold text-primary block mb-8">Agente de planilhas ia</Link>
      <nav className="space-y-2">
        {items.map((it, i) => (
          <motion.div key={it.href} initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:i*0.05}}>
            <Link href={it.href} className="block py-2.5 px-3 rounded-lg hover:bg-white/10 transition">
              {it.label}
            </Link>
          </motion.div>
        ))}
      </nav>
      {codigo && (
        <div className="absolute bottom-24 left-4 right-4">
          <div className="text-xs opacity-60 mb-1">Seu código</div>
          <div className="font-mono text-sm bg-black/30 px-2 py-1 rounded">{codigo}</div>
        </div>
      )}
    </aside>
  )
}
