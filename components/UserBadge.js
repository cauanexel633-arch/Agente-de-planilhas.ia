import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function UserBadge({ user }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
        <img src={user?.user_metadata?.avatar_url} className="w-8 h-8 rounded-full" alt="" />
        <div className="text-sm">
          <div className="leading-tight">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</div>
          <div className="text-xs opacity-60">{user?.email}</div>
        </div>
        <button onClick={()=>setOpen(!open)} className="ml-2 opacity-70 hover:opacity-100">⋯</button>
      </div>
      {open && (
        <div className="mt-2 glass p-2 rounded-lg w-48">
          <button onClick={()=>supabase.auth.signOut()} className="text-sm w-full text-left px-2 py-1.5 hover:bg-white/10 rounded">Sair dessa conta</button>
        </div>
      )}
    </div>
  )
}
