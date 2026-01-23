# Server Layer (tRPC)

tRPC 서버 설정과 공통 프로시저를 관리합니다.

## 폴더 구조

```
server/
└── api/
    ├── trpc.ts       # tRPC 초기화, context, procedures
    └── root.ts       # 루트 라우터 (도메인 라우터 등록)
```

## 규칙

1. **라우터는 domain/에서 정의**
   - 각 도메인의 `router.ts`에서 라우터 정의
   - `root.ts`에서 import하여 등록만 함

2. **프로시저 종류**
   - `publicProcedure` - 인증 불필요
   - (추후) `protectedProcedure` - 인증 필요

3. **Context**
   - `db` - Drizzle 인스턴스
   - `headers` - HTTP 헤더

## 새 도메인 라우터 등록

```typescript
// server/api/root.ts
import { userRouter } from "@/domain/user";
import { orderRouter } from "@/domain/order";  // 새로 추가

export const appRouter = createTRPCRouter({
  user: userRouter,
  order: orderRouter,  // 새로 추가
});
```

## 클라이언트 사용법

**Server Component**:
```typescript
import { api } from "@/lib/trpc/server";

const caller = await api();
const users = await caller.user.list();
```

**Client Component**:
```typescript
import { trpc } from "@/lib/trpc/client";

const { data } = trpc.user.list.useQuery();
```
