# User Domain

사용자 관리 도메인입니다.

## 현재 구조

```
domain/user/
├── models/
│   ├── User.ts           # User 타입, Zod 스키마
│   └── index.ts
├── router.ts             # tRPC 라우터 (list, byId, create, update, delete)
├── repository.ts         # DB 접근 (userRepository)
└── index.ts              # Public API
```

## 사용 가능한 API

**tRPC 엔드포인트**:
- `user.list` - 전체 사용자 목록
- `user.byId` - ID로 사용자 조회
- `user.create` - 사용자 생성
- `user.update` - 사용자 수정
- `user.delete` - 사용자 삭제

**타입/스키마**:
- `User`, `NewUser` - Drizzle 추론 타입
- `createUserSchema`, `updateUserSchema` - Zod 스키마

## 확장 시 추가할 것

- `actions/server/` - 복잡한 비즈니스 로직 (예: 회원가입 플로우)
- `queries/` - 복잡한 조회 로직 (예: 필터링, 페이지네이션)
- `ui/` - UserList, UserForm 등 도메인 UI
- `hooks/` - useUsers, useUser 등 React Hooks
