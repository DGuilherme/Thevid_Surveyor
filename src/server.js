import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import { scanAllProjects } from './projectScanner.js'

const app = express()
const PORT = 3000
const PROJECTS_ROOT = 'E:\\projects'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname, '../public')))

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await scanAllProjects(PROJECTS_ROOT)
    res.json({ projects, scannedAt: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Surveyor running → http://localhost:${PORT}`)
})
