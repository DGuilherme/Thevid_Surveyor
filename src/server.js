import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import { scanAllProjects } from './projectScanner.js'

const app = express()
const PORT = 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// PROJECTS_ROOT env var, else the folder containing this repo (projects are siblings)
const PROJECTS_ROOT = process.env.PROJECTS_ROOT
  ? path.resolve(process.env.PROJECTS_ROOT)
  : path.resolve(__dirname, '../..')

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
  console.log(`Scanning projects in ${PROJECTS_ROOT}`)
})
