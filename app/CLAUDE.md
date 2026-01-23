# App Layer (Next.js App Router)

라우팅과 페이지 렌더링만 담당합니다.

## 규칙

1. **`page.tsx`에서 `"use client"` 금지**
   - 페이지는 항상 Server Component
   - 클라이언트 로직은 별도 컴포넌트로 분리

2. **비즈니스 로직 금지**
   - 페이지는 도메인 UI 컴포넌트를 조합만 함
   - 데이터 페칭은 tRPC 또는 Server Actions 사용

3. **Route Groups 활용**
   ```
   app/
   ├── (public)/       # 인증 불필요 페이지
   ├── (dashboard)/    # 인증 필요 페이지
   └── api/            # API 라우트
   ```

## 페이지 작성 패턴

```tsx
// app/(dashboard)/users/page.tsx
import { Suspense } from "react";
import { UserList } from "@/domain/user";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <UserList />
    </Suspense>
  );
}
```

## 파일 컨벤션

- `page.tsx` - 페이지 컴포넌트
- `layout.tsx` - 레이아웃
- `loading.tsx` - 로딩 UI
- `error.tsx` - 에러 UI
- `not-found.tsx` - 404 UI
