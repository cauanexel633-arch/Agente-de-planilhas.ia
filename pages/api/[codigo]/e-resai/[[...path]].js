import { supabaseAdmin } from '../../../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  const { codigo, path = [] } = req.query
  const cmd = decodeURIComponent(path.join('/'))

  const { data: user } = await supabaseAdmin.from('usuarios').select('*').eq('codigo_unico', codigo).single()
  if (!user) return res.status(404).send('Código inválido')

  res.setHeader('Content-Type','text/plain; charset=utf-8')

  // Lógicas do roteiro
  if (cmd === '#@') {
    return res.send('qual é o valor que você procura? valor"<...>" ou celula "<A,0>" ou celulas "<A,0,B,0>"')
  }
  if (cmd === '11@') {
    return res.send('qual celula(s) que você quer alterar a cor do texto ex: celula "<A,0>" ou celulas "<A,0,B,0>"')
  }
  if (cmd.startsWith('<') && cmd.endsWith('>')) {
    const valor = cmd.slice(1,-1)
    // exemplo localizar
    if (valor.toLowerCase() === 'agua') {
      return res.send('o valor "agua" ta na celula "d1"')
    }
    // exemplo definir
    if (path.length === 1) {
      return res.send(`o que você quer fazer na celula "${valor}"?`)
    }
    return res.send(`valor "${valor}" processado`)
  }
  // simula erro
  if (cmd === 'erro') {
    return res.send('Acho que ocorreu problemas tecnicos, por favor tente novamente.')
  }

  return res.send(`e-resai recebido: ${cmd}`)
}
