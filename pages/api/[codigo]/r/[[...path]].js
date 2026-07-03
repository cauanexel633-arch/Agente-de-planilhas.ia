export default function handler(req, res) {
  // redireciona recebendo informações
  res.setHeader('Content-Type','text/plain')
  res.send('r - dados recebidos pelo servidor')
}
