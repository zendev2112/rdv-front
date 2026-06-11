import https from 'https'

// Node's global fetch (undici) cannot establish a connection to the
// worldcup26.ir origin — it hangs until aborted — while the https module
// connects fine. All Mundial upstream calls go through here. Server-only:
// never import this from a client component.
export function upstreamGet<T = any>(url: string, timeoutMs = 9000): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { Accept: 'application/json', 'User-Agent': 'rdv-mundial/1.0' } },
      (res) => {
        const status = res.statusCode ?? 0
        if (status >= 400) {
          res.resume()
          reject(new Error(`HTTP ${status}`))
          return
        }
        let data = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            resolve(JSON.parse(data) as T)
          } catch {
            reject(new Error('Invalid JSON from upstream'))
          }
        })
      },
    )
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')))
    req.on('error', reject)
  })
}
