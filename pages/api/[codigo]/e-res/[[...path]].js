import { supabaseAdmin } from 'lib/supabaseAdmin'

export default async function handler(req, res) {
  const { codigo, path = [] } = req.query
  const comando = decodeURIComponent(path.join('/'))

  const { data: user } = await supabaseAdmin.from('usuarios').select('*').eq('codigo_unico', codigo).single()
  if (!user) return res.status(404).send('Código inválido')

  res.setHeader('Content-Type','text/plain; charset=utf-8')
  res.setHeader('Cache-Control','no-store')

  if (comando === 'teste') {
    return res.send(`Servidor online. Código: ${codigo}. Usuário: ${user.email}`)
  }

  if (comando.includes('-')) {
    const partes = comando.split('-')
    return res.send(`Executando ${partes.length} comandos em sequência: ${partes.join(', ')}`)
  }

  return res.send(`e-res executado: ${comando}`)
}
