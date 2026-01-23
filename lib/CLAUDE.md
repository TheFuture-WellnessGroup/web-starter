# Lib (Infrastructure Utilities)

인프라 수준의 유틸리티와 설정을 관리합니다.

## 폴더 구조

```
lib/
├── env.ts            # 환경변수 검증 (@t3-oss/env)
├── utils.ts          # cn() 등 공통 유틸리티
└── trpc/
    ├── client.ts     # tRPC React 클라이언트
    └── server.ts     # tRPC 서버 caller
```

## 주요 유틸리티

### cn() - 클래스 조합
```typescript
import { cn } from "@/lib/utils";

cn("px-4 py-2", isActive && "bg-primary", className);
```

### 환경변수
```typescript
import { env } from "@/lib/env";

env.DATABASE_URL  // 타입 안전한 환경변수 접근
```

## 규칙

1. **도메인 로직 금지**
   - 순수 인프라/유틸리티 코드만
   - 비즈니스 로직은 `domain/`에 배치

2. **환경변수는 env.ts에서 검증**
   - Zod로 런타임 검증
   - 서버/클라이언트 분리

3. **tRPC 클라이언트 직접 수정 지양**
   - 설정 변경만 허용
   - 로직은 도메인 라우터에서 처리
