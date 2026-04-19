import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import https from 'https';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

let accessToken = null;
let expiresAt = 0;

function httpsRequest(url, { method = 'GET', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method,
        headers,
        agent: httpsAgent,
      },
      (response) => {
        let rawData = '';

        response.on('data', (chunk) => {
          rawData += chunk;
        });

        response.on('end', () => {
          resolve({
            status: response.statusCode ?? 0,
            body: rawData,
          });
        });
      }
    );

    request.on('error', (error) => {
      reject(error);
    });

    if (body) {
      request.write(body);
    }

    request.end();
  });
}

async function getToken() {
  if (accessToken && Date.now() < expiresAt) {
    return accessToken;
  }

  const formBody = new URLSearchParams({
    scope: process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS',
  }).toString();

  const response = await httpsRequest(
    'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        RqUID: randomUUID(),
        Authorization: `Basic ${process.env.GIGACHAT_AUTH_KEY}`,
        'Content-Length': Buffer.byteLength(formBody),
      },
      body: formBody,
    }
  );

  console.log('OAUTH STATUS:', response.status);
  console.log('OAUTH BODY:', response.body);

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`OAuth failed: ${response.status} ${response.body}`);
  }

  const data = JSON.parse(response.body);

  accessToken = data.access_token;
  expiresAt = Date.now() + 25 * 60 * 1000;

  return accessToken;
}

app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      model = 'GigaChat',
      temperature = 1,
      top_p = 0.8,
      max_tokens = 2048,
      repetition_penalty = 1,
    } = req.body;

    console.log('REQUEST BODY:', req.body);

    const token = await getToken();

    const requestBody = JSON.stringify({
      model,
      messages,
      temperature,
      top_p,
      max_tokens,
      repetition_penalty,
      stream: false,
    });

    const response = await httpsRequest(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Length': Buffer.byteLength(requestBody),
        },
        body: requestBody,
      }
    );

    console.log('CHAT STATUS:', response.status);
    console.log('CHAT BODY:', response.body);

    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json({
        error: `Chat failed: ${response.status}`,
        details: response.body,
      });
    }

    const data = JSON.parse(response.body);
    res.json(data);
  } catch (e) {
    console.error('SERVER ERROR:', e);
    res.status(500).json({
      error: e.message || 'Ошибка GigaChat',
    });
  }
});

app.post('/api/chat/stream', async (req, res) => {
  try {
    const {
      messages,
      model = 'GigaChat',
      temperature = 1,
      top_p = 0.8,
      max_tokens = 2048,
      repetition_penalty = 1,
    } = req.body;

    console.log('STREAM REQUEST BODY:', req.body);

    const token = await getToken();

    const requestBody = JSON.stringify({
      model,
      messages,
      temperature,
      top_p,
      max_tokens,
      repetition_penalty,
      stream: true,
    });

    const request = https.request(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          Authorization: `Bearer ${token}`,
          'Content-Length': Buffer.byteLength(requestBody),
        },
        agent: httpsAgent,
      },
      (response) => {
        if ((response.statusCode ?? 500) < 200 || (response.statusCode ?? 500) >= 300) {
          let errorBody = '';

          response.on('data', (chunk) => {
            errorBody += chunk.toString();
          });

          response.on('end', () => {
            res.status(response.statusCode ?? 500).json({
              error: `Chat stream failed: ${response.statusCode}`,
              details: errorBody,
            });
          });

          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        });

        response.on('data', (chunk) => {
          res.write(chunk);
        });

        response.on('end', () => {
          res.end();
        });

        response.on('error', (error) => {
          console.error('UPSTREAM STREAM ERROR:', error);
          res.end();
        });

        req.on('close', () => {
          request.destroy();
        });
      }
    );

    request.on('error', (error) => {
      console.error('STREAM REQUEST ERROR:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: error.message || 'Ошибка потокового запроса',
        });
      } else {
        res.end();
      }
    });

    request.write(requestBody);
    request.end();
  } catch (e) {
    console.error('SERVER STREAM ERROR:', e);
    if (!res.headersSent) {
      res.status(500).json({
        error: e.message || 'Ошибка GigaChat stream',
      });
    } else {
      res.end();
    }
  }
});

app.get('/api/models', async (req, res) => {
  try {
    const token = await getToken();

    const response = await httpsRequest(
      'https://gigachat.devices.sberbank.ru/api/v1/models',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('MODELS STATUS:', response.status);
    console.log('MODELS BODY:', response.body);

    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json({
        error: `Models fetch failed: ${response.status}`,
        details: response.body,
      });
    }

    const data = JSON.parse(response.body);
    res.json(data);
  } catch (e) {
    console.error('MODELS ERROR:', e);
    res.status(500).json({
      error: e.message || 'Ошибка получения списка моделей',
    });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});