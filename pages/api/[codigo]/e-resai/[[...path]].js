import { supabaseAdmin } from 'lib/supabaseAdmin'

const respostas = {
  '#@': 'qual é o valor que você procura? ex: "<...>" ou celula "<A,0>" ou celulas "<A,0,B,0>"',
  '0@': 'qual célula deseja apagar? ex: "<A,1>"',
  '00@': 'qual célula deseja limpar? ex: "<A,1>"',
  '1@': 'qual célula para alterar cor de fundo? ex: "<A,1>"',
  '11@': 'qual celula(s) que você quer alterar a cor do texto ex: celula "<A,0>" ou celulas "<A,0,B,0>"',
  '2@': 'qual célula para alterar tamanho do texto? ex: "<A,1>"',
  '22@': 'qual célula para formato (negrito,italico)? ex: "<A,1>"',
  '222@': 'qual célula para alterar fonte? ex: "<A,1>"',
  '3@': 'qual fórmula deseja inserir? ex: "<=SOMA(A1:A10)>"',
  '33@': 'qual função deseja usar? ex: "<...>"',
  '4@': 'qual célula para adicionar borda? ex: "<A,1>"',
  '5@': 'qual intervalo para mesclar? ex: "<A1:B2>"',
  '6@': 'alinhamento horizontal? esquerda, centro ou direito para ex: "<A,1>"',
  '66@': 'alinhamento vertical? superior, meio ou inferior para ex: "<A,1>"',
  '7@': 'ajuste de texto? exceder, ajustar ou cortar para ex: "<A,1>"',
  '8@': 'rotação do texto para ex: "<A,1>"?',
  '9@': 'qual link inserir em ex: "<A,1>"?',
  '99@': 'qual comentário inserir em ex: "<A,1>"?',
  '999@': 'qual tipo de gráfico inserir?',
  '10@': 'onde criar filtro? ex: "<A1:D10>"',
  '11@': 'onde inserir caixa de seleção? ex: "<A,1>"',
  '12@': 'onde inserir lista suspensa? ex: "<A,1>"',
  '13@': 'nome da nova página? ex: "<Vendas>"',
}

export default async function handler(req, res) {
  const { codigo, path = [] } = req.query
  const cmd = decodeURIComponent(path.join('/'))

  const { data: user } = await supabaseAdmin.from('usuarios').select('*').eq('codigo_unico', codigo).single()
  if (!user) return res.status(404).send('Código inválido')

  res.setHeader('Content-Type','text/plain; charset=utf-8')

  // LINK DO TUTORIAL
  if (cmd === 'tutorial') {
    return res.send(`TUTORIAL AGENTE DE PLANILHAS IA:
1. #@ = buscar valor
2. 11@ = cor do texto
3. 1@ = cor de fundo
4. 3@ = inserir fórmula
5. Use /<valor> para enviar dados
6. Encadeie com "-" ex: 1@-11@
Base: /api/${codigo}/e-resai/`)
  }

  if (respostas[cmd]) return res.send(respostas[cmd])

  if (cmd.startsWith('<') && cmd.endsWith('>')) {
    const valor = cmd.slice(1,-1)
    if (valor.toLowerCase() === 'agua') return res.send('o valor "agua" ta na celula "d1"')
    return res.send(`valor "${valor}" processado`)
  }

  return res.send(`e-resai recebido: ${cmd}`)
}
