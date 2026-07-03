import { supabaseAdmin } from '../../../../../lib/supabaseAdmin'

const funcoes = {
  '#@': 'localizar item na célula',
  '0@': 'apagar',
  '00@': 'limpar célula',
  '1@': 'alterar cor de fundo',
  '11@': 'alterar cor do texto',
  '2@': 'alterar tamanho do texto',
}

export default async function handler(req, res) {
  const { codigo, path = [] } = req.query
  const comando = decodeURIComponent(path.join('/'))

  // valida código
  const { data: user } = await supabaseAdmin.from('usuarios').select('*').eq('codigo_unico', codigo).single()
  if (!user) return res.status(404).send('Código inválido')

  res.setHeader('Content-Type','text/plain; charset=utf-8')

  if (comando === 'teste') {
    return res.send(`Servidor online. Código: ${codigo}. Usuário: ${user.email}`)
  }
  if (comando.startsWith('mudar')) {
    return res.send('Comando recebido: mudar')
  }
  // retorna o que tiver
  return res.send(`e-res executado: ${comando}`)
}
