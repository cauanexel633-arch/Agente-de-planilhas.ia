export function generateUniqueCode(name) {
  const clean = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '')
  const base = (clean || 'User').substring(0, 10)
  const suffix = Math.floor(100000 + Math.random() * 900000).toString()
  return base + suffix
}
