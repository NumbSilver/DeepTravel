# DeepTravel - AI校园生活助手

DeepTravel是一个基于React Native开发的AI校园生活助手应用，旨在为大学生提供智能化的校园生活服务。

## 功能特点

- 🤖 AI智能助手：提供智能对话和校园生活咨询服务
- 📝 情绪日记：记录每日心情，追踪情绪变化
- 👥 社区广场：校园社交互动平台
- 👤 个人中心：用户信息管理

## 技术栈

### 客户端
- React Native
- TypeScript
- React Navigation
- OpenAI API
- Zustand (状态管理)

### 服务端
- Node.js
- Express
- OpenRouter API
- Axios

## 环境要求

- Node.js >= 18.0.0
- npm >= 6.0.0 或 yarn >= 1.22.0
- iOS: Xcode >= 12.0
- Android: Android Studio >= 4.0

## 安装步骤

1. 克隆项目
```bash
git clone https://github.com/NumbSilver/DeepTravel.git
cd DeepTravel
```

2. 安装客户端依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

3. 安装服务端依赖
```bash
cd server
npm install
```

4. 配置环境变量
```bash
# 在 server 目录下创建 .env 文件
cp .env.example .env
# 编辑 .env 文件，填入你的 OpenRouter API Key
```

5. iOS 额外步骤
```bash
cd ios
pod install
cd ..
```

## 运行项目

### 启动服务端
```bash
cd server
npm run dev
```

### 启动客户端
```bash
# 启动 Metro 服务
pnpm start
```

### iOS
```bash
# 启动 iOS 模拟器
npm run ios
# 或
yarn ios
# 或
pnpm ios
```

### Android
```bash
# 启动 Android 模拟器
npm run android
# 或
yarn android
# 或
pnpm android
```

## API 使用示例

### 非流式对话
```javascript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: '你好，请介绍一下自己' }
    ]
  })
});
const data = await response.json();
```

### 流式对话
```javascript
const response = await fetch('http://localhost:3000/api/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: '你好，请介绍一下自己' }
    ]
  })
});

const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // 处理流式数据
  console.log(new TextDecoder().decode(value));
}
```

## 项目结构

```
DeepTravel/
├── src/                # 客户端源码
│   ├── components/     # 可复用组件
│   ├── navigation/     # 导航配置
│   ├── screens/        # 页面组件
│   ├── services/       # API 服务
│   ├── store/         # 状态管理
│   └── types/         # TypeScript 类型定义
├── server/            # 服务端源码
│   ├── src/           # 服务端代码
│   └── .env          # 环境配置
├── ios/               # iOS 原生代码
└── android/           # Android 原生代码
```

## 开发指南

1. 确保已安装所有必要的开发工具
2. 遵循项目的代码规范和提交规范
3. 在开发新功能时，请创建新的分支
4. 提交代码前进行测试

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请通过以下方式联系我们：
- 提交 Issue
- 发送邮件至：[您的邮箱]

## 致谢

感谢所有为这个项目做出贡献的开发者！
