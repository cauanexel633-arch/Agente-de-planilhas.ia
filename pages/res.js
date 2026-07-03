export default function handler(req, res) {
  res.setHeader('Content-Type','text/plain')
  res.status(200).send('OK - use /e-res ou /e-resai/')
}
