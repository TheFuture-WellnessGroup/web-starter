# Web Starter

Next.js 16 + React 19 스타터 템플릿

## Tech Stack

- **Framework**: Next.js 16, React 19
- **Database**: PostgreSQL + Drizzle ORM
- **API**: tRPC (Server Actions 방식)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Linting/Formatting**: Biome

## Getting Started

### 패키지 매니저별 설치

| 패키지 매니저 | 설치 | 개발 서버 |
|--------------|------|----------|
| npm | `npm install` | `npm run dev` |
| yarn | `yarn` | `yarn dev` |
| pnpm | `pnpm install` | `pnpm dev` |
| bun | `bun install` | `bun run dev` |

### 1. 환경변수 설정

```bash
cp .env.example .env.local
```

### 2. PostgreSQL 실행

```bash
npm run docker:dev
```

### 3. DB 스키마 동기화

```bash
npm run db:push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

## Scripts

| Command | Description |
|---------|-------------|
| `dev` | 개발 서버 실행 |
| `build` | 프로덕션 빌드 |
| `lint` | Biome 린트 |
| `format` | Biome 포맷 |
| `db:generate` | Drizzle 마이그레이션 생성 |
| `db:migrate` | 마이그레이션 실행 |
| `db:push` | 스키마 동기화 (개발용) |
| `db:studio` | Drizzle Studio 실행 |
| `docker:dev` | 개발용 DB 컨테이너 실행 |
| `docker:down` | DB 컨테이너 중지 |
| `docker:build` | 프로덕션 이미지 빌드 |
| `docker:up` | 프로덕션 컨테이너 실행 |

## Project Structure

```
├── app/                  # Next.js App Router
│   └── api/trpc/         # tRPC HTTP 핸들러
├── components/           # React 컴포넌트
│   ├── providers/        # Context Providers
│   └── ui/               # shadcn/ui 컴포넌트
├── db/                   # Drizzle ORM
│   └── schema/           # DB 스키마 정의
├── server/api/           # tRPC 서버
│   └── routers/          # API 라우터
├── lib/                  # 유틸리티
│   └── trpc/             # tRPC 클라이언트/서버
└── docker/               # Docker 설정
```

## tRPC 사용법

### Server Component

```typescript
import { api } from "@/lib/trpc/server";

export default async function Page() {
  const caller = await api();
  const users = await caller.user.list();
  return <div>{/* ... */}</div>;
}
```

### Client Component

```typescript
"use client";
import { trpc } from "@/lib/trpc/client";

export function UserList() {
  const { data } = trpc.user.list.useQuery();
  return <div>{/* ... */}</div>;
}
```
