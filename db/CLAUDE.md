# Database Layer (Drizzle ORM)

PostgreSQL 데이터베이스 스키마와 연결을 관리합니다.

## 폴더 구조

```
db/
├── schema/
│   ├── users.ts      # users 테이블 스키마
│   ├── auth.ts       # Better Auth 테이블 (user, session, account, verification)
│   └── index.ts      # 스키마 re-export
└── index.ts          # DB 연결 인스턴스
```

## 규칙

1. **스키마 정의**
   - 테이블별 파일 분리: `schema/<table>.ts`
   - `index.ts`에서 모든 스키마 re-export

2. **Zod 스키마 생성**
   ```typescript
   import { createInsertSchema, createSelectSchema } from "drizzle-zod";

   export const insertUserSchema = createInsertSchema(users);
   export const selectUserSchema = createSelectSchema(users);
   ```

3. **DB import 제한**
   - `db/` 모듈은 `domain/*/repository.ts`에서만 import
   - 프론트엔드 코드에서 직접 import 금지

## 명령어

```bash
bun run db:push      # 스키마를 DB에 푸시 (개발용)
bun run db:studio    # Drizzle Studio 실행
bun run docker:dev   # PostgreSQL 컨테이너 실행
```

## 새 테이블 추가 시

1. `db/schema/<table>.ts` 파일 생성
2. `db/schema/index.ts`에서 export
3. `bun run db:push` 실행
4. 해당 도메인의 `repository.ts`에서 사용
