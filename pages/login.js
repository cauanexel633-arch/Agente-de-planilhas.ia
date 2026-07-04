import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'

export default function Login() {
  const login = async () => {
    await supabase.auth.signOut()
    
    // força nova autorização
    localStorage.clear()
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        scopes: 'email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent select_account',
          // este parâmetro é o segredo
          scope: 'email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
        }
      }
    })
    if (error) console.log(error)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-dark">
      <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="glass p-10 rounded-2xl text-center max-w-sm w-full mx-4">
        <h1 className="text-3xl font-bold mb-3">Agente de Planilhas IA</h1>
        <p className="mb-6 opacity-70 text-sm">Clique para autorizar Sheets + Drive</p>
        <button onClick={login} className="w-full bg-primary px-6 py-3 rounded-xl font-semibold">
          Autorizar Google
        </button>
      </motion.div>
    </div>
  )
}
