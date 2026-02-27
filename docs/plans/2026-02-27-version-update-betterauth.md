# Version Update + Better Auth Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 전체 의존성을 최신 버전으로 업데이트하고, Better Auth 기반 인증 인프라를 DDD 구조에 맞게 통합한다.

**Architecture:** Better Auth를 `domain/auth/`에 배치하고, Drizzle 어댑터로 기존 DB 연결을 재활용한다. tRPC에 `protectedProcedure`를 추가하여 인증된 요청만 처리하는 프로시저를 지원한다. Next.js 미들웨어로 라우트 보호를 구현한다.

**Tech Stack:** Better Auth, Drizzle ORM (pg adapter), Next.js 16 App Router, tRPC v11

---

### Task 1: Update all dependencies to latest versions

**Files:**
- Modify: `package.json`

**Step 1: Update all dependencies**

```bash
npm update
```

그 다음 주요 패키지를 최신 버전으로 업데이트:

```bash
npm install next@latest react@latest react-dom@latest @trpc/client@latest @trpc/next@latest @trpc/react-query@latest @trpc/server@latest
npm install -D @biomejs/biome@latest
```

**Step 2: Verify build**

```bash
npx tsc --noEmit
npm run build
```

Expected: 에러 없이 빌드 성공

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: update all dependencies to latest versions"
```

---

### Task 2: Install Better Auth and generate auth schema

**Files:**
- Modify: `package.json`
- Create: `domain/auth/auth.ts`
- Create: `db/schema/auth.ts`
- Modify: `db/schema/index.ts`

**Step 1: Install Better Auth**

```bash
npm install better-auth
```

**Step 2: Create Better Auth server config**

Create `domain/auth/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
  },
});
```

**Step 3: Generate Drizzle schema with Better Auth CLI**

```bash
npx @better-auth/cli generate --config domain/auth/auth.ts
```

이렇게 하면 Drizzle 스키마 파일이 생성된다. 생성된 스키마를 `db/schema/auth.ts`로 이동/정리한다.

**Step 4: Export auth schema from db/schema/index.ts**

Modify `db/schema/index.ts`:

```typescript
export * from "./users";
export * from "./auth";
```

**Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: 타입 에러 없음

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: install better-auth and generate auth schema"
```

---

### Task 3: Set up auth environment variables

**Files:**
- Modify: `lib/env.ts`
- Modify: `.env` (또는 `.env.local`)

**Step 1: Add auth env vars to validation**

Modify `lib/env.ts` - server 섹션에 추가:

```typescript
BETTER_AUTH_SECRET: z.string().min(32),
BETTER_AUTH_URL: z.string().url(),
```

runtimeEnv에도 추가:

```typescript
BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
```

**Step 2: Add env vars to .env.local**

```
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
```

**Step 3: Verify**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add lib/env.ts
git commit -m "feat: add Better Auth environment variables"
```

---

### Task 4: Create auth API route handler

**Files:**
- Create: `app/api/auth/[...all]/route.ts`

**Step 1: Create the route handler**

Create `app/api/auth/[...all]/route.ts`:

```typescript
import { auth } from "@/domain/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

**Step 2: Verify build**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add app/api/auth/
git commit -m "feat: add Better Auth API route handler"
```

---

### Task 5: Create auth client and domain structure

**Files:**
- Create: `domain/auth/auth-client.ts`
- Create: `domain/auth/index.ts`
- Create: `domain/auth/CLAUDE.md`

**Step 1: Create auth client**

Create `domain/auth/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
```

**Step 2: Create public API**

Create `domain/auth/index.ts`:

```typescript
// Auth server instance (서버 코드에서만 사용)
export { auth } from "./auth";

// Auth client (클라이언트 컴포넌트에서 사용)
export { authClient, signIn, signUp, signOut, useSession } from "./auth-client";
```

**Step 3: Create domain CLAUDE.md**

Create `domain/auth/CLAUDE.md`:

```markdown
# Auth Domain (Better Auth)

Better Auth 기반 인증/인가를 관리하는 도메인입니다.

## 현재 구조

