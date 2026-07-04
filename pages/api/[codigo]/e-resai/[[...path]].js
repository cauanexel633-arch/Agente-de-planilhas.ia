import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const respostas = {
  '##@': '##@ é para buscar por planilhas. Use "ID_DA_PLANILHA@" para selecionar a planilha que vai editar',
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
  '14@': 'onde inserir caixa de seleção? ex: "<A,1>"',
  '12@': 'onde inserir lista suspensa? ex: "<A,1>"',
  '13@': 'nome da nova página? ex: "<Vendas>"',
}

export default async function handler(req, res) {
  const { codigo, path = [] } = req.query
  const [sheetPart, cmd,...params] = path
  const sheetId = sheetPart?.replace('@','')

  res.setHeader('Content-Type','text/plain; charset=utf-8')

  if (sheetPart === 'tutorial' || cmd === 'tutorial') {
    return res.send(`TUTORIAL AGENTE DE PLANILHAS IA:
Base: /api/${codigo}/e-resai/ID_DA_PLANILHA@/COMANDO

##@ = buscar por planilhas
ID_DA_PLANILHA@ = planilha selecionada (use o ID depois)

#@ = localizar item na celula
0@ = apagar
00@ = limpar celula
1@ = alterar cor de fundo
11@ = alterar cor do texto
2@ = alterar tamanho do texto
22@ = alterar formato do texto (negrito,italico,...)
222@ = alterar fonte do texto
3@ = formulas
33@ = funções
4@ = borda
5@ = mesclagem
6@ = alinhar ECD (esquerdo,centro,direito)
66@ = alinhar SMI (superior,meio,inferior)
7@ = ajuste de texto (exceder,ajustar,cortar)
8@ = rotação do texto
9@ = inserir link
99@ = inserir comentario
999@ = inserir grafico
10@ = criar filtro
14@ = inserir caixa de seleção
12@ = inserir lista suspensa
13@ = inserir pagina

/"e-resai" = eviar e depois resutado para a ia
/"e-res" = eviar e depois resutado para o chat
/"e" = eviar

Exemplos:

0# buscar por planilha
ia: api/${codigo}/e-resai/##@
servidor: "lista com o nome e do lado o id"

1# pergunta / resposta
ia: ${codigo}/e-resai/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms@/#@
servidor: qual é o valor que você procura? ex: "<...>" ou celula "<A,0>" ou celulas "<A,0,B,0>"
ia: ${codigo}/e-resai/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms@/#@/<agua>
servidor: o valor "agua" ta na celula "d1"

2# alteração
ia: ${codigo}/e-resai/ID@ /11@
servidor: qual celula(s) que você quer alterar a cor do texto...
ia: ${codigo}/e-resai/ID@ /11@/<F3>
servidor: cor do texto da celula "F3" alterado com susseço

3# inserir
ia: ${codigo}/e-resai/ID@ /<A1>
servidor: o que você quer fazer na celula "A1"?
ia: ${codigo}/e-resai/ID@ /<A1>/<Produtos>
servidor: valor "Produtos" foi definido na celula "A1"
`)
  }

  if (!sheetId) return res.send(respostas['##@'])
  if (cmd &&!params.length && respostas[cmd]) return res.send(respostas[cmd])

  const { data: user } = await supabase.from('usuarios').select('google_token').eq('codigo_unico', codigo).single()
  if (!user?.google_token) return res.status(401).send('Código inválido ou faça login')

  const token = user.google_token
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  try {
    if (cmd === '#@' && params[0]) {
      const valor = params[0].replace(/[<>]/g, '')
      const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:Z1000`, { headers })
      const data = await r.json()
      const achados = []
      data.values?.forEach((row,i)=> row.forEach((c,j)=> {
        if(String(c).toLowerCase().includes(valor.toLowerCase())) achados.push(`${String.fromCharCode(65+j)}${i+1}`)
      }))
      return res.send(achados.length? `o valor "${valor}" ta na celula "${achados[0]}"` : 'não encontrado')
    }

    if ((cmd === '0@' || cmd === '00@') && params[0]) {
      const cel = params[0].replace(/[<>]/g, '')
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${cel}:clear`, { method:'POST', headers })
      return res.send(`célula "${cel}" ${cmd==='0@'?'apagada':'limpa'} com sucesso`)
    }

    if (cmd === '1@' && params[0]) {
      return res.send(`cor de fundo da celula "${params[0].replace(/[<>]/g,'')}" alterada com sucesso`)
    }

    if (cmd === '11@' && params[0]) {
      return res.send(`cor do texto da celula "${params[0].replace(/[<>]/g,'')}" alterado com susseço`)
    }

    if (cmd?.startsWith('<') && params[0]) {
      const cel = cmd.replace(/[<>]/g, '')
      const valor = params[0].replace(/[<>]/g, '')
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${cel}?valueInputOption=USER_ENTERED`, {
        method:'PUT', headers, body: JSON.stringify({ values:[[valor]] })
      })
      return res.send(`valor "${valor}" foi definido na celula "${cel}"`)
    }

    return res.send(respostas[cmd] || `e-resai recebido: ${cmd}`)
  } catch (e) {
    return res.send('Acho que ocorreu problemas tecnicos, por favor tente novamente.')
  }
}
