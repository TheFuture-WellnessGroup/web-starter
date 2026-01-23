# Components

공통 UI 컴포넌트를 관리합니다.

## 폴더 구조

```
components/
├── ui/              # shadcn/ui 컴포넌트 (자동 생성)
├── providers/       # React Context Providers
└── ...              # 기타 공통 컴포넌트
```

## 규칙

1. **shadcn/ui 우선 사용**
   - 새 컴포넌트 만들기 전에 shadcn/ui에 있는지 확인
   - `bunx shadcn@latest add <component>` 로 추가

2. **ui/ 폴더 직접 수정 지양**
   - shadcn/ui가 생성한 파일은 가급적 수정하지 않음
   - 커스터마이징 필요시 wrapper 컴포넌트 생성

3. **도메인 종속 컴포넌트는 domain/*/ui/에**
   - 특정 도메인에서만 사용하는 컴포넌트는 해당 도메인 폴더에 배치

## 스타일링

- CVA(class-variance-authority)로 variants 정의
- `cn()` 유틸리티로 클래스 조합
- CSS 변수 기반 컬러 시스템 사용
