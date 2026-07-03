import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'

export default function Login() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',
        redirectTo: `${window.location.origin}`
      }
    })
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="glass p-10 rounded-2xl text-center">
        <h1 className="text-3xl font-bold mb-6">Agente de Planilhas IA</h1>
        <p className="mb-6 opacity-80">Entre com Google para criar seu código único</p>
        <button onClick={login} className="bg-primary px-6 py-3 rounded-lg font-semibold">Entrar com Google</button>
      </motion.div>
    </div>
  )
}
