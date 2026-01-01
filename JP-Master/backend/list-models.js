import dotenv from 'dotenv'
dotenv.config()

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('Thiếu GEMINI_API_KEY trong .env')
    process.exit(1)
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
  const resp = await fetch(url)
  if (!resp.ok) {
    console.error('Request failed', resp.status, resp.statusText)
    const text = await resp.text()
    console.error(text)
    process.exit(1)
  }
  const data = await resp.json()
  console.log('Available models:')
  ;(data.models || []).forEach(m => console.log('-', m.name))
}

main().catch(err => console.error(err))