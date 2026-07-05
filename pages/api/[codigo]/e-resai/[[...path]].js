import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  const { codigo, path = [] } = req.query
  const raw = req.url || ''
  res.setHeader('Content-Type','text/plain; charset=utf-8')

  const { data: user } = await supabase.from('usuarios').select('google_token,email').eq('codigo_unico', codigo).single()
  if (!user?.google_token) return res.send('ERRO: faça login')

  const token = user.google_token
  const headers = { Authorization: `Bearer ${token}` }

  // ACEITA: /##@  OU /list  OU /e-resai##@
  if (raw.includes('##@') || path[0]==='list' || path[0]==='##@') {
    const r = await fetch(`https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)&pageSize=30`, { headers })
    const data = await r.json()
    if (data.error) return res.send(`ERRO ${data.error.code}: ${data.error.message}`)
    const lista = data.files.map(f => `${f.name} | ${f.id}@`).join('\n')
    return res.send(`PLANILHAS (${data.files.length}):\n${lista}`)
  }

  return res.send('OK')
}