\`\`\`
domain/auth/
├── auth.ts              # Better Auth 서버 인스턴스
├── auth-client.ts       # Better Auth 클라이언트 (React hooks)
├── index.ts             # Public API
└── CLAUDE.md
\`\`\`

## 사용법

**서버 (tRPC, Server Actions, RSC):**
\`\`\`typescript
import { auth } from "@/domain/auth/auth";

const session = await auth.api.getSession({ headers: await headers() });
\`\`\`

**클라이언트 컴포넌트:**
\`\`\`typescript
import { useSession, signIn, signOut } from "@/domain/auth";

const { data: session } = useSession();
await signIn.email({ email, password });
await signOut();
\`\`\`

## API Route

- `app/api/auth/[...all]/route.ts` - Better Auth HTTP handler
- 모든 인증 관련 요청은 `/api/auth/*`로 처리

## 환경변수

- `BETTER_AUTH_SECRET` - 암호화 시크릿 (최소 32자)
- `BETTER_AUTH_URL` - 앱 기본 URL

## 확장 시

- OAuth 소셜 로그인: `auth.ts`의 `socialProviders`에 추가
- 플러그인: `auth.ts`의 `plugins` 배열에 추가 후 CLI 재실행
- 인증 UI: `ui/` 폴더에 로그인/회원가입 컴포넌트 추가
- Hooks: `hooks/` 폴더에 인증 관련 커스텀 훅 추가
```

**Step 4: Verify**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add domain/auth/
git commit -m "feat: create auth domain with client and documentation"
```

---

### Task 6: Add protectedProcedure to tRPC

**Files:**
- Modify: `server/api/trpc.ts`

**Step 1: Add protectedProcedure**

Modify `server/api/trpc.ts` - context에 세션을 추가하고 protectedProcedure를 생성:

```typescript
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod/v4";
import { db } from "@/db";
import { auth } from "@/domain/auth/auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers: opts.headers });

  return {
    db,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});
```

**Step 2: Verify**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add server/api/trpc.ts
git commit -m "feat: add protectedProcedure with Better Auth session"
```

---

### Task 7: Add Next.js middleware for route protection

**Files:**
- Create: `middleware.ts` (프로젝트 루트)

**Step 1: Create middleware**

Create `middleware.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // 인증된 사용자가 로그인/회원가입 페이지 접근 시 대시보드로 리다이렉트
  if (sessionCookie && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 미인증 사용자가 보호된 라우트 접근 시 로그인으로 리다이렉트
  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
```

**Step 2: Verify**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add Next.js middleware for auth route protection"
```

---

### Task 8: Update CLAUDE.md files

**Files:**
- Modify: `CLAUDE.md` (루트)
- Modify: `domain/CLAUDE.md`
- Modify: `server/CLAUDE.md`
- Modify: `db/CLAUDE.md`

**Step 1: Update root CLAUDE.md**

- 환경변수 섹션에 `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` 추가
- Project Structure에 `domain/auth/` 추가
- Code Conventions에 `protectedProcedure` 사용법 추가
- `middleware.ts` 설명 추가

**Step 2: Update domain/CLAUDE.md**

하위 도메인 목록에 추가:
```
- [auth/](./auth/CLAUDE.md) - 인증/인가 (Better Auth)
```

**Step 3: Update server/CLAUDE.md**

프로시저 종류에 추가:
```
- `protectedProcedure` - Better Auth 세션 검증 필요
```

**Step 4: Update db/CLAUDE.md**

스키마 목록에 추가:
```
├── auth.ts       # Better Auth 테이블 (user, session, account, verification)
```

**Step 5: Commit**

```bash
git add CLAUDE.md domain/CLAUDE.md server/CLAUDE.md db/CLAUDE.md
git commit -m "docs: update CLAUDE.md files with auth domain documentation"
```

---

### Task 9: Push auth schema to database and verify

**Step 1: Start DB (if not running)**

```bash
npm run docker:dev
```

**Step 2: Push schema**

```bash
npm run db:push
```

Expected: 모든 테이블 생성 성공 (users, user, session, account, verification)

**Step 3: Final build verification**

```bash
npm run lint
npm run build
```

Expected: 린트 + 빌드 모두 성공

**Step 4: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: finalize auth schema and verify build"
```
