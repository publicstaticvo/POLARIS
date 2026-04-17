# POLARIS IRT Core Site

基于设计文档实现的 Next.js 14 网站原型，包含：

- 首页
- 排行榜
- 模型详情页
- 提交评测
- 评测进度 Dashboard
- 能力对比
- 题库贡献页
- Developers 文档入口
- About / Methodology

## 本地启动

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:3000
```

## 生产构建

```bash
npm run build
npm run start
```

## 说明

- 当前内容使用静态示例数据，便于先把信息架构、视觉层次与关键交互落地。
- 图表采用原生 SVG/CSS 实现，避免在原型阶段额外引入图表依赖。
- 依赖安装后已通过一次 `npm run build` 验证。
