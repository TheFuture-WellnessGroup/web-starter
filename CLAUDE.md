# Web Starter

Next.js 16 + React 19 스타터 템플릿

## Development Commands

```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # Biome 린트 검사
npm run format       # Biome 포맷팅 적용

# Database (Drizzle ORM)
npm run db:push      # 스키마를 DB에 직접 푸시 (개발용)
npm run db:studio    # Drizzle Studio 실행
npm run docker:dev   # PostgreSQL 컨테이너 실행
```

## Architecture

**Tech Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + tRPC v11

**Core Principles**:
- RSC (React Server Components) 기본 사용
- Linting/Formatting: **Biome**

**React Patterns**:
- **`app/**/page.tsx`에서 `"use client"` 사용 금지** - 클라이언트 로직은 별도 컴포넌트로 분리
- **클라이언트 컴포넌트는 최소 크기로 유지** - 인터랙션이 필요한 부분만 `"use client"`로 분리
- **Suspense + Skeleton으로 로딩 처리, ErrorBoundary로 에러 처리**

**데이터 흐름 (Data Flow)**:
```
Frontend (React) → tRPC Client → tRPC Server → Database (Drizzle)
```
- 데이터베이스 조회는 **반드시 tRPC 서버 또는 Server Actions에서만** 수행
- 프론트엔드에서 직접 DB 접근 금지
- `db/` 모듈은 서버 코드 내부에서만 import

## Project Structure (DDD)

```
app/                          # Next.js App Router (라우팅만 담당)
├── (dashboard)/              # 대시보드 그룹
│   ├── layout.tsx
│   ├── users/
│   │   └── page.tsx
│   └── ...
├── api/trpc/                 # tRPC HTTP handler
└── layout.tsx

domain/                       # 도메인 레이어 (Bounded Context)
├── user/                     # ──────── 사용자 도메인 ────────
│   ├── models/               # 도메인 모델, 타입, Zod 스키마
│   │   ├── User.ts
│   │   └── index.ts
│   ├── actions/              # Server Actions
│   │   ├── server/           # 'use server' (DB 저장, 외부 API)
│   │   └── client/           # 클라이언트 로직 (폼 검증, 계산)
│   ├── queries/              # 데이터 조회 함수
│   ├── router.ts             # tRPC 라우터
│   ├── repository.ts         # DB 접근 계층
│   ├── ui/                   # 도메인 UI 컴포넌트
│   ├── hooks/                # 도메인 Hooks
│   └── index.ts              # Public API
│
└── shared/                   # 도메인 공통
    ├── lib/                  # 공통 유틸리티
    └── ui/                   # 공통 UI (shadcn/ui wrapper)

components/ui/                # shadcn/ui 컴포넌트 (원본)
server/api/                   # tRPC 설정
├── trpc.ts                   # context, procedures
└── root.ts                   # 루트 라우터 (도메인 라우터 등록)

db/                           # Drizzle ORM
└── schema/                   # 테이블 스키마

lib/                          # 인프라 유틸리티
├── env.ts                    # 환경변수 검증
├── utils.ts                  # cn() 등 유틸리티
└── trpc/                     # tRPC 클라이언트
```

**폴더별 상세 지침**: 각 폴더의 `CLAUDE.md` 참조
- [domain/](./domain/CLAUDE.md) - 도메인 레이어
- [app/](./app/CLAUDE.md) - Next.js 페이지
- [components/](./components/CLAUDE.md) - UI 컴포넌트
- [db/](./db/CLAUDE.md) - 데이터베이스
- [server/](./server/CLAUDE.md) - tRPC 서버
- [lib/](./lib/CLAUDE.md) - 유틸리티

## Domain Layer 상세

각 도메인 폴더의 구조와 역할:

