const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs/promises')

const root = path.resolve(__dirname, '../dist')
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
}

const server = http.createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname
    const requestedPath = path.resolve(root, `.${pathname}`)
    if (!requestedPath.startsWith(root + path.sep) && requestedPath !== root) {
      response.writeHead(403).end()
      return
    }

    let filePath = requestedPath
    try {
      const stats = await fs.stat(filePath)
      if (stats.isDirectory()) filePath = path.join(filePath, 'index.html')
    } catch {
      filePath = path.join(root, 'index.html')
    }
    const content = await fs.readFile(filePath)
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    })
    response.end(content)
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end()
  }
})

server.listen(5173, '127.0.0.1')
