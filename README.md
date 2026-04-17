# POLARIS IRT Core

POLARIS 是一个基于 IRT + CAT 的大语言模型自适应评测平台原型仓库，当前已经包含：

- 根目录下的 Next.js 14 前端站点
- `backend/` 下的 FastAPI 后端 MVP
- 排行榜、模型详情、提交评测、Dashboard、Compare、Question Hub、Developers、Methodology 等页面
- 与前端页面结构对应的后端接口、任务进度模拟和 WebSocket 推送

## 目录结构

- `app/`：Next.js App Router 页面
- `components/`：前端共享组件与图表
- `lib/`：前端静态数据与工具函数
- `backend/app/`：FastAPI API、仓储层、IRT 相关逻辑
- `backend/requirements.txt`：后端 Python 依赖

## 运行方法

### 1. 启动前端

在仓库根目录执行：

```bash
npm install
npm run dev
```

默认地址：

```text
http://localhost:3000
```

前端默认请求的后端地址：

```text
http://127.0.0.1:8000/api
```

如果后端不是这个地址，可以在前端启动前设置环境变量：

```bash
$env:NEXT_PUBLIC_POLARIS_API_BASE_URL="http://localhost:8000/api"
```

前端生产构建：

```bash
npm run build
npm run start
```

### 2. 启动后端

在仓库根目录进入 `backend` 目录：

```bash
cd backend
python -m venv .venv
```

Windows PowerShell 激活虚拟环境：

```bash
.\.venv\Scripts\Activate.ps1
```

安装依赖：

```bash
python -m pip install -r requirements.txt
```

启动 FastAPI 开发服务：

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端文档与健康检查：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health: `http://localhost:8000/api/health`

## 当前已实现的后端接口

### 排行榜与模型

- `GET /api/leaderboard`
- `GET /api/leaderboard/models/{model_id}`

支持按 `domain`、`scale`、`openness`、`time_range` 传参筛选。

### 提交与任务

- `POST /api/submissions`
- `GET /api/submissions`
- `GET /api/submissions/{submission_id}`
- `POST /api/submissions/{submission_id}/cancel`
- `POST /api/submissions/test-connection`

### Dashboard

- `GET /api/dashboard`
- `GET /api/dashboard/active`
- `GET /api/dashboard/submissions/{submission_id}`
- `GET /api/dashboard/history`

### 其他页面配套接口

- `GET /api/compare`
- `GET /api/question-hub/summary`
- `GET /api/developers/overview`

### WebSocket

- `WS /api/ws/leaderboard`
- `WS /api/ws/submissions/{submission_id}`

后端会模拟提交任务从排队、预检、CAT 测试到发布完成的全过程，并在任务更新或排行榜变化时推送事件。

## 联调说明

- 前端当前仍然使用静态示例数据渲染页面。
- 后端现在已经具备可联调的接口形态，但还没有把前端页面改成真实请求这些接口。
- 后端数据层目前是内存仓储，适合原型演示和页面联调，不适合持久化生产使用。

## 已完成的验证

- 前端已通过 `npm run build`
- 后端已用 FastAPI `TestClient` 验证以下接口可返回 200：
  - `/api/health`
  - `/api/leaderboard`
  - `/api/dashboard`
  - `/api/question-hub/summary`
  - `/api/developers/overview`
  - `/api/submissions`

## 后续建议

- 把前端页面切换为真实请求 FastAPI
- 用 PostgreSQL / Redis 替换内存仓储
- 加入 Celery 或其他任务队列处理真实长任务
- 接入真实 API 预检、评分、报告生成和排行榜增量更新
