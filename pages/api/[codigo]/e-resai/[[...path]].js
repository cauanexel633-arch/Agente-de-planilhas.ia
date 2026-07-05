import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  const { codigo, path = [] } = req.query
  const [sheetPart, cmd, ...params] = path
  const sheetId = sheetPart?.replace('@','')

  res.setHeader('Content-Type','text/plain; charset=utf-8')

  // BUSCA USUÁRIO
  const { data: user } = await supabase.from('usuarios').select('google_token,email').eq('codigo_unico', codigo).single()
  if (!user?.google_token) return res.status(401).send('ERRO: sem token. Faça login novamente no site.')

  const token = user.google_token
  const headers = { Authorization: `Bearer ${token}` }

  // ##@ = LISTAR PLANILHAS (AGORA FUNCIONA)
  if (sheetPart === '##@' || cmd === '##@' || path.join('').includes('##@')) {
    try {
      const r = await fetch(`https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)&pageSize=30`, { headers })
      const data = await r.json()
      
      if (data.error) return res.send(`ERRO GOOGLE: ${data.error.code} - ${data.error.message}\nToken: ${token.substring(0,20)}...`)
      if (!data.files) return res.send(`RESPOSTA INESPERADA: ${JSON.stringify(data)}`)
      
      const lista = data.files.map(f => `${f.name} | ${f.id}@`).join('\n')
      return res.send(`SUCESSO - ${data.files.length} planilhas encontradas para ${user.email}:\n\n${lista}`)
    } catch(e) {
      return res.send(`FALHA FETCH: ${e.message}`)
    }
  }

  // tutorial
  if (cmd === 'tutorial') {
    return res.send(`Use: /api/${codigo}/e-resai/##@ para listar`)
  }

  // resto dos comandos...
  return res.send(`Comando recebido: ${sheetPart} ${cmd || ''}`)
}
