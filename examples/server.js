import express from 'express';
import expressWsInit from 'express-ws';
import path from 'node:path';
import axios from 'axios';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  base64UrlEncodeJSON,
  payloadWithExpiration,
  generateSignature
} from './jwt.js';

import playlist from './playlist.js';
import profiles from './profiles.js';

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express and express-ws
const expressApp = express();
const expressWs = expressWsInit(expressApp);
const app = expressWs.app;
const port = 4200;

const aWss = expressWs.getWss('/');

// Middleware
app.use(express.static(join(__dirname, 'static')));
app.use(express.json({ limit: '5mb' }));

// Routes
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'static', 'html', 'index.html'));
});

app.get('/echo', (req, res) => {
  const responseData = {
    method: 'GET',
    headers: req.headers,
    query: req.query
  };
  res.json(responseData);
});

app.post('/echo', (req, res) => {
  res.status(200).json(req.body);
});

app.get('/playlist', (req, res) => {
  setTimeout(() => {
    return res.json(playlist);
  }, 600);
});

app.get('/profile', (req, res) => {
  setTimeout(() => {
    const name = req.query.name;
    if (profiles[name]) {
      return res.status(200).json(profiles[name]);
    }
    return res.status(404).json({ message: 'Profile Not Found' });
  }, 600);
});

app.post('/github', async (req, res) => {
  const code = req.body.code;
  const clientId = '9740bb12713949b1c23d';
  const clientSecret = '300c8427a2562a2851e4dc7dbc1e3a7b50328c8c';
  const urlToGetAccessToken = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

  try {
    const responeWithAccessToken = await axios.post(urlToGetAccessToken, null, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const jsonFromResponeFromGitHub = responeWithAccessToken.data;
    const accessToken = jsonFromResponeFromGitHub['access_token'];
    const urlToGetAccount = `https://api.github.com/user?access_token=${accessToken}`;

    const responeWithAccount = await axios.get(urlToGetAccount, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'node.js'
      }
    });

    const account = responeWithAccount.data;
    const payload = account;
    const minutesFromNow = 15;
    const jwtSecret = 'SOME SECRET';

    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeaderInBase64 = base64UrlEncodeJSON(header);
    const encodedPayloadInBase64 = base64UrlEncodeJSON(
      payloadWithExpiration(payload, minutesFromNow)
    );
    const encodedSignatureInBase64 = generateSignature(
      `${encodedHeaderInBase64}.${encodedPayloadInBase64}`,
      jwtSecret
    );
    const jwt = `${encodedHeaderInBase64}.${encodedPayloadInBase64}.${encodedSignatureInBase64}`;
    res.status(200).json({ jwt });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'OAuth failed' });
  }
});

// WebSocket handler
app.ws('/', (ws, req) => {
  ws.onmessage = (msg) => {
    aWss.clients.forEach((client) => {
      if (client !== ws) {
        client.send(msg.data);
      }
    });
  };
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
