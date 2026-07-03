export function generateUniqueCode(name) {
  const clean = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z]/g, '')
  const base = (clean.split(' ')[0] || 'User').substring(0, 12)
  const chars = '0123456789!@#$%&'
  let suffix = ''
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return base + suffix
}
