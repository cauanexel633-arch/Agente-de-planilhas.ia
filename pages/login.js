import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'

export default function Login() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        redirectTo: `${window.location.origin}/`
      }
    })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-dark">
      <motion.div 
        initial={{scale:0.9, opacity:0}} 
        animate={{scale:1, opacity:1}} 
        className="glass p-10 rounded-2xl text-center max-w-sm w-full mx-4"
      >
        <h1 className="text-3xl font-bold mb-3">Agente de Planilhas IA</h1>
        <p className="mb-6 opacity-70 text-sm">Entre com Google para criar seu código único</p>
        <p className="mb-6 text-xs opacity-50">Vamos pedir acesso ao Sheets e Drive para funcionar</p>
        <button 
          onClick={login} 
          className="w-full bg-primary px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Entrar com Google
        </button>
      </motion.div>
    </div>
  )
}
