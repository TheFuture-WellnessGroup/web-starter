# Domain Layer

비즈니스 도메인별로 분리된 Bounded Context를 관리하는 레이어입니다.

**하위 도메인**:
- [auth/](./auth/CLAUDE.md) - 인증/인가 (Better Auth)
- [user/](./user/CLAUDE.md) - 사용자 관리
- [shared/](./shared/CLAUDE.md) - 도메인 간 공유 코드

## 폴더 구조

```
domain/
├── <domain-name>/        # 개별 도메인 (user, order, product 등)
│   ├── models/           # 도메인 모델, 타입, Zod 스키마
│   ├── actions/server/   # Server Actions ('use server')
│   ├── actions/client/   # 클라이언트 로직 (폼 검증, 계산)
│   ├── queries/          # 데이터 조회 함수
│   ├── router.ts         # tRPC 라우터
│   ├── repository.ts     # DB 접근 계층
│   ├── ui/               # 도메인 전용 UI 컴포넌트
│   ├── hooks/            # 도메인 전용 React Hooks
│   └── index.ts          # Public API
└── shared/               # 도메인 간 공유 코드
```

## 핵심 규칙

1. **도메인 간 직접 import 금지**
   - `domain/user/`에서 `domain/order/` 직접 import 불가
   - 필요시 `domain/shared/`를 통해 공유

2. **의존성 방향**
   ```
   ui/ → hooks/ → actions/, queries/ → repository/ → models/
   ```

3. **models/는 순수하게 유지**
   - 외부 의존성 없이 타입과 스키마만 정의
   - DB 스키마(`db/schema/`)에서 타입 추론 가능

4. **repository.ts는 DB 접근만 담당**
   - 비즈니스 로직 없이 CRUD 연산만 수행
   - `db/` 모듈은 repository에서만 import

## 새 도메인 추가 시

1. `domain/<name>/` 폴더 생성
2. 최소 파일: `models/index.ts`, `router.ts`, `repository.ts`, `index.ts`
3. `server/api/root.ts`에 라우터 등록
4. 필요시 `db/schema/`에 테이블 스키마 추가
