import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function UserBadge({ user }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-4 left-4">
      <div className="flex items-center gap-2">
        <img src={user?.user_metadata?.avatar_url} className="w-8 h-8 rounded-full" />
        <span className="text-sm">{user?.email}</span>
        <button onClick={()=>setOpen(!open)}>⋯</button>
      </div>
      {open && (
        <div className="mt-2 glass p-2 rounded">
          <button onClick={()=>supabase.auth.signOut()} className="text-sm">Sair dessa conta</button>
        </div>
      )}
    </div>
  )
}
