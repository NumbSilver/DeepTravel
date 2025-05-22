const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// OpenRouter 配置
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME || 'google/gemma-7b-it:free';

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({status: 'ok', timestamp: new Date().toISOString()});
});

// 非流式对话接口
app.post('/api/chat', async (req, res) => {
  try {
    const {messages} = req.body;
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL_NAME,
        messages,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'DeepTravel AI',
        },
      },
    );
    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error(
      'OpenRouter API Error:',
      error.response?.data || error.message,
    );
    res.status(500).json({error: 'Failed to process request'});
  }
});

// 流式对话接口
app.post('/api/chat/stream', async (req, res) => {
  try {
    const {messages} = req.body;
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL_NAME,
        messages,
        stream: true,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'DeepTravel AI',
        },
        responseType: 'stream',
      },
    );

    res.setHeader('Content-Type', 'text/event-stream');
    response.data.on('data', chunk => {
      res.write(chunk);
    });

    response.data.on('end', () => {
      res.end();
    });
  } catch (error) {
    console.error('Stream Error:', error);
    res.status(500).end();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
