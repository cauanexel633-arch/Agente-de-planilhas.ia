import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  const { codigo } = req.query
  res.setHeader('Content-Type','text/plain; charset=utf-8')

  const { data: user } = await supabase.from('usuarios').select('google_token,email').eq('codigo_unico', codigo).single()
  if (!user?.google_token) return res.send('ERRO: sem token')

  const r = await fetch(`https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)&pageSize=30`, {
    headers: { Authorization: `Bearer ${user.google_token}` }
  })
  const data = await r.json()

  if (data.error) return res.send(`ERRO GOOGLE ${data.error.code}: ${data.error.message}`)
  if (!data.files?.length) return res.send('Nenhuma planilha encontrada (ou sem permissão Drive)')

  const lista = data.files.map(f => `${f.name} | ${f.id}@`).join('\n')
  return res.send(`SUCESSO - ${user.email}\n\n${lista}`)
}
