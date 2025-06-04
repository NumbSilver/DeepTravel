import {Message} from '../store/chatStore';

// 添加必要的类型定义
declare global {
  interface Response {
    body: ReadableStream<Uint8Array> | null;
  }

  interface ReadableStream<R> {
    getReader(): ReadableStreamDefaultReader<R>;
  }

  interface ReadableStreamDefaultReader<R> {
    read(): Promise<ReadableStreamReadResult<R>>;
    releaseLock(): void;
  }

  interface ReadableStreamReadResult<R> {
    done: boolean;
    value: R;
  }

  class TextDecoder {
    constructor(label?: string, options?: TextDecoderOptions);
    decode(input?: BufferSource, options?: TextDecodeOptions): string;
  }
}

const API_BASE_URL = 'http://localhost:3000/api';

export const chatService = {
  // 非流式对话
  async sendMessage(messages: Message[]): Promise<Message> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return {
        id: Date.now().toString(),
        text: data.content,
        isUser: false,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // 流式对话
  async sendMessageStream(
    messages: Message[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void,
  ) {
    try {
      console.log('开始发送流式请求');
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text,
          })),
        }),
      });

      console.log('收到响应:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 检查响应类型
      const contentType = response.headers.get('content-type');
      console.log('响应类型:', contentType);

      if (!contentType?.includes('text/event-stream')) {
        throw new Error(`Expected text/event-stream but got ${contentType}`);
      }

      // 使用 response.text() 处理流式响应
      const text = await response.text();
      console.log('收到完整响应:', text);

      // 处理 SSE 消息
      const lines = text.split('\n');
      let isConnected = false;

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          console.log('处理数据行:', jsonStr);

          // 处理连接确认消息
          if (!isConnected) {
            try {
              const data = JSON.parse(jsonStr);
              if (data.type === 'connected') {
                console.log('SSE 连接已建立');
                isConnected = true;
                continue;
              }
            } catch (error) {
              console.error('解析连接消息错误:', error);
            }
          }

          if (jsonStr === '[DONE]') {
            console.log('收到结束标记');
            continue;
          }

          try {
            const data = JSON.parse(jsonStr);
            if (data.content) {
              console.log('收到内容:', data.content);
              onChunk(data.content);
            }
            if (data.reasoning) {
              console.log('收到推理:', data.reasoning);
            }
          } catch (error) {
            console.error('解析数据错误:', error, '原始数据:', jsonStr);
          }
        }
      }

      console.log('流式响应完成');
      onComplete();
    } catch (error) {
      console.error('流式请求错误:', error);
      onError(error as Error);
    }
  },
};
