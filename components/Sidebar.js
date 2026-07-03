import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Sidebar({ codigo }) {
  const items = [
    { href: '/tutorial', label: 'Tutorial' },
    { href: '/planilhas', label: 'Planilhas' },
    { href: '/configuracao', label: 'Configuração' },
  ]
  return (
    <aside className="w-56 p-4 glass h-screen fixed left-0 top-0">
      <Link href="/" className="text-xl font-bold text-primary">Agente de planilhas ia</Link>
      <nav className="mt-10 space-y-3">
        {items.map((it, i) => (
          <motion.div key={it.href} initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:i*0.1}}>
            <Link href={it.href} className="block py-2 px-3 rounded hover:bg-white/10">{it.label}</Link>
          </motion.div>
        ))}
      </nav>
      {codigo && (
        <div className="absolute bottom-20 left-4 text-xs opacity-70">
          Código: {codigo}
        </div>
      )}
    </aside>
  )
}