| 폴더 | 역할 | 예시 |
|------|------|------|
| `models/` | 도메인 모델, 타입, Zod 스키마 | `User.ts`, `UserSchema.ts` |
| `actions/server/` | Server Actions (DB 저장, 외부 API) | `createUser.ts` |
| `actions/client/` | 클라이언트 로직 (폼 검증, 계산) | `validateUserForm.ts` |
| `queries/` | 데이터 조회 함수 | `getUserById.ts` |
| `router.ts` | tRPC 라우터 정의 | `userRouter` |
| `repository.ts` | DB 접근 계층 | `userRepository` |
| `ui/` | 도메인 전용 UI 컴포넌트 | `UserList/`, `UserForm/` |
| `hooks/` | 도메인 전용 React Hooks | `useUsers.ts` |
| `index.ts` | Public API (외부 노출 항목) | exports |

**의존성 규칙**:
```
app/ (pages)
    ↓
domain/*/ui  ←  domain/*/hooks
    ↓              ↓
domain/*/actions, queries
    ↓
domain/*/repository  ←  domain/*/models
    ↓
db/, server/api/
```

- 도메인 간 직접 import 금지 (필요시 `domain/shared/` 사용)
- `domain/*/models/`는 외부 의존성 없이 순수하게 유지

## Code Conventions

**tRPC & Database**:
- tRPC 라우터: `domain/*/router.ts`에 정의 후 `server/api/root.ts`에 등록
- DB 스키마: `db/schema/`에 추가 후 `index.ts`에서 re-export
- 환경변수: `lib/env.ts`에서 zod로 검증
- Server Component에서 tRPC: `const caller = await api();`
- Client Component에서 tRPC: `trpc.router.procedure.useQuery()`

**Styling**:
- class-variance-authority (CVA)로 컴포넌트 variants 정의
- Tailwind CSS 클래스 조합시 `cn()` 유틸리티 사용
- 색상은 CSS 변수 기반 시스템 (`--primary`, `--secondary` 등)

**Import Aliases**:
- `@/*` → 프로젝트 루트
- `@/domain/*` → 도메인 코드
- `@/components/*` → 공통 컴포넌트

**네이밍 컨벤션**:

| 유형 | 패턴 | 예시 |
|------|------|------|
| 도메인 모델 | PascalCase | `User.ts`, `Order.ts` |
| Server Action | camelCase | `createUser.ts` |
| Query | camelCase | `getUserById.ts` |
| Repository | 단수 | `repository.ts` |
| tRPC Router | camelCase + Router | `userRouter` |
| Component | PascalCase 폴더 | `UserList/UserList.tsx` |
| Hook | use + PascalCase | `useUsers.ts` |

## Testing Changes

```bash
npx tsc --noEmit    # 타입 체크
npm run lint         # 린트
npm run build        # 빌드 검증
```

## Agent Instructions

**UI 컴포넌트 작성 전**: shadcn/ui에서 제공하는 컴포넌트가 있는지 먼저 확인. 직접 UI 컴포넌트를 만들기 전에 `components/ui/`에 있는 기존 컴포넌트 또는 shadcn/ui 추가 가능 여부 검토.

**React/Next.js 코드 작성 시**: `/vercel-react-best-practices` 스킬을 사용하여 성능 최적화 가이드라인을 참조할 것. 특히 다음 상황에서 활용:
- 새로운 React 컴포넌트 또는 Next.js 페이지 작성
- 데이터 페칭 구현 (클라이언트/서버)
- 코드 리뷰 및 성능 이슈 검토
- 기존 코드 리팩토링

**도메인 코드 작성 시**:
- 새 도메인 추가: `domain/<domain-name>/` 폴더 생성 후 구조에 맞게 파일 배치
- tRPC 라우터 등록: `server/api/root.ts`에 import 후 등록
- 도메인 간 의존성 최소화, 필요시 `domain/shared/` 활용

**지침 업데이트 필수**: 다음 작업 시 관련 `CLAUDE.md`도 함께 수정할 것
- 프로젝트 구조 변경 (폴더 추가/삭제/이동)
- 새로운 컨벤션 도입 또는 기존 컨벤션 변경
- 트러블슈팅 해결 (재발 방지를 위한 주의사항 기록)
- 새 도메인/라우터/스키마 추가
- 의존성 추가 또는 설정 변경
