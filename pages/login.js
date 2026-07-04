import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'

export default function Login() {
  const login = async () => {
    // limpa sessão antiga para forçar novo consent
    await supabase.auth.signOut()
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          include_granted_scopes: 'true'
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
        <p className="mb-4 opacity-70 text-sm">Entre com Google</p>
        <p className="mb-6 text-xs opacity-50">
          Vamos pedir acesso a:<br/>
          ✓ Planilhas Google<br/>
          ✓ Google Drive
        </p>
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
