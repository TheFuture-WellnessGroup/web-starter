# Version Update + Better Auth Integration Design

## Overview

web-starter 프로젝트의 전체 의존성을 최신 버전으로 업데이트하고, Better Auth를 기반 인증 시스템으로 통합한다.

## 1. Version Updates

| Package | Current | Target |
|---------|---------|--------|
| next | 16.1.4 | 16.1.6 |
| react / react-dom | 19.2.3 | 19.2.4 |
| @trpc/* | 11.8.1 | 11.10.0 |
| @biomejs/biome | 2.2.0 | 2.4.4 |
| 기타 | 현재 | npm update로 최신 호환 버전 |

Breaking change 없는 범위의 업데이트.

## 2. Better Auth Integration

### 아키텍처

DDD 구조에 맞춰 `domain/auth/` 도메인을 추가.

```
domain/auth/
├── auth.ts              # Better Auth 서버 인스턴스 설정
├── auth-client.ts       # Better Auth 클라이언트 인스턴스
├── router.ts            # tRPC auth 라우터
├── ui/                  # 추후 인증 UI 컴포넌트용
├── hooks/               # 추후 useSession 등 hooks용
└── index.ts             # Public API

app/api/auth/[...all]/
└── route.ts             # Better Auth HTTP handler
```

### 설정

- **DB 어댑터**: Drizzle 어댑터 사용, 기존 DB 연결 재활용
- **환경변수**: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`을 `lib/env.ts`에 추가
- **인증 방식**: `emailAndPassword: { enabled: true }` 기본 활성화
- **스키마**: Better Auth CLI로 생성 → `db/schema/auth.ts`

### tRPC 통합

- `server/api/trpc.ts`에 `protectedProcedure` 추가
- Better Auth 세션 검증을 미들웨어로 구현
- 기존 `publicProcedure`는 그대로 유지

### 데이터 흐름

```
인증 요청:
  Client → /api/auth/[...all] → Better Auth → Drizzle → PostgreSQL

보호된 API:
  Client → tRPC (protectedProcedure) → 세션 검증 → 비즈니스 로직
```

### CLAUDE.md 업데이트

- 루트 CLAUDE.md: auth 도메인, protectedProcedure 사용법
- domain/CLAUDE.md: domain/auth/ 설명
- server/CLAUDE.md: protectedProcedure 패턴
- db/CLAUDE.md: auth 스키마 설명
