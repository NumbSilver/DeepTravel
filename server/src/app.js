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
      'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      {
        messages,
        model: 'deepseek-r1-250120',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer LLM_API_KEY`,
        },
      },
    );
    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({error: 'Failed to process request'});
  }
});

// 流式对话接口
app.post('/api/chat/stream', async (req, res) => {
  try {
    const {messages} = req.body;
    console.log('收到流式请求:', messages);

    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 发送连接确认消息
    const connectMessage = 'data: {"type":"connected"}\n\n';
    console.log('发送连接确认:', connectMessage);
    res.write(connectMessage);
    res.flush?.();

    console.log('开始流式响应');

    // 创建流式请求
    const response = await axios.post(
      'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      {
        messages,
        model: 'deepseek-r1-250120',
        stream: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer LLM_API_KEY`,
        },
        responseType: 'stream',
      },
    );

    // 处理流式响应
    response.data.on('data', chunk => {
      const chunkStr = chunk.toString();
      // console.log('收到原始数据:', chunkStr);

      // 处理 SSE 格式的数据
      const lines = chunkStr.split('\n');
      lines.forEach(line => {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6); // 移除 'data: ' 前缀

          // 处理 [DONE] 标记
          if (jsonStr === '[DONE]') {
            console.log('收到结束标记');
            const doneMessage = 'data: [DONE]\n\n';
            console.log('发送结束标记:', doneMessage);
            res.write(doneMessage);
            res.flush?.();
            return;
          }

          try {
            const data = JSON.parse(jsonStr);
            // console.log('解析后的数据:', JSON.stringify(data, null, 2));

            // 提取实际内容
            if (data.choices && data.choices[0].delta) {
              const delta = data.choices[0].delta;
              const content = delta.content || '';
              const reasoning = delta.reasoning_content || '';

              // 如果有内容，则立即发送给客户端
              if (content || reasoning) {
                const responseData = {
                  content,
                  reasoning,
                };
                // console.log(
                //   '发送给客户端的数据:',
                //   JSON.stringify(responseData, null, 2),
                // );
                const sseData = `data: ${JSON.stringify(responseData)}\n\n`;
                // console.log('发送 SSE 数据:', sseData);
                res.write(sseData);
                res.flush?.();
              }
            }
          } catch (error) {
            console.error('解析数据块错误:', error, '原始数据:', jsonStr);
          }
        }
      });
    });

    response.data.on('end', () => {
      console.log('流式响应结束');
      res.end();
    });

    response.data.on('error', error => {
      console.error('流式响应错误:', error);
      res.status(500).end();
    });
  } catch (error) {
    console.error('Stream Error:', error);
    res.status(500).end();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
