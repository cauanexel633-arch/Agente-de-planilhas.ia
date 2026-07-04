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
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-56 p-4 glass h-screen fixed left-0 top-0 border-r border-white/10 flex-col">
        <Link href="/" className="text-xl font-bold text-primary block mb-8">Agente de planilhas ia</Link>
        <nav className="space-y-1.5 flex-1">
          {items.map((it, i) => (
            <motion.div key={it.href} initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:i*0.05}}>
              <Link href={it.href} className="block py-2.5 px-3 rounded-lg hover:bg-white/10 transition text-[14px]">
                {it.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        {codigo && (
          <div className="mt-auto pb-20">
            <div className="text-[11px] opacity-60 mb-1">Seu código</div>
            <div className="font-mono text-xs bg-black/30 px-2.5 py-1.5 rounded-lg truncate">{codigo}</div>
          </div>
        )}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 glass border-b border-white/10 px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">Agente IA</span>
          <span className="text-xs opacity-60 font-mono truncate max-w-[120px]">{codigo}</span>
        </div>
      </div>
    </>
  )
}
