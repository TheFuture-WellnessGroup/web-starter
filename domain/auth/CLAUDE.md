# Auth Domain (Better Auth)

Better Auth 기반의 인증/인가 도메인입니다.

## 폴더 구조

```
domain/auth/
├── auth.ts           # Better Auth 서버 인스턴스 (서버 전용)
├── auth-client.ts    # Better Auth 클라이언트 (클라이언트 컴포넌트용)
├── index.ts          # Public API
└── CLAUDE.md         # 도메인 문서
```

## 사용법

### Server Component / Server Action

```typescript
import { auth } from "@/domain/auth";

// 세션 조회
const session = await auth.api.getSession({
  headers: await headers(),
});
```

### Client Component

```typescript
"use client";
import { useSession, signIn, signUp, signOut } from "@/domain/auth";

function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return <button onClick={() => signOut()}>로그아웃</button>;
  }

  return (
    <button onClick={() => signIn.email({ email, password })}>
      로그인
    </button>
  );
}
```

### tRPC Context

```typescript
// server/api/trpc.ts 에서 세션을 context에 추가
import { auth } from "@/domain/auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    db,
    session,
    ...opts,
  };
};
```

## API Route

- **경로**: `/api/auth/[...all]`
- **파일**: `app/api/auth/[...all]/route.ts`
- Better Auth의 모든 인증 엔드포인트를 자동 처리

### 주요 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/auth/sign-up/email` | POST | 이메일 회원가입 |
| `/api/auth/sign-in/email` | POST | 이메일 로그인 |
| `/api/auth/sign-out` | POST | 로그아웃 |
| `/api/auth/get-session` | GET | 세션 조회 |

## 환경변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `BETTER_AUTH_SECRET` | 인증 시크릿 키 (32자 이상) | `openssl rand -base64 32`로 생성 |
| `BETTER_AUTH_URL` | 앱 URL | `http://localhost:3000` |

## DB 스키마

Better Auth가 사용하는 테이블은 `db/schema/auth.ts`에 정의되어 있습니다.
기존 `users` 테이블과는 별개이며, auth 전용 prefix가 붙어 있습니다.

| Export 이름 | 테이블명 | 설명 |
|------------|---------|------|
| `authUser` | `user` | 인증 사용자 |
| `authSession` | `session` | 세션 |
| `authAccount` | `account` | OAuth 계정 연동 |
| `authVerification` | `verification` | 이메일 인증 등 |

## 확장 가이드

### OAuth 프로바이더 추가

```typescript
// domain/auth/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // ...
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
```

### Better Auth 플러그인 추가

```typescript
// domain/auth/auth.ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  // ...
  plugins: [twoFactor()],
});
```

### UI 컴포넌트 추가

인증 관련 UI는 `domain/auth/ui/`에 배치합니다.

```
domain/auth/ui/
├── LoginForm/
├── SignUpForm/
└── SessionProvider/
```

### Hooks 추가

인증 관련 커스텀 Hooks는 `domain/auth/hooks/`에 배치합니다.

```
domain/auth/hooks/
├── useAuth.ts
└── useRequireAuth.ts
```

## 규칙

1. `auth.ts`는 서버 코드에서만 import (클라이언트에서 import 시 에러 발생)
2. 클라이언트에서는 반드시 `auth-client.ts`의 export 사용
3. Better Auth 스키마 변경 시 `npx @better-auth/cli generate` 재실행
4. 도메인 간 인증 정보 공유는 tRPC context를 통해 수행
