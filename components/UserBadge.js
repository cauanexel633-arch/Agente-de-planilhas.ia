import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function UserBadge({ user }) {
  const [open, setOpen] = useState(false)
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0]

  return (
    <div className="fixed bottom-3 left-3 right-3 md:right-auto md:w-auto z-50">
      <div className="flex items-center gap-2.5 glass px-3 py-2.5 rounded-2xl shadow-lg max-w-full md:max-w-[240px]">
        <img
          src={user?.user_metadata?.avatar_url}
          className="w-9 h-9 rounded-full shrink-0 ring-1 ring-white/10"
          alt=""
        />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium leading-tight truncate">{name}</div>
          <div className="text-[11px] opacity-60 truncate">{user?.email}</div>
        </div>
        <button
          onClick={()=>setOpen(!open)}
          className="shrink-0 w-6 h-6 grid place-items-center opacity-70 hover:opacity-100 transition"
        >
          ⋯
        </button>
      </div>
      {open && (
        <div className="mt-2 glass p-1.5 rounded-xl w-44 animate-in fade-in">
          <button
            onClick={()=>supabase.auth.signOut()}
            className="text-[13px] w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition"
          >
            Sair dessa conta
          </button>
        </div>
      )}
    </div>
  )
}
