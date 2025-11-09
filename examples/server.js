import express from 'express'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

import {
  base64UrlEncodeJSON,
  payloadWithExpiration,
  generateSignature
} from './jwt.js'

import playlist from './playlist.js'
import profiles from './profiles.js'

const app = express()
const port = 4200

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'static')))
app.use(express.json({ limit: '5mb' }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'html', 'index.html'))
})

app.get('/echo', (req, res) => {
  const responseData = {
    method: 'GET',
    headers: req.headers,
    query: req.query,
  }
  return res.json(responseData)
})

app.post('/echo', (req, res) => {
  return res.status(200).json(req.body);
})

app.get('/playlist', (req, res) => {
  setTimeout(function() {
    return res.json(playlist)
  }, 600)
})

app.get('/profile', (req, res) => {
  setTimeout(function() {
    const name = req.query.name
    if (profiles[name]) {
      return res.status(200).json(profiles[name])
    }
    return res.status(404).json({ message: 'Profile Not Found' })
  }, 600)
})

app.post('/github', (req, res) => {
  const code = req.body.code
  const clientId = '9740bb12713949b1c23d'
  const clientSecret = '300c8427a2562a2851e4dc7dbc1e3a7b50328c8c'
  const urlToGetAccessToken = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`
  axios({
    url: urlToGetAccessToken,
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  }).then((responeWithAccessToken) => {
    const jsonFromResponeFromGitHub = responeWithAccessToken.data
    const accessToken = jsonFromResponeFromGitHub['access_token']
    const urlToGetAccount = `https://api.github.com/user?access_token=${accessToken}`
    axios({
      url: urlToGetAccount,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'node.js'
      }
    }).then((responeWithAccount) => {
      const account = responeWithAccount.data
      const payload = account
      const minutesFromNow = 15
      const jwtSecret = 'SOME SECRET'
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      }
      const encodedHeaderInBase64 = this.base64UrlEncodeJSON(header)
      const encodedPayloadInBase64 = this.base64UrlEncodeJSON(
        this.payloadWithExpiration(payload, minutesFromNow)
      )
      const encodedSignatureInBase64 = this.generateSignature(
        `${encodedHeaderInBase64}.${encodedPayloadInBase64}`, jwtSecret
      )
      const jwt = `${encodedHeaderInBase64}.${encodedPayloadInBase64}.${encodedSignatureInBase64}`
      res.status(200).json({ jwt })
    })
  })
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
